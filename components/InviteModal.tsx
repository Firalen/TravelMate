'use client';

import { useState } from 'react';

interface InviteModalProps {
  tripId: string;
  onClose: () => void;
}

export default function InviteModal({ tripId, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/trips/${tripId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Invitation sent successfully!');
        setEmail('');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Invite Friend</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.includes('successfully')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="friend@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'viewer')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="viewer">Viewer (Read-only)</option>
              <option value="admin">Admin (Can edit)</option>
            </select>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

