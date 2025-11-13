'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trip } from '@/store/tripStore';

export default function TripList() {
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchTrips();
    }
  }, [session]);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      if (res.ok) {
        setTrips(data.trips);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border-2 border-purple-100">
        <div className="text-6xl mb-4">✈️</div>
        <p className="text-2xl font-bold text-gray-800 mb-2">No trips yet!</p>
        <p className="text-gray-600 mb-6">Create your first trip and start planning your adventure</p>
      </div>
    );
  }

  const gradientClasses = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {trips.map((trip, index) => {
        const gradient = gradientClasses[index % gradientClasses.length];
        return (
          <Link
            key={trip._id}
            href={`/trips/${trip._id}`}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift"
          >
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradient}`}></div>
            <div className="p-6 pt-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {trip.title}
                </h3>
                <div className="text-3xl transform group-hover:scale-110 transition-transform">✈️</div>
              </div>
              <p className="text-gray-600 mb-4 font-medium flex items-center gap-2">
                <span>📍</span> {trip.destination}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">
                  📅 {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
                </span>
                <span className={`px-3 py-1 rounded-full text-white font-semibold bg-gradient-to-r ${gradient}`}>
                  👥 {trip.participants.length}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

