'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTripButton() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    isPublic: false,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/trips/${data.trip._id}`);
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-110 transform transition-all duration-300 flex items-center gap-2"
      >
        <span className="text-2xl">+</span> Create Trip
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-purple-100 animate-float">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">✈️</div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Create New Trip
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 text-black">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="My Amazing Trip"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Paris, France"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  placeholder="Tell us about your trip..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="mr-3 w-5 h-5 accent-purple-600"
                />
                <label htmlFor="isPublic" className="text-sm font-semibold text-gray-700">
                  Make trip public
                </label>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-full font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold hover:scale-110 transform transition-all duration-300 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? 'Creating... ✨' : 'Create Trip 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

