# Calendar Integration - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Choose Your Provider

**Option A: Calendly (Easiest)**
1. Sign up at [calendly.com](https://calendly.com)
2. Create a free account
3. Set up your event type (e.g., "30 Minute Consultation")
4. Copy your Calendly URL

**Option B: Cal.com (Open Source)**
1. Sign up at [cal.com](https://cal.com) or self-host
2. Create your account
3. Set up your event type
4. Note your username

---

### Step 2: Configure Environment Variables

Create/update your `.env.local` file:

**For Calendly**:
```env
NEXT_PUBLIC_CALENDAR_PROVIDER=calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/yourname/30min
NEXT_PUBLIC_CALENDLY_USERNAME=yourname
```

**For Cal.com**:
```env
NEXT_PUBLIC_CALENDAR_PROVIDER=calcom
NEXT_PUBLIC_CALCOM_USERNAME=yourname
NEXT_PUBLIC_CALCOM_URL=yourname/30min
```

---

### Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## ✅ Verify It's Working

1. **Visit the booking page**: `http://localhost:3000/book`
2. **Check the calendar widget** loads correctly
3. **Test the meeting type selector** - click different options
4. **Try the footer CTA** - scroll to bottom and click "Schedule a Call"
5. **Check blog sidebar** - visit any blog post and see the booking widget

---

## 🎨 Customization Options

### Change Meeting Types

Edit `apps/portfolio/app/book/BookingPageClient.tsx`:

```typescript
const meetingTypes = [
  {
    id: "quickChat",
    title: "Your Custom Title",
    duration: "20 minutes",
    description: "Your custom description",
    // ... rest of config
  },
  // Add more types...
];
```

### Update Testimonials

Edit the `testimonials` array in `BookingPageClient.tsx`:

```typescript
const testimonials = [
  {
    name: "Client Name",
    role: "Title, Company",
    content: "Your testimonial text",
    rating: 5,
  },
  // Add more testimonials...
];
```

### Customize Colors

Calendar widget colors are set in the `calendlyPageSettings`:

```typescript
calendlyPageSettings={{
  backgroundColor: "1a1a1a",  // Dark background
  primaryColor: "0066ff",      // Accent blue
  textColor: "e5e5e5",         // Light text
}}
```

---

## 🔄 Switch Between Providers

**To switch from Calendly to Cal.com**:
1. Update `.env.local`: `NEXT_PUBLIC_CALENDAR_PROVIDER=calcom`
2. Add Cal.com credentials
3. Restart server

**To switch from Cal.com to Calendly**:
1. Update `.env.local`: `NEXT_PUBLIC_CALENDAR_PROVIDER=calendly`
2. Ensure Calendly credentials are set
3. Restart server

---

## 📱 Where Bookings Appear

After setup, users can book from:

1. **Dedicated booking page** - `/book` (EN) or `/nl/book` (NL)
2. **Navigation header** - "Book a Call" button (desktop + mobile)
3. **Footer CTA** - Prominent booking section at bottom
4. **Blog sidebar** - Widget on every blog post
5. **Hero section** - "Schedule a Call" button
6. **Contact page** - Alternative action
7. **Project pages** - Via CTA component

---

## 🎯 Success Page

After booking, users are redirected to:
- `/book/success` (English)
- `/nl/book/success` (Dutch)

This page shows:
- Confirmation message
- Next steps
- Meeting tips
- Alternative actions

---

## 🐛 Troubleshooting

**Calendar not loading?**
- Check environment variables are set correctly
- Verify `.env.local` exists and is not `.env.example`
- Restart dev server after env changes
- Check browser console for errors

**Wrong provider showing?**
- Verify `NEXT_PUBLIC_CALENDAR_PROVIDER` is set correctly
- Must be exactly `"calendly"` or `"calcom"`
- Restart server after changes

**Build errors?**
- Run `npm run build` to check for TypeScript errors
- Verify all imports are correct
- Check that all required env variables are defined

---

## 📊 Analytics

**Google Analytics Events** are tracked automatically:
- Event scheduled
- Modal opened
- Date selected (Calendly only)

Events appear in GA4 under:
- Events → `calendly_event_scheduled` or `calcom_event_scheduled`

---

## 🌍 Translations

To update translations, edit:
- `apps/portfolio/locales/en.ts` (English)
- `apps/portfolio/locales/nl.ts` (Dutch)

Look for the `booking` section.

---

## 💡 Pro Tips

1. **Test with yourself first** - Book a test meeting to verify the flow
2. **Check spam folders** - Confirmation emails might land there
3. **Set buffer times** - Add time between meetings in your calendar settings
4. **Use UTM tracking** - Track which touchpoints convert best
5. **Monitor analytics** - See where users book from most
6. **Update testimonials** - Keep social proof fresh with real client feedback
7. **A/B test meeting types** - See which durations work best

---

## 🎉 You're Ready!

Your calendar integration is complete and ready to accept bookings. Visit `/book` to see it in action!

For detailed documentation, see `CALENDAR_INTEGRATION_COMPLETE.md`.
