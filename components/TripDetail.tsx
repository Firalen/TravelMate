'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Trip } from '@/store/tripStore';
import ItineraryPlanner from './ItineraryPlanner';
import InviteModal from './InviteModal';

interface TripDetailProps {
  trip: Trip;
}

export default function TripDetail({ trip: initialTrip }: TripDetailProps) {
  const { data: session } = useSession();
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const isAdmin = Boolean(
    trip.createdBy?._id === session?.user?.id ||
      trip.participants?.some(
        (p) => p.user?._id === session?.user?.id && p.role === 'admin'
      )
  );

  const generateDateRange = () => {
    const dates = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const dates = generateDateRange();
  const [selectedDate, setSelectedDate] = useState<string>(
    dates.length > 0 ? dates[0] : ''
  );

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {trip.title}
            </h1>
            <p className="text-gray-600 text-base md:text-lg">{trip.destination}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              Invite Friends
            </button>
          )}
        </div>

        {trip.description && (
          <p className="text-gray-700 mb-4 text-sm md:text-base">{trip.description}</p>
        )}

        <div className="flex flex-col sm:flex-row sm:gap-6 gap-3 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-semibold">Start:</span>{' '}
            {format(new Date(trip.startDate), 'MMM d, yyyy')}
          </div>
          <div>
            <span className="font-semibold">End:</span>{' '}
            {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </div>
          <div>
            <span className="font-semibold">Participants:</span>{' '}
            {trip.participants.length}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
          <div className="flex flex-wrap gap-2">
            {trip.participants.map((participant) => {
              const user = participant.user;

              if (!user) {
                return null;
              }

              return (
                <div
                  key={user._id}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || 'Participant'}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {user.name || 'Unnamed Participant'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({participant.role})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Itinerary Planning
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-3 md:px-4 py-2 rounded-md whitespace-nowrap transition-colors text-sm md:text-base flex-shrink-0 ${
                  selectedDate === date
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {format(new Date(date), 'MMM d')}
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <ItineraryPlanner tripId={trip._id} date={selectedDate} isAdmin={isAdmin} />
        )}
      </div>

      {showInviteModal && (
        <InviteModal
          tripId={trip._id}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

