import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Invitation from '@/models/Invitation';
import Trip from '@/models/Trip';

// POST /api/invitations/accept - Accept an invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Please provide an invitation token' },
        { status: 400 }
      );
    }

    await connectDB();

    const invitation = await Invitation.findOne({
      token,
      email: session.user.email,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    const trip = await Trip.findById(invitation.trip);

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Add user as participant
    trip.participants.push({
      user: session.user.id,
      role: invitation.role,
      joinedAt: new Date(),
    });

    await trip.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    return NextResponse.json(
      { message: 'Invitation accepted successfully', trip },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

