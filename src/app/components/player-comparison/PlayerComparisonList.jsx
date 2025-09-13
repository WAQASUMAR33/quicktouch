'use client';

import { useState, useEffect } from 'react';
import PlayerComparisonChart from './PlayerComparisonChart';

export default function PlayerComparisonList() {
  const [comparisons, setComparisons] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (['scout', 'admin'].includes(parsedUser.role)) {
        fetchComparisons();
      }
    }
  }, []);

  const fetchComparisons = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/player-comparison', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setComparisons(data.comparisons || []);
      } else {
        setError('Failed to fetch comparisons');
      }
    } catch (err) {
      setError('Error fetching comparisons');
    } finally {
      setLoading(false);
    }
  };

  const deleteComparison = async (comparisonId) => {
    if (!confirm('Are you sure you want to delete this comparison?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/player-comparison/${comparisonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setComparisons(prev => prev.filter(comp => comp.id !== comparisonId));
        if (selectedComparison?.id === comparisonId) {
          setSelectedComparison(null);
        }
      } else {
        setError('Failed to delete comparison');
      }
    } catch (err) {
      setError('Error deleting comparison');
    }
  };

  if (session?.user?.role !== 'scout') {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Access Denied
        </div>
        <p className="text-gray-600">
          Only scouts can view player comparisons.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with comparison list */}
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Player Comparisons</h2>
        </div>
        
        <div className="overflow-y-auto">
          {comparisons.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No comparisons yet. Create your first comparison to get started.
            </div>
          ) : (
            comparisons.map((comparison) => (
              <div
                key={comparison.id}
                onClick={() => setSelectedComparison(comparison)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedComparison?.id === comparison.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {comparison.player1.fullName} vs {comparison.player2.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {comparison.player1.position} vs {comparison.player2.position}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(comparison.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComparison(comparison.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete comparison"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {selectedComparison ? (
          <div className="p-6">
            <PlayerComparisonChart comparison={selectedComparison} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Select a comparison
              </h2>
              <p className="text-gray-500">
                Choose a comparison from the sidebar to view detailed analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




