'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PlayersManagementPage() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
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

      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }

      const data = await response.json();
      setPlayers(data.players || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/players_management/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      // Refresh the players list
      fetchPlayers(token);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Players Management</h1>
          <p className="text-gray-600 mt-1">Manage academy players and their information</p>
        </div>
        <Link
          href="/pages/players_management/new"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
        >
          Add New Player
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first player to the academy.</p>
            <Link
              href="/pages/players_management/new"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Add First Player
            </Link>
          </div>
        ) : (
          players.map((player) => (
            <div key={player.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {player.fullName?.charAt(0) || 'P'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{player.fullName}</h3>
                    <p className="text-gray-500 text-sm">Age: {player.age} years</p>
                    <p className="text-gray-500 text-sm">Position: {player.position}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{player.height}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-medium">
                      {new Date(player.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/pages/players_management/${player.id}`}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-center font-medium hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/pages/players_management/${player.id}/edit`}
                    className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-center font-medium hover:bg-green-100 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {players.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{players.length}</p>
              <p className="text-gray-600">Total Players</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {players.filter(p => p.position === 'Forward').length}
              </p>
              <p className="text-gray-600">Forwards</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {players.filter(p => p.position === 'Midfielder').length}
              </p>
              <p className="text-gray-600">Midfielders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {players.filter(p => p.position === 'Defender').length}
              </p>
              <p className="text-gray-600">Defenders</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
