'use client';

import { useState, useEffect } from 'react';

export default function PlayerComparisonForm({ onComparisonCreated }) {
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (['scout', 'admin'].includes(parsedUser.role)) {
        fetchPlayers();
      }
    }
  }, []);

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/players_management', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players || []);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!player1Id || !player2Id) {
      setError('Please select both players');
      return;
    }

    if (player1Id === player2Id) {
      setError('Cannot compare a player with themselves');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/player-comparison', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1Id,
          player2Id,
          notes
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onComparisonCreated(data.comparison);
        setPlayer1Id('');
        setPlayer2Id('');
        setNotes('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create comparison');
      }
    } catch (err) {
      setError('Error creating comparison');
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.role !== 'scout') {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Access Denied
        </div>
        <p className="text-gray-600">
          Only scouts can create player comparisons.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Player Comparison</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select First Player
            </label>
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a player...</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.fullName} ({player.position}, Age: {player.age})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Second Player
            </label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a player...</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.fullName} ({player.position}, Age: {player.age})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comparison Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add your observations and notes about this comparison..."
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Comparison...' : 'Create Comparison'}
        </button>
      </form>
    </div>
  );
}




