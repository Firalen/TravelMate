import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Invitation from '@/models/Invitation';
import User from '@/models/User';
import crypto from 'crypto';

// POST /api/trips/[id]/invite - Invite a user to a trip
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
    const { email, role = 'viewer' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Please provide an email' },
        { status: 400 }
      );
    }

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
        { error: 'Only admins can invite users' },
        { status: 403 }
      );
    }

    // Check if user is already a participant
    const invitedUser = await User.findOne({ email });
    if (invitedUser) {
      const invitedUserIdStr = String(invitedUser._id);
      const isParticipant = trip.participants.some(
        (p: any) => p.user.toString() === invitedUserIdStr
      );
      if (isParticipant) {
        return NextResponse.json(
          { error: 'User is already a participant' },
          { status: 400 }
        );
      }
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const invitation = await Invitation.create({
      trip: id,
      invitedBy: session.user.id,
      email,
      role,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return NextResponse.json(
      {
        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
        },
        message: 'Invitation sent successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

