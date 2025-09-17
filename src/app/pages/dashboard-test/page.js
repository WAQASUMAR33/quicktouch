'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardTestPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Dashboard Test - Token:', token ? 'Found' : 'Not found');
    
    if (!token) {
      console.log('Dashboard Test - No token, redirecting to login');
      router.push('/login');
      return;
    }

    async function fetchUserData() {
      try {
        console.log('Dashboard Test - Fetching user data...');
        
        const userResponse = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await userResponse.json();
        console.log('Dashboard Test - User response:', userData);

        if (!userResponse.ok) {
          throw new Error(userData.error || 'Failed to verify token');
        }
        
        setUser(userData.user);
        console.log('Dashboard Test - User set:', userData.user);

        // Check role
        if (userData.user.role === 'admin') {
          console.log('Dashboard Test - Admin role, redirecting to academy dashboard');
          router.push('/pages/academy-dashboard');
          return;
        }

        if (userData.user.role !== 'super_admin') {
          console.log('Dashboard Test - Not super admin, access denied');
          setError('Access denied. Super admin privileges required.');
          setIsLoading(false);
          return;
        }

        console.log('Dashboard Test - Super admin confirmed, loading dashboard');
        setIsLoading(false);

      } catch (err) {
        console.error('Dashboard Test - Error:', err.message);
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
        <p className="ml-4">Loading dashboard test...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-bold">Dashboard Test Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => router.push('/login')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Test - Success!</h1>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-green-800 font-bold">✅ Authentication Working</h2>
        <p className="text-green-600">The dashboard test page loaded successfully!</p>
      </div>

      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-bold">User Information</h3>
          <div className="text-blue-600">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Academy ID:</strong> {user.academyId}</p>
            <p><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button 
          onClick={() => router.push('/pages/dashboard')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Full Dashboard
        </button>
      </div>
    </div>
  );
}
