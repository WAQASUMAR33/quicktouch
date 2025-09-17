'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  UserCheck,
  MessageSquare,
  Target,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Clock,
  MapPin,
  Mail,
  Phone,
  Star,
  Activity
} from 'lucide-react';

export default function AcademyDashboardPage() {
  const [academy, setAcademy] = useState(null);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    recentPlayers: [],
    recentFeedback: []
  });
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
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Only load academy data if user is admin
      if (parsedUser.role === 'admin') {
        loadAcademyData(token, parsedUser.academyId);
      } else {
        setError('Access denied. Admin privileges required.');
        setIsLoading(false);
      }
    }
  }, [router]);

  const loadAcademyData = async (token, academyId) => {
    try {
      setIsLoading(true);
      setError('');

      // Load academy details
      const academyResponse = await fetch(`/api/academy_management/${academyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!academyResponse.ok) {
        throw new Error('Failed to load academy data');
      }

      const academyData = await academyResponse.json();
      setAcademy(academyData.academy);

      // Calculate stats from academy data - Focus on players only
      const academyStats = {
        totalPlayers: academyData.academy.Player?.length || 0,
        recentPlayers: academyData.academy.Player?.slice(0, 5) || [],
        recentFeedback: []
      };

      // Get recent feedback from all players
      const allFeedback = [];
      academyData.academy.Player?.forEach(player => {
        if (player.Feedback) {
          allFeedback.push(...player.Feedback);
        }
      });
      
      academyStats.recentFeedback = allFeedback
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats(academyStats);

    } catch (err) {
      console.error('Error loading academy data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <Building2 className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-red-700">{error}</p>
          </div>
          <Link 
            href="/pages/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!academy) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>No academy data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-blue-600" />
              {academy.name}
            </h1>
            <p className="text-gray-600 mt-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {academy.location}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href="/pages/academy_management"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Manage Academy
            </Link>
            <Link
              href="/pages/players_management/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards - Focus on Players Only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Players</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Feedback</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentFeedback.length}</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Player Management Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Player Management
            </h2>
            <Link
              href="/pages/players_management"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Players
            </Link>
          </div>
        </div>
        <div className="p-6">
          {stats.recentPlayers.length > 0 ? (
            <div className="space-y-4">
              {stats.recentPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{player.fullName}</p>
                      <p className="text-sm text-gray-600">{player.position} • Age {player.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/pages/players_management/${player.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Player"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/pages/players_management/${player.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit Player"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Players Yet</h3>
              <p className="text-gray-500 mb-6">Start building your academy by adding your first player.</p>
              <Link
                href="/pages/players_management/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Player
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Academy Information */}
      <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Academy Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900">
                {academy.description || 'No description provided'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
              <div className="space-y-2">
                {academy.contactEmail && (
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {academy.contactEmail}
                  </p>
                )}
                {academy.contactPhone && (
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {academy.contactPhone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Player Focused */}
      <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/pages/players_management/new"
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <p className="font-medium text-gray-900">Add New Player</p>
              <p className="text-sm text-gray-500 mt-1">Register a new player to your academy</p>
            </Link>
            
            <Link
              href="/pages/players_management"
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <UserCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="font-medium text-gray-900">Manage Players</p>
              <p className="text-sm text-gray-500 mt-1">View and edit all your players</p>
            </Link>
            
            <Link
              href="/pages/advanced-stats"
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <BarChart3 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <p className="font-medium text-gray-900">Player Analytics</p>
              <p className="text-sm text-gray-500 mt-1">View player performance and stats</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
