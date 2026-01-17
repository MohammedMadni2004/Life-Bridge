# Calendly Integration Guide

## Step 1: Create a Calendly Account

1. Go to [calendly.com](https://calendly.com) and sign up for a free account
2. Complete your profile setup

## Step 2: Create Your First Event Type

1. In your Calendly dashboard, click **"Event Types"** in the left sidebar
2. Click **"+ New Event Type"**
3. Choose **"One-on-One"** (for individual consultations)
4. Configure your event:
   - **Name**: "15-Minute Free Consultation" (or whatever you prefer)
   - **Duration**: 15 minutes
   - **Location**: Choose "Phone call" or "Video call" (Zoom, Google Meet, etc.)
   - **Description**: Add details about what the call covers

## Step 3: Set Your Availability

### Option A: Set Default Availability (Recommended)

1. Go to **"Availability"** in the left sidebar
2. Click **"Add Availability"** or edit your default schedule
3. Set your regular working hours:
   - Example: Monday-Friday, 9 AM - 5 PM
   - You can set different hours for different days

### Option B: Block Specific Dates/Times

1. Go to **"Availability"** → **"Unavailable Times"**
2. Click **"+ Add Unavailable Time"**
3. Select the date/time you're busy (e.g., tomorrow)
4. Calendly will automatically hide those slots from booking

### Option C: Use Calendar Sync (Best for Busy Schedules)

1. Go to **"Calendar Connections"** in settings
2. Connect your Google Calendar, Outlook, or iCloud
3. Calendly will automatically block times when you have existing events
4. This way, if you're busy tomorrow, it won't show as available!

## Step 4: Get Your Calendly Link

1. Go back to **"Event Types"**
2. Click on your event (e.g., "15-Minute Free Consultation")
3. You'll see a link like: `https://calendly.com/your-username/15min`
4. Copy this entire URL

## Step 5: Update Your Website Code

Open `src/pages/index.astro` and find line 16:

```astro
const calendlyUrl = "https://calendly.com/your-username/15min";
```

Replace `"https://calendly.com/your-username/15min"` with your actual Calendly URL.

## Step 6: Test It!

1. Save the file
2. The dev server should auto-reload
3. Click any "Book a Free Call" button on your website
4. The Calendly popup should appear with your available time slots

## Managing Availability Day-to-Day

### To Block Tomorrow (or any specific day):

1. Log into Calendly
2. Go to **"Availability"** → **"Unavailable Times"**
3. Click **"+ Add Unavailable Time"**
4. Select tomorrow's date and time range
5. Click **"Save"**

### To Make Yourself Available After a Certain Date:

1. Go to **"Availability"** → **"Event Type Settings"**
2. Under **"Availability"**, you can:
   - Set a start date (e.g., "Available starting from [date]")
   - Set buffer time between meetings
   - Set advance notice requirements (e.g., "Book at least 24 hours in advance")

### Quick Tips:

- **Calendar Sync** is the easiest - it automatically blocks times from your Google/Outlook calendar
- You can set **recurring unavailable times** (e.g., every Friday afternoon)
- Set **buffer time** between meetings to avoid back-to-back calls
- Use **timezone detection** so clients see times in their local timezone

## Advanced Features (Optional)

### Custom Questions

- Add intake questions before booking (e.g., "What's your main concern?")
- Go to Event Type → **"Questions"** → **"Add Question"**

### Reminders

- Set up email/SMS reminders for both you and your clients
- Go to **"Notifications"** in settings

### Multiple Event Types

- Create different event types for different consultation lengths
- Example: "15-Min Free Call" and "60-Min Deep Dive"
- Each gets its own Calendly URL

---

**Need Help?** Check out [Calendly's Help Center](https://help.calendly.com) or their YouTube tutorials.
