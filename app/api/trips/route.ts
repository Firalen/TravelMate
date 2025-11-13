import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';

// GET /api/trips - Get all trips for the user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const trips = await Trip.find({
      $or: [
        { createdBy: session.user.id },
        { 'participants.user': session.user.id },
      ],
    })
      .populate('createdBy', 'name email image')
      .populate('participants.user', 'name email image')
      .sort({ createdAt: -1 });

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, destination, startDate, endDate, isPublic } = body;

    if (!title || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const trip = await Trip.create({
      title,
      description,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: session.user.id,
      participants: [
        {
          user: session.user.id,
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
      isPublic: isPublic || false,
    });

    await trip.populate('createdBy', 'name email image');
    await trip.populate('participants.user', 'name email image');

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

