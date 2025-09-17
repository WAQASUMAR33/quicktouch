'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  Trophy, 
  Target, 
  MessageSquare, 
  Edit, 
  Trash2,
  Star,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

export default function PlayerDetailPage() {
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();
  const params = useParams();
  const playerId = params.id;

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

    if (playerId) {
      fetchPlayerDetails(playerId, token);
    }
  }, [playerId, router]);

  const fetchPlayerDetails = async (id, token) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/players_management/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Player not found');
        }
        throw new Error('Failed to fetch player details');
      }

      const data = await response.json();
      setPlayer(data.player);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/players_management/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      router.push('/pages/players_management');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link 
            href="/pages/players_management"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Players
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <User className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Player Not Found</h2>
            <p className="text-red-700">{error}</p>
          </div>
          <Link 
            href="/pages/players_management"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Players List
          </Link>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>No player data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/pages/players_management"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Players
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{player.fullName}</h1>
            <p className="text-gray-600 mt-1">Player Profile</p>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/pages/players_management/${playerId}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Player
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{player.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <p className="text-gray-900">{player.age} years old</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <p className="text-gray-900">{player.height} cm</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <p className="text-gray-900">{player.position}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academy</label>
                <p className="text-gray-900">{player.Academy?.name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined</label>
                <p className="text-gray-900">
                  {new Date(player.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Player Stats */}
          {player.PlayerStats && player.PlayerStats.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Performance Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {player.PlayerStats.reduce((sum, stat) => sum + stat.goals, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Goals</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {player.PlayerStats.reduce((sum, stat) => sum + stat.assists, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Assists</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {player.PlayerStats.reduce((sum, stat) => sum + stat.minutesPlayed, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Minutes Played</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Feedback */}
          {player.Feedback && player.Feedback.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Recent Feedback
              </h2>
              
              <div className="space-y-4">
                {player.Feedback.slice(0, 3).map((feedback, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{feedback.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlight Reels */}
          {player.highlightReels && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Highlight Reels
              </h2>
              <p className="text-gray-700">{player.highlightReels}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Matches Played</span>
                <span className="font-semibold">{player.PlayerStats?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Feedback Count</span>
                <span className="font-semibold">{player.Feedback?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <span className="font-semibold">
                  {player.Feedback && player.Feedback.length > 0
                    ? (player.Feedback.reduce((sum, f) => sum + f.rating, 0) / player.Feedback.length).toFixed(1)
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-3">
              <Link
                href={`/pages/players_management/${playerId}/edit`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Player
              </Link>
              
              <Link
                href={`/pages/players_management/${playerId}/stats`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Stats
              </Link>
              
              <Link
                href={`/pages/players_management/${playerId}/feedback`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
