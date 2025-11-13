import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// DELETE /api/favorites/[id] - Remove a favorite
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

    const favorite = await Favorite.findById(id);

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    if (favorite.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Favorite.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'Favorite removed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

