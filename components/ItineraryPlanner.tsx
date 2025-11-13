'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Activity {
  title: string;
  description?: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
  };
  startTime: string;
  endTime?: string;
  notes?: string;
  order: number;
}

interface Itinerary {
  _id: string;
  trip: string;
  date: string;
  activities: Activity[];
}

interface ItineraryPlannerProps {
  tripId: string;
  date: string;
  isAdmin: boolean;
}

export default function ItineraryPlanner({
  tripId,
  date,
  isAdmin,
}: ItineraryPlannerProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: '',
    description: '',
    location: {
      name: '',
      address: '',
      lat: 0,
      lng: 0,
    },
    startTime: '',
    endTime: '',
    notes: '',
    order: 0,
  });

  useEffect(() => {
    fetchItinerary();
  }, [tripId, date]);

  const fetchItinerary = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary?date=${date}`);
      const data = await res.json();
      if (res.ok) {
        const dayItinerary = data.itineraries.find(
          (it: Itinerary) => it.date.split('T')[0] === date
        );
        setItinerary(dayItinerary || null);
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!itinerary) return;

    try {
      const res = await fetch(`/api/trips/${tripId}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          activities: itinerary.activities,
        }),
      });

      if (res.ok) {
        alert('Itinerary saved successfully!');
      } else {
        alert('Failed to save itinerary');
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary');
    }
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.startTime) {
      alert('Please fill in required fields');
      return;
    }

    const activity: Activity = {
      title: newActivity.title!,
      description: newActivity.description,
      location: newActivity.location!,
      startTime: newActivity.startTime!,
      endTime: newActivity.endTime,
      notes: newActivity.notes,
      order: itinerary?.activities.length || 0,
    };

    if (!itinerary) {
      setItinerary({
        _id: '',
        trip: tripId,
        date,
        activities: [activity],
      });
    } else {
      setItinerary({
        ...itinerary,
        activities: [...itinerary.activities, activity],
      });
    }

    setNewActivity({
      title: '',
      description: '',
      location: { name: '', address: '', lat: 0, lng: 0 },
      startTime: '',
      endTime: '',
      notes: '',
      order: 0,
    });
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activities = itinerary?.activities || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4 text-black">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(new Date(date), 'EEEE, MMMM d, yyyy')}
        </h3>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              + Add Activity
            </button>
            {activities.length > 0 && (
              <button
                onClick={handleSaveItinerary}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Itinerary
              </button>
            )}
          </div>
        )}
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No activities planned for this day.{' '}
          {isAdmin && 'Click "Add Activity" to get started!'}
        </p>
      ) : (
        <div className="space-y-4">
          {activities
            .sort((a, b) => a.order - b.order)
            .map((activity, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {activity.title}
                    </h4>
                    {activity.location.name && (
                      <p className="text-sm text-gray-600">
                        📍 {activity.location.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {activity.location.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {activity.startTime}
                      {activity.endTime && ` - ${activity.endTime}`}
                    </p>
                  </div>
                </div>
                {activity.description && (
                  <p className="text-gray-700 mb-2">{activity.description}</p>
                )}
                {activity.notes && (
                  <p className="text-sm text-gray-500 italic">
                    Note: {activity.notes}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center text-black justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Activity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newActivity.title}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  value={newActivity.location?.name || ''}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      location: {
                        ...newActivity.location!,
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newActivity.location?.address || ''}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      location: {
                        ...newActivity.location!,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newActivity.startTime}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

