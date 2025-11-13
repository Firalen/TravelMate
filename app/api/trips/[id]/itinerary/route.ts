import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Itinerary from '@/models/Itinerary';

// GET /api/trips/[id]/itinerary - Get itinerary for a trip
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    await connectDB();

    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check access
    const hasAccess =
      trip.isPublic ||
      trip.createdBy.toString() === session?.user?.id ||
      trip.participants.some(
        (p: any) => p.user.toString() === session?.user?.id
      );

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const query: any = { trip: id };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const itineraries = await Itinerary.find(query).sort({ date: 1 });

    return NextResponse.json({ itineraries }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/trips/[id]/itinerary - Create or update itinerary for a date
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { date, activities } = body;

    await connectDB();

    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin =
      trip.createdBy.toString() === session.user.id ||
      trip.participants.some(
        (p: any) =>
          p.user.toString() === session.user.id && p.role === 'admin'
      );

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can update itinerary' },
        { status: 403 }
      );
    }

    const itinerary = await Itinerary.findOneAndUpdate(
      { trip: id, date: new Date(date) },
      {
        trip: id,
        date: new Date(date),
        activities: activities || [],
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ itinerary }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

