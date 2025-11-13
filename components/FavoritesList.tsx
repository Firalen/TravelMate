'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Favorite {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  notes?: string;
  createdAt: string;
}

export default function FavoritesList() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this favorite?')) {
      return;
    }

    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFavorites(favorites.filter((f) => f._id !== id));
      } else {
        alert('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
      alert('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600">No favorites yet. Save your favorite destinations!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => (
        <div
          key={favorite._id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {favorite.name}
            </h3>
            <button
              onClick={() => handleDelete(favorite._id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mb-2">{favorite.address}</p>
          {favorite.notes && (
            <p className="text-sm text-gray-500 mb-2">{favorite.notes}</p>
          )}
          <div className="text-xs text-gray-400">
            Saved on{' '}
            {new Date(favorite.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

