# TravelMate Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- (Optional) Google OAuth credentials for Google sign-in
- (Optional) Google Maps API key for map features

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: (Optional) For Google OAuth
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: (Optional) For map features

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open Your Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/travelmate`

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Add your connection string to `.env.local`

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

## Google Maps API Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create API key
4. Add API key to `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Features

✅ User Authentication (Email/Password & Google OAuth)
✅ Trip Management (Create, Edit, Delete)
✅ Itinerary Planning (Daily activities with locations)
✅ Collaboration (Invite friends with role-based access)
✅ Favorites (Save favorite destinations)
✅ Public Trip Sharing (Shareable links)

## Project Structure

```
travelmate/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── trips/             # Trip pages
│   └── favorites/         # Favorites page
├── components/            # React components
├── lib/                   # Utilities (MongoDB, Auth)
├── models/                # Mongoose models
├── store/                 # Zustand state management
└── types/                 # TypeScript type definitions
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access (for Atlas)

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your app URL
- For Google OAuth, verify redirect URI matches

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)

## Next Steps

- Add Google Maps integration for visual itinerary planning
- Implement AI trip suggestions using OpenAI API
- Add PDF export functionality
- Enhance UI/UX with animations and transitions

