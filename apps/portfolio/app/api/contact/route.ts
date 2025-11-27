import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { upsertLead } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limit: 5 requests per minute per IP
const RATE_LIMIT = { limit: 5, windowSeconds: 60 };

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  subscribeToNewsletter?: boolean;
  locale?: string;
  // Honeypot field - should be empty for legitimate submissions
  website?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, RATE_LIMIT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.reset - Date.now()) / 1000,
            ).toString(),
          },
        },
      );
    }

    const body: ContactFormData = await request.json();
    const {
      name,
      email,
      company,
      phone,
      subject,
      message,
      subscribeToNewsletter,
      locale,
      website,
    } = body;

    // Honeypot check - if the hidden field is filled, it's likely a bot
    if (website) {
      // Return success to not alert the bot, but don't actually send
      console.log("Honeypot triggered - bot detected from IP:", clientIp);
      return NextResponse.json(
        { success: true, messageId: "blocked" },
        { status: 200 },
      );
    }

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Extract tracking info from request
    const userAgent = request.headers.get("user-agent") || undefined;
    const referrer = request.headers.get("referer") || undefined;

    // Parse UTM parameters from referrer if present
    let utmSource: string | undefined;
    let utmMedium: string | undefined;
    let utmCampaign: string | undefined;

    if (referrer) {
      try {
        const url = new URL(referrer);
        utmSource = url.searchParams.get("utm_source") || undefined;
        utmMedium = url.searchParams.get("utm_medium") || undefined;
        utmCampaign = url.searchParams.get("utm_campaign") || undefined;
      } catch {
        // Invalid URL, skip UTM parsing
      }
    }

    // Store lead in Supabase
    const leadResult = await upsertLead({
      email,
      name: name || undefined,
      company: company || undefined,
      phone: phone || undefined,
      source: "contact_form",
      subject: subject || undefined,
      message,
      subscribed_to_newsletter: subscribeToNewsletter || false,
      ip_address: clientIp,
      user_agent: userAgent,
      referrer,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      locale: locale || "en",
      metadata: {
        contact_timestamp: new Date().toISOString(),
        form_subject: subject,
      },
    });

    if (!leadResult.success) {
      console.error("Failed to store contact lead:", leadResult.error);
      // Continue anyway - we don't want to fail the contact if DB fails
    }

    // Send email via Resend
    const emailSubject = subject
      ? `[Portfolio Contact] ${subject}`
      : "[Portfolio Contact] New Message";

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "leroy@steding.digital",
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Contact Form Submission</h2>
          <hr style="border: 1px solid #e5e7eb;" />
          
          ${name ? `<p><strong>From:</strong> ${name}</p>` : ""}
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
          <p><strong>Locale:</strong> ${locale || "en"}</p>
          
          <h3 style="color: #374151;">Message:</h3>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
          
          ${subscribeToNewsletter ? `<p style="color: #059669; margin-top: 16px;">✅ Opted in to newsletter</p>` : ""}
          
          <hr style="border: 1px solid #e5e7eb; margin-top: 24px;" />
          <p style="color: #6b7280; font-size: 12px;">
            This message was sent from your portfolio contact form.
            ${leadResult.id && leadResult.id !== "not-configured" ? `<br/>Lead ID: ${leadResult.id}` : ""}
            ${leadResult.isNew === false ? `<br/>Note: Returning visitor (existing lead updated)` : ""}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: data?.id,
        isNewLead: leadResult.isNew !== false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
