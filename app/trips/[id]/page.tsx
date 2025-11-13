import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Navbar from '@/components/Navbar';
import TripDetail from '@/components/TripDetail';

export default async function TripPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  await connectDB();
  const trip = await Trip.findById(params.id)
    .populate('createdBy', 'name email image')
    .populate('participants.user', 'name email image');

  if (!trip) {
    redirect('/trips');
  }

  // Check access
  const hasAccess =
    trip.isPublic ||
    trip.createdBy._id.toString() === session.user.id ||
    trip.participants.some(
      (p: any) => p.user._id.toString() === session.user.id
    );

  if (!hasAccess) {
    redirect('/trips');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TripDetail trip={JSON.parse(JSON.stringify(trip))} />
    </div>
  );
}

