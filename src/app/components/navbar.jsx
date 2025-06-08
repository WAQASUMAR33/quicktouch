'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      async function fetchUserData() {
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          } else {
            throw new Error(data.error || 'Failed to verify token');
          }
        } catch (err) {
          console.error('Navbar user fetch error:', err.message);
          setError(err.message);
          setUser(null);
        }
      }
      fetchUserData();
    } else {
      setError('No token found');
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between p-4">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Profile */}
        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>{user ? user.name || user.email : error || 'Loading...'}</span>
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="ml-2 text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-white p-4 border-t">
          <Link href="/dashboard" className="block py-2 px-4 hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/sale_management" className="block py-2 px-4 hover:bg-gray-100">
            Sale Management
          </Link>
          <Link href="/sale_details" className="block py-2 px-4 hover:bg-gray-100">
            Sale Details
          </Link>
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-4 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}