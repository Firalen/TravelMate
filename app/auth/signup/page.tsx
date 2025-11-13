'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/auth/signin?registered=true');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 animate-gradient relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="glass-effect rounded-3xl shadow-2xl p-8 border-2 border-white/30">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌟</div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Join TravelMate
            </h1>
            <p className="text-white/90">Start planning amazing trips today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-300 text-red-100 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Creating account... ✨' : 'Sign Up 🚀'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/90">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-white font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

