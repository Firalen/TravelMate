# TravelMate – Trip Planning and Itinerary Builder

A modern, collaborative trip planning application built with Next.js 14, MongoDB, and Google Maps integration.

## 🚀 Features

- **User Authentication** - Secure login and registration with NextAuth.js
- **Trip Management** - Create, edit, and manage your trips
- **Itinerary Planning** - Plan daily activities with locations and times
- **Interactive Maps** - View destinations on Google Maps with route planning
- **Collaboration** - Invite friends to plan trips together with role-based access
- **Favorites & History** - Save favorite destinations and view past trips
- **AI Suggestions** - Get AI-powered trip recommendations (optional)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Zustand
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Maps**: Google Maps API / Mapbox
- **State Management**: Zustand

## 📦 Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd travelmate
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)
- `OPENAI_API_KEY` - OpenAI API key for AI features (optional)

## 📝 License

MIT

