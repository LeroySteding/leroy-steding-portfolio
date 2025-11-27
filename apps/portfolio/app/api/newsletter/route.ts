import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limit: 3 requests per minute per IP
const RATE_LIMIT = { limit: 3, windowSeconds: 60 };

interface NewsletterData {
  email: string;
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

    const body: NewsletterData = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Send confirmation email to subscriber
    const { error: subscriberError } = await resend.emails.send({
      from: "Leroy Steding <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to my newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 32px;">
          <h1 style="color: #22d3ee; margin-bottom: 24px;">Thanks for subscribing!</h1>
          
          <p style="color: #d4d4d8; line-height: 1.6;">
            Hi there! 👋
          </p>
          
          <p style="color: #d4d4d8; line-height: 1.6;">
            Thank you for subscribing to my newsletter. I'm excited to share updates about:
          </p>
          
          <ul style="color: #d4d4d8; line-height: 1.8;">
            <li>New projects and case studies</li>
            <li>Tech insights and tutorials</li>
            <li>Industry trends and best practices</li>
            <li>Exclusive content and resources</li>
          </ul>
          
          <p style="color: #d4d4d8; line-height: 1.6;">
            I typically send emails once or twice a month - no spam, I promise!
          </p>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #27272a;">
            <p style="color: #71717a; font-size: 14px;">
              Best regards,<br/>
              <strong style="color: #22d3ee;">Leroy Steding</strong><br/>
              Full-Stack Developer
            </p>
          </div>
          
          <p style="color: #52525b; font-size: 12px; margin-top: 24px;">
            If you didn't subscribe to this newsletter, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (subscriberError) {
      console.error("Failed to send confirmation email:", subscriberError);
      // Continue anyway - subscriber email is nice-to-have
    }

    // Send notification to admin
    const { error: adminError } = await resend.emails.send({
      from: "Newsletter <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "leroy@steding.digital",
      subject: "New Newsletter Subscriber",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22d3ee;">🎉 New Newsletter Subscriber!</h2>
          <hr style="border: 1px solid #e5e7eb;" />
          
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subscribed at:</strong> ${new Date().toISOString()}</p>
          
          <hr style="border: 1px solid #e5e7eb; margin-top: 24px;" />
          <p style="color: #6b7280; font-size: 12px;">
            This notification was sent from your portfolio newsletter form.
          </p>
        </div>
      `,
    });

    if (adminError) {
      console.error("Failed to send admin notification:", adminError);
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
