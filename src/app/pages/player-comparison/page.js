'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlayerComparisonForm from '../../components/player-comparison/PlayerComparisonForm';
import PlayerComparisonList from '../../components/player-comparison/PlayerComparisonList';

export default function PlayerComparisonPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Only scouts and admins can access this page
      if (!['scout', 'admin'].includes(parsedUser.role)) {
        router.push('/pages/dashboard');
        return;
      }
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

  if (!user || !['scout', 'admin'].includes(user.role)) {
    return null; // Will redirect
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Player Comparison</h1>
          <p className="text-gray-600 mt-1">Compare player statistics and performance metrics</p>
        </div>
        <div className="text-sm text-gray-500">
          Welcome, {user.fullName} ({user.role})
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Comparison
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'view'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            View Comparisons
          </button>
        </nav>
      </div>
      
      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {activeTab === 'create' && (
          <PlayerComparisonForm onComparisonCreated={() => setActiveTab('view')} />
        )}
        
        {activeTab === 'view' && <PlayerComparisonList />}
      </div>
    </div>
  );
}




