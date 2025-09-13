'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AIInsightsDashboard from '../../components/ai-insights/AIInsightsDashboard';

export default function AIInsightsPage() {
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
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

    fetchPlayers(token);
  }, [router]);

  const fetchPlayers = async (token) => {
    try {
      const response = await fetch('/api/players_management', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players || []);
        
        // Auto-select player if user is a player
        if (user?.role === 'player' && data.players?.length > 0) {
          const userPlayer = data.players.find(p => p.userId === user.id);
          if (userPlayer) {
            setSelectedPlayerId(userPlayer.id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis and recommendations for player development</p>
        </div>
        <div className="text-sm text-gray-500">
          Welcome, {user.fullName} ({user.role})
        </div>
      </div>
      
      {/* Player Selection for non-players */}
      {user.role !== 'player' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Player to View AI Insights
          </label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.fullName} ({player.position}, Age: {player.age})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* AI Insights Dashboard */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {selectedPlayerId ? (
          <AIInsightsDashboard playerId={selectedPlayerId} />
        ) : user.role === 'player' ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Player Profile Found</h3>
            <p className="text-gray-500">
              Please contact your coach or admin to set up your player profile.
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Player</h3>
            <p className="text-gray-500">
              Choose a player from the dropdown above to view their AI insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}




