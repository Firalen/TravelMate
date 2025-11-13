'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/trips', label: 'My Trips' },
    { href: '/favorites', label: 'Favorites' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-xl backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="text-xl md:text-3xl font-extrabold text-white drop-shadow-lg hover:scale-110 transform transition-transform duration-300">
            ✈️ TravelMate
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {session ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-300 ${
                      pathname === link.href
                        ? 'bg-white text-purple-600 shadow-lg scale-110'
                        : 'text-white/90 hover:text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 lg:gap-4 ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-white/30">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-lg hover:scale-110 transform transition-transform duration-300"
                    />
                  )}
                  <span className="hidden lg:inline text-sm font-semibold text-white drop-shadow-md">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-3 lg:px-5 py-2 bg-red-500 text-white rounded-full text-xs lg:text-sm font-semibold hover:bg-red-600 hover:scale-110 transform transition-all duration-300 shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 lg:gap-4">
                <Link
                  href="/auth/signin"
                  className="px-4 lg:px-6 py-2 text-white text-sm lg:text-base font-semibold hover:text-purple-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 lg:px-6 py-2 bg-white text-purple-600 rounded-full text-sm lg:text-base font-bold hover:scale-110 transform transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/30 mt-2 pt-4">
            {session ? (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
                        pathname === link.href
                          ? 'bg-white text-purple-600 shadow-lg'
                          : 'text-white/90 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/30">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white drop-shadow-md">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-white/80">{session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-center text-white font-semibold hover:bg-white/20 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-center bg-white text-purple-600 rounded-lg font-bold shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

