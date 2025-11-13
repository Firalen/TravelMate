import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';

// GET /api/trips/[id] - Get a specific trip
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    await connectDB();

    const trip = await Trip.findById(id)
      .populate('createdBy', 'name email image')
      .populate('participants.user', 'name email image');

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check if user has access
    const hasAccess =
      trip.isPublic ||
      trip.createdBy._id.toString() === session?.user?.id ||
      trip.participants.some(
        (p: any) => p.user._id.toString() === session?.user?.id
      );

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ trip }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/trips/[id] - Update a trip
export async function PUT(
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
        { error: 'Only admins can update trips' },
        { status: 403 }
      );
    }

    const updatedTrip = await Trip.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email image')
      .populate('participants.user', 'name email image');

    return NextResponse.json({ trip: updatedTrip }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/trips/[id] - Delete a trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await connectDB();

    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Only creator can delete
    if (trip.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the creator can delete this trip' },
        { status: 403 }
      );
    }

    await Trip.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Trip deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

