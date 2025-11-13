import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-2xl animate-float">
            TravelMate
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium drop-shadow-lg">
            Plan your trips collaboratively with friends and family. Create
            itineraries, explore destinations, and make memories together.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/signin"
              className="px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-2xl hover:scale-110 transform transition-all duration-300 hover:shadow-purple-500/50"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-10 py-4 bg-transparent text-white rounded-full font-bold text-lg border-4 border-white shadow-2xl hover:scale-110 transform transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-effect p-8 rounded-2xl shadow-2xl hover-lift group">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🗓️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Trip Management</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              Create and manage your trips with ease. Add destinations, dates,
              and details.
            </p>
          </div>
          <div className="glass-effect p-8 rounded-2xl shadow-2xl hover-lift group">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📍</div>
            <h3 className="text-2xl font-bold text-white mb-4">Itinerary Planning</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              Plan daily activities with locations, times, and notes. View
              everything on an interactive map.
            </p>
          </div>
          <div className="glass-effect p-8 rounded-2xl shadow-2xl hover-lift group">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-4">Collaboration</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              Invite friends to plan trips together with role-based access
              control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

