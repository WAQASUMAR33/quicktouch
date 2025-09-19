'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield } from 'lucide-react';
export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalCoaches: 0,
    totalMatches: 0,
    totalEvents: 0
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    async function fetchDashboardData() {
      try {
        console.log('Fetching dashboard data');
        
        // Fetch user data
        const userResponse = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const userData = await userResponse.json();
        console.log('Dashboard - User response:', userData);

        if (!userResponse.ok) {
          console.log('Dashboard - Token verification failed:', userData.error);
          throw new Error(userData.error || 'Failed to verify token');
        }
        
        console.log('Dashboard - User role:', userData.user.role);
        setUser(userData.user);

        // Redirect based on user role
        if (userData.user.role === 'admin') {
          console.log('Dashboard - Admin role detected, redirecting to academy dashboard');
          router.push('/pages/academy-dashboard');
          return;
        }

        if (userData.user.role === 'coach') {
          console.log('Dashboard - Coach role detected, redirecting to coach dashboard');
          router.push('/pages/coach-dashboard');
          return;
        }

        // Only super admin should see this dashboard
        if (userData.user.role !== 'super_admin') {
          console.log('Dashboard - Access denied for role:', userData.user.role);
          setError('Access denied. Super admin privileges required.');
          setIsLoading(false);
          return;
        }

        console.log('Dashboard - Super admin confirmed, proceeding to load dashboard data');

        // Fetch dashboard stats from multiple APIs
        const [setupResponse, playersResponse, eventsResponse] = await Promise.all([
          fetch('/api/setup', {
            headers: {
                            'Content-Type': 'application/json',
            },
          }),
          fetch('/api/players_management', {
            headers: {
                            'Content-Type': 'application/json',
            },
          }),
          fetch('/api/event_management', {
            headers: {
                            'Content-Type': 'application/json',
            },
          })
        ]);

        const setupData = await setupResponse.json();
        const playersData = await playersResponse.json();
        const eventsData = await eventsResponse.json();

        // Calculate real statistics
        const totalUsers = setupData.users || 0;
        const totalPlayers = playersData.players?.length || 0;
        const totalCoaches = setupData.users ? 
          setupData.userList?.filter(user => user.role === 'coach').length || 0 : 0;
        const totalEvents = eventsData.events?.length || 0;
        const totalMatches = eventsData.events?.filter(event => event.type === 'match').length || 0;

        setStats({
          totalPlayers,
          totalCoaches,
          totalMatches,
          totalEvents
        });

      } catch (err) {
        console.error('Dashboard - Error:', err.message);
        console.error('Dashboard - Full error:', err);
        setError(err.message);
        // Don't remove token immediately, let user see the error
        // localStorage.removeItem('token');
        // router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16">
              <Image
                src="/quicktouch.png"
                alt="Quick Touch Academy"
                width={64}
                height={64}
                className="rounded-xl"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-purple-100 text-lg">
                Hello, {user?.fullName || user?.email}! You have full system access.
              </p>
              <p className="text-purple-200 text-sm mt-1">
                Role: <span className="font-semibold capitalize">{user?.role}</span>
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Players</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Coaches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCoaches}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Matches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMatches}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/pages/players_management" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-blue-800 font-medium">Manage Players</span>
              </div>
            </Link>
            
            <Link href="/pages/event_management" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-green-800 font-medium">Schedule Events</span>
              </div>
            </Link>
            
            <Link href="/pages/messaging" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-purple-800 font-medium">Messages</span>
              </div>
            </Link>
            
            <Link href="/pages/player-comparison" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-orange-800 font-medium">Compare Players</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New player registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Match scheduled</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Training session completed</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academy Info */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Academy Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Academy Name</h4>
            <p className="text-gray-600">Football Academy</p>
          </div>
      <div>
            <h4 className="font-medium text-gray-900 mb-2">Location</h4>
            <p className="text-gray-600">Default Location</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Established</h4>
            <p className="text-gray-600">2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}