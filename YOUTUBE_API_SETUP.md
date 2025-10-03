# YouTube API Setup Guide

This guide will help you set up the YouTube Data API v3 to fetch the latest basketball training videos from your specified channels.

## Prerequisites

- Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Name it something like "HOOPS Trainer YouTube API"

## Step 2: Enable YouTube Data API v3

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on it and click "Enable"

## Step 3: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Optional but recommended) Restrict the API key to only YouTube Data API v3

## Step 4: Add API Key to Your Project

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following line:
   ```
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with the API key you copied

## Step 5: Update the Code

The code in `/src/lib/youtube.ts` is already set up to use the YouTube API. Once you add the API key, it will automatically fetch the latest videos from the channels.

## Getting Channel IDs

To fetch videos from specific channels, you need their Channel IDs. Here's how to find them:

1. Go to the YouTube channel
2. Click on the channel name
3. Look at the URL - it should contain the channel ID (starts with "UC")
4. If the URL has a custom URL like `youtube.com/@channelname`, you can use the YouTube API to get the ID:
   ```
   https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=CHANNEL_USERNAME&key=YOUR_API_KEY
   ```

## Current Channels

The app is configured to fetch from these basketball training channels:

- **YouGotMojo**: Advanced ball handling and skills
- **ILB**: High-intensity conditioning
- **OneUp Basketball**: Comprehensive skill development
- **Kids Basketball Training**: Youth-focused training

## API Quotas

- YouTube Data API has daily quota limits
- Each API request costs quota units
- Default quota: 10,000 units per day
- Fetching one video costs ~3 units

## Without API Key

If you don't set up an API key, the app will use mock data with placeholder basketball training videos. To get the latest real videos from each channel, you must set up the API key as described above.

## Troubleshooting

### "The request cannot be completed because you have exceeded your quota"
- You've hit the daily API quota limit
- Wait until the next day or request a quota increase from Google Cloud Console

### "API key not valid"
- Make sure your API key is correct
- Check that YouTube Data API v3 is enabled
- Verify the API key restrictions aren't too strict

### Videos not updating
- API results are cached for performance
- Clear your browser cache or restart the development server

## Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [API Explorer](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)


