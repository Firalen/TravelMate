import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const favorites = await Favorite.find({ user: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ favorites }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/favorites - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, lat, lng, placeId, notes } = body;

    if (!name || !address || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const favorite = await Favorite.create({
      user: session.user.id,
      name,
      address,
      lat,
      lng,
      placeId,
      notes,
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This location is already in your favorites' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

