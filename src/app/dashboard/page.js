'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      return;
    }

    async function fetchUserData() {
      try {
        console.log('Fetching dashboard data with token:', token);
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Verify response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify token');
        }
        setUser(data.user);
      } catch (err) {
        console.error('Dashboard error:', err.message);
        setError(err.message);
        localStorage.removeItem('token');
        router.push('/login');
      }
    }

    fetchUserData();
  }, [router]);

  return (
    <div className="bg-blue-100 h-full flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {user ? (
          <div>
            <p>Hello, {user.name || user.email}!</p>
            <pre className="text-sm font-mono bg-gray-100 p-4 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}