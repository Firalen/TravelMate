import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TripList from '@/components/TripList';
import CreateTripButton from '@/components/CreateTripButton';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            <h1 className="text-5xl font-extrabold mb-2">
              Welcome back, {session.user?.name}! 👋
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Manage your trips and plan your next adventure
            </p>
          </div>
          <CreateTripButton />
        </div>
        <TripList />
      </div>
    </div>
  );
}

