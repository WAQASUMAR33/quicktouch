'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MessagingApp from '../../components/messaging/MessagingApp';

export default function MessagingPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messaging</h1>
          <p className="text-gray-600 mt-1">Communicate with players, coaches, and staff</p>
        </div>
        <div className="text-sm text-gray-500">
          Welcome, {user.fullName} ({user.role})
        </div>
      </div>
      
      {/* Messaging App */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <MessagingApp />
      </div>
    </div>
  );
}




