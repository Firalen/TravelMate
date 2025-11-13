'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/trips', label: 'My Trips' },
    { href: '/favorites', label: 'Favorites' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-xl backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-3xl font-extrabold text-white drop-shadow-lg hover:scale-110 transform transition-transform duration-300">
            ✈️ TravelMate
          </Link>

          <div className="flex items-center gap-6">
            {session ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      pathname === link.href
                        ? 'bg-white text-purple-600 shadow-lg scale-110'
                        : 'text-white/90 hover:text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/30">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-lg hover:scale-110 transform transition-transform duration-300"
                    />
                  )}
                  <span className="text-sm font-semibold text-white drop-shadow-md">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-5 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 hover:scale-110 transform transition-all duration-300 shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/auth/signin"
                  className="px-6 py-2 text-white font-semibold hover:text-purple-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-white text-purple-600 rounded-full font-bold hover:scale-110 transform transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

