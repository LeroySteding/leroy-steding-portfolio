# Calendly Integration Setup Guide

This document explains how to configure and use the Calendly integration in your portfolio.

## 🎯 Overview

The portfolio now includes a complete Calendly scheduling integration with:
- ✅ Dedicated booking pages (English and Dutch)
- ✅ Reusable components (Widget, Modal, Button)
- ✅ Full i18n support
- ✅ Analytics tracking
- ✅ Free plan compatible

## 📋 Setup Instructions

### 1. Sign Up for Calendly

1. Go to [calendly.com](https://calendly.com) and create a free account
2. Create your first event type (e.g., "30-Minute Consultation")
3. Connect your calendar (Google Calendar, iCloud, or Outlook)
4. Customize your booking page settings

### 2. Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Add your Calendly URL:

```env
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/consultation
NEXT_PUBLIC_CALENDLY_USERNAME=your-username
```

**How to find your Calendly URL:**
1. Log in to Calendly
2. Click on your event type
3. Click "Copy Link" - this is your `NEXT_PUBLIC_CALENDLY_URL`

### 3. Test the Integration

```bash
pnpm dev
```

Visit:
- English booking page: `http://localhost:3000/book`
- Dutch booking page: `http://localhost:3000/nl/book`
- Contact page (updated link): `http://localhost:3000/contact`

## 📂 Files Created

### Components
- `components/ui/CalendlyWidget.tsx` - Inline embed widget
- `components/ui/CalendlyModal.tsx` - Popup modal widget
- `components/ui/CalendlyButton.tsx` - CTA button component

### Pages
- `app/book/page.tsx` - English booking page (metadata)
- `app/book/BookingPageClient.tsx` - Booking page client component
- `app/nl/book/page.tsx` - Dutch booking page

### Configuration
- `.env.example` - Environment variable template
- `locales/en.ts` - English translations (added `booking` section)
- `locales/nl.ts` - Dutch translations (added `booking` section)

### Modified Files
- `package.json` - Added `react-calendly` dependency
- `app/contact/page.tsx` - Updated "Schedule Meeting" link to `/book`

## 🎨 Using the Components

### CalendlyWidget (Inline Embed)

```tsx
import CalendlyWidget from "@/components/ui/CalendlyWidget";

<CalendlyWidget
  url="https://calendly.com/your-username/event"
  styles={{ height: "700px", width: "100%" }}
  pageSettings={{
    backgroundColor: "ffffff",
    primaryColor: "0066ff",
    textColor: "333333",
  }}
  onEventScheduled={(e) => {
    console.log("Event scheduled!", e);
  }}
/>
```

### CalendlyModal (Popup on Click)

```tsx
import CalendlyModal from "@/components/ui/CalendlyModal";

<CalendlyModal
  buttonText="Schedule a Call"
  buttonClassName="btn-primary"
  onEventScheduled={(e) => {
    console.log("Booking confirmed!", e);
  }}
/>
```

### CalendlyButton (Simple Button)

```tsx
import CalendlyButton from "@/components/ui/CalendlyButton";

<CalendlyButton
  text="Book a Meeting"
  variant="primary" // or "secondary", "outline"
/>
```

## 📊 Analytics Tracking

All components automatically track these events with Google Analytics:

- `calendly_profile_viewed` - When booking page loads
- `calendly_date_selected` - When user selects a date/time
- `calendly_event_type_viewed` - When user views event details
- `calendly_event_scheduled` - When booking is confirmed
- `calendly_modal_opened` - When modal is opened
- `calendly_modal_booking` - When booking via modal

## 🚀 Upgrading to Paid Plan

### Current Setup (Free Plan)
- ✅ Unlimited bookings
- ✅ 1 event type active
- ✅ 1 calendar connection
- ⚠️ "Powered by Calendly" branding visible

### Upgrade to Standard ($10/month)
To remove branding and add features:

1. Upgrade at [calendly.com/app/billing](https://calendly.com/app/billing)
2. No code changes needed - just upgrade your account
3. Benefits:
   - Remove "Powered by Calendly" branding
   - Unlimited event types
   - 6 calendar connections
   - Custom colors (update `pageSettings` in components)

### Custom Colors (After Upgrade)

Update the `pageSettings` in your components:

```tsx
<CalendlyWidget
  pageSettings={{
    backgroundColor: "1a1a1a",  // Your background color
    primaryColor: "0066ff",      // Your accent color
    textColor: "e5e5e5",         // Your text color
  }}
/>
```

## 🌐 Available Routes

- `/book` - English booking page
- `/nl/book` - Dutch booking page
- `/contact` - Contact page (links to `/book`)
- `/nl/contact` - Dutch contact page (links to `/nl/book`)

## 🔧 Customization

### Change Event Type

Update the URL in your `.env.local`:

```env
# For different event types, just change the event slug
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/quick-chat
# or
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/technical-consultation
```

### Multiple Event Types

Create multiple event types in Calendly and use different URLs:

```tsx
// Quick 15-minute chat
<CalendlyWidget url="https://calendly.com/yourname/15min" />

// Standard 30-minute consultation
<CalendlyWidget url="https://calendly.com/yourname/30min" />

// Deep dive 60-minute session
<CalendlyWidget url="https://calendly.com/yourname/60min" />
```

### Prefill Form Data

```tsx
<CalendlyWidget
  prefill={{
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
  }}
/>
```

### UTM Tracking

```tsx
<CalendlyWidget
  utm={{
    utmSource: "portfolio",
    utmMedium: "booking_page",
    utmCampaign: "spring_2025",
  }}
/>
```

## 🎯 Next Steps

1. ✅ Sign up for Calendly free account
2. ✅ Create your first event type
3. ✅ Connect your calendar
4. ✅ Copy your Calendly URL to `.env.local`
5. ✅ Test the booking flow
6. ✅ Customize colors (if using paid plan)
7. ✅ Set up email notifications in Calendly
8. ✅ Configure confirmation and reminder emails

## 💡 Tips

- **Free Plan Testing**: Start with the free plan to test demand
- **Upgrade When Ready**: Upgrade to Standard ($10/mo) once you get regular bookings
- **Multiple Events**: Create different event types for different purposes
- **Calendar Sync**: Make sure calendar is synced to avoid double bookings
- **Time Zones**: Calendly automatically handles time zones
- **Reminders**: Set up email/SMS reminders in Calendly settings

## 🆘 Troubleshooting

### Widget Not Loading
- Check that `NEXT_PUBLIC_CALENDLY_URL` is set in `.env.local`
- Verify the URL format is correct
- Clear cache and restart dev server: `pnpm dev`

### Wrong Calendar Showing
- Update the Calendly URL in `.env.local`
- Restart the dev server

### Branding Not Removed
- You need to upgrade to Standard plan ($10/mo minimum)
- Free plan always shows "Powered by Calendly"

### Analytics Not Tracking
- Verify Google Analytics is set up on your site
- Check browser console for `gtag` function
- Events only fire when actual bookings occur

## 📚 Resources

- [Calendly Documentation](https://help.calendly.com/)
- [react-calendly Package](https://www.npmjs.com/package/react-calendly)
- [Calendly Embed Options](https://developer.calendly.com/api-docs/ZG9jOjM2MzE2MDM4-embed-options)
- [Calendly Pricing](https://calendly.com/pricing)

## 🔄 Switching Providers (Future)

The components are designed to be provider-agnostic. To switch to Cal.com or TidyCal:

1. Update environment variables
2. Replace component implementations
3. Keep the same page structure and translations

This modular approach makes it easy to switch providers later if needed.
