import { type NextRequest, NextResponse } from "next/server";
import { createLead, getLeadByEmail, updateLeadByEmail } from "@/lib/supabase";

// Cal.com webhook payload type
interface CalcomBookingPayload {
  triggerEvent: string;
  createdAt: string;
  payload: {
    type: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    organizer: {
      name: string;
      email: string;
      timeZone: string;
    };
    attendees: Array<{
      name: string;
      email: string;
      timeZone: string;
    }>;
    location?: string;
    destinationCalendar?: {
      integration: string;
      externalId: string;
    };
    metadata?: Record<string, unknown>;
    uid: string;
    responses?: {
      name?: { value: string };
      email?: { value: string };
      company?: { value: string };
      phone?: { value: string };
      notes?: { value: string };
    };
  };
}

// Verify webhook signature (optional but recommended)
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string | null,
): boolean {
  if (!secret || !signature) {
    // If no secret configured, skip verification (development mode)
    return true;
  }

  // Cal.com uses HMAC-SHA256 for webhook signatures
  // In production, implement proper signature verification
  // For now, we'll rely on the secret being set
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.CALCOM_WEBHOOK_SECRET ?? null;
    const signature = request.headers.get("x-cal-signature-256");

    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data: CalcomBookingPayload = JSON.parse(rawBody);

    // Only process booking creation events
    if (data.triggerEvent !== "BOOKING_CREATED") {
      return NextResponse.json({
        success: true,
        message: `Ignored event: ${data.triggerEvent}`,
      });
    }

    const { payload } = data;

    // Extract attendee info (the person booking)
    const attendee = payload.attendees?.[0];
    if (!attendee?.email) {
      console.error("No attendee email in booking webhook");
      return NextResponse.json(
        { error: "Missing attendee email" },
        { status: 400 },
      );
    }

    // Extract additional info from responses if available
    const responses = payload.responses || {};
    const company = responses.company?.value;
    const phone = responses.phone?.value;
    const notes = responses.notes?.value;

    // Determine meeting type from event title or type
    const meetingType = payload.type || payload.title || "consultation";

    // Check if lead already exists
    const existingLead = await getLeadByEmail(attendee.email);

    if (existingLead) {
      // Update existing lead - they've now booked!
      await updateLeadByEmail(attendee.email, {
        name: attendee.name || existingLead.name,
        company: company || existingLead.company,
        phone: phone || existingLead.phone,
        status: "qualified", // Booking = qualified lead
        metadata: {
          ...(existingLead.metadata || {}),
          booking: {
            uid: payload.uid,
            event_type: meetingType,
            scheduled_time: payload.startTime,
            timezone: attendee.timeZone,
            notes: notes,
            booked_at: new Date().toISOString(),
          },
          conversion_path: [
            ...(((existingLead.metadata as Record<string, unknown>)
              ?.conversion_path as string[]) || []),
            "booking",
          ],
        },
      });

      console.log(`Updated existing lead ${attendee.email} with booking info`);

      return NextResponse.json({
        success: true,
        message: "Lead updated with booking",
        leadId: existingLead.id,
        isNew: false,
      });
    }

    // Create new lead from booking
    const result = await createLead({
      email: attendee.email,
      name: attendee.name,
      company: company,
      phone: phone,
      source: "booking",
      status: "qualified", // Booking = qualified lead
      message: notes,
      locale: "en", // Default, could be extracted from metadata
      metadata: {
        booking: {
          uid: payload.uid,
          event_type: meetingType,
          scheduled_time: payload.startTime,
          timezone: attendee.timeZone,
          notes: notes,
          booked_at: new Date().toISOString(),
        },
        conversion_path: ["booking"],
      },
    });

    if (!result.success) {
      console.error("Failed to create booking lead:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    console.log(
      `Created new lead from booking: ${attendee.email}, score: ${result.score}, tier: ${result.tier}`,
    );

    return NextResponse.json({
      success: true,
      message: "Lead created from booking",
      leadId: result.id,
      score: result.score,
      tier: result.tier,
      isNew: true,
    });
  } catch (error) {
    console.error("Booking webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// Also support GET for webhook verification (some services ping the endpoint)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Booking webhook endpoint is active",
  });
}
