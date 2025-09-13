'use client';

import { useState, useEffect } from 'react';

export default function AdvancedStatsDashboard({ playerId }) {
  const [stats, setStats] = useState([]);
  const [aggregatedStats, setAggregatedStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState('all');

  useEffect(() => {
    if (playerId) {
      fetchStats();
    }
  }, [playerId, selectedMatch]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const url = selectedMatch === 'all' 
        ? `/api/advanced-stats?playerId=${playerId}`
        : `/api/advanced-stats?playerId=${playerId}&matchId=${selectedMatch}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.advancedStats || []);
        setAggregatedStats(data.aggregatedStats);
      } else {
        setError('Failed to fetch advanced stats');
      }
    } catch (err) {
      setError('Error fetching advanced stats');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-6">
      {/* Aggregated Stats Overview */}
      {aggregatedStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {aggregatedStats.totalMatches}
              </div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {aggregatedStats.averagePassAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Pass Accuracy</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {aggregatedStats.totalDistanceCovered.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600">Total Distance</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {aggregatedStats.totalSprints}
              </div>
              <div className="text-sm text-gray-600">Total Sprints</div>
            </div>
          </div>
        </div>
      )}

      {/* Match Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Match Performance</h3>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Matches</option>
            {stats.map((stat) => (
              <option key={stat.match.id} value={stat.match.id}>
                {stat.match.title} - {new Date(stat.match.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Individual Match Stats */}
      {stats.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Advanced Stats Yet</h4>
          <p className="text-gray-500">
            Advanced performance statistics will appear here as coaches track your matches.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-800">{stat.match.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(stat.match.date).toLocaleDateString()} • {stat.match.type}
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {stat.match.type}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {stat.passAccuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Pass Accuracy</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {(stat.distanceCovered / 1000).toFixed(1)} km
                  </div>
                  <div className="text-sm text-gray-600">Distance Covered</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {stat.sprintCount}
                  </div>
                  <div className="text-sm text-gray-600">Sprints</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {stat.sprintCount > 0 ? (stat.distanceCovered / stat.sprintCount).toFixed(0) : 0} m
                  </div>
                  <div className="text-sm text-gray-600">Avg Sprint Distance</div>
                </div>
              </div>

              {/* Heatmap Visualization Placeholder */}
              {stat.heatmapData && Object.keys(stat.heatmapData).length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">Position Heatmap</h5>
                  <div className="text-sm text-gray-600">
                    Heatmap data available - visualization would be rendered here
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Stats Button for Coaches/Admins */}
      {['admin', 'coach'].includes(session?.user?.role) && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <button
            onClick={() => {
              // In a real app, this would open a form to add new stats
              alert('Feature coming soon: Add advanced stats for matches');
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Advanced Stats
          </button>
        </div>
      )}
    </div>
  );
}




