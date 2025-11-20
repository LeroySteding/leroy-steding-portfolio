# Cal.com Event Types Setup

Quick guide to create all three event types in your Cal.com account.

## Required Event Types

You need to create these three event types in Cal.com for the booking page to work properly:

### 1. Quick Chat (15 minutes)
- **Event Name**: Quick Chat
- **URL slug**: `quick-chat`
- **Full URL**: `cal.com/steding/quick-chat`
- **Duration**: 15 minutes
- **Location**: Google Meet
- **Color**: Green

### 2. Project Consultation (30 minutes) - PRIMARY
- **Event Name**: Project Consultation  
- **URL slug**: `consultation`
- **Full URL**: `cal.com/steding/consultation`
- **Duration**: 30 minutes
- **Location**: Google Meet
- **Color**: Blue

### 3. Technical Deep Dive (60 minutes)
- **Event Name**: Technical Deep Dive
- **URL slug**: `deep-dive`
- **Full URL**: `cal.com/steding/deep-dive`
- **Duration**: 60 minutes
- **Location**: Google Meet
- **Color**: Purple

## Setup Steps

1. **Go to Cal.com Dashboard**: https://app.cal.com
2. **Navigate to Event Types**: Click "Event Types" in the sidebar
3. **Create New Event Type**: Click "+ New Event Type" button
4. **Fill in the details** for each event type using the info above
5. **Important Settings**:
   - ⬜ **TURN OFF** "Requires confirmation" (for instant booking)
   - ☑️ **TURN ON** "Check for conflicts across all calendars"
   - Set buffer times (before/after)
   - Set minimum notice time
   - Configure questions for invitees

## Verification

After creating all three event types, verify they're accessible:

- ✅ Visit: `cal.com/steding/quick-chat`
- ✅ Visit: `cal.com/steding/consultation`  
- ✅ Visit: `cal.com/steding/deep-dive`

Each URL should show the booking calendar for that specific event type.

## Environment Variables

Your `.env.local` is already configured with:

```env
NEXT_PUBLIC_CALCOM_URL=steding/consultation
NEXT_PUBLIC_CALCOM_QUICK_CHAT=steding/quick-chat
NEXT_PUBLIC_CALCOM_DEEP_DIVE=steding/deep-dive
```

## How It Works

1. User selects a meeting type on `/book` page
2. The calendar widget updates to show that specific event type
3. User books directly into the selected event type
4. You receive notification with the event details

## Testing

1. Restart your dev server: `npm run dev`
2. Visit: `http://localhost:3000/book`
3. Click each meeting type button (Quick Chat, Consultation, Deep Dive)
4. Verify the calendar updates when you switch between them
5. Try booking a test appointment

## Full Details

For complete setup instructions including descriptions, questions, and notifications, see:
- [CALCOM_PROFILE_SETUP.md](./CALCOM_PROFILE_SETUP.md)
