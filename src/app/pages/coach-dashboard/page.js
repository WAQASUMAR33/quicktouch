'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Trophy, 
  UserCheck, 
  Brain, 
  Target,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export default function CoachDashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTrainingPrograms: 0,
    upcomingEvents: 0,
    attendanceRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }

    async function fetchDashboardData() {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
                      },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.error || 'Failed to verify token');
        }
        
        setUser(userData.user);

        // Verify user is a coach
        if (userData.user.role !== 'coach') {
          router.push('/login');
          return;
        }

        // Fetch coach-specific data
        await Promise.all([
          fetchPlayersStats(token),
          fetchTrainingProgramsStats(token),
          fetchUpcomingEvents(token),
          fetchRecentActivities(token)
        ]);

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  const fetchPlayersStats = async (token) => {
    try {
      const response = await fetch('/api/players_management', {
        headers: {
                    'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          totalPlayers: data.players?.length || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  const fetchTrainingProgramsStats = async (token) => {
    try {
      const response = await fetch('/api/training_programs', {
        headers: {
                    'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          totalTrainingPrograms: data.programs?.length || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching training programs:', err);
    }
  };

  const fetchUpcomingEvents = async (token) => {
    try {
      const response = await fetch('/api/event_management', {
        headers: {
                    'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const upcoming = data.events?.filter(event => 
          new Date(event.date) > new Date()
        ) || [];
        setStats(prev => ({
          ...prev,
          upcomingEvents: upcoming.length
        }));
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchRecentActivities = async (token) => {
    // Mock recent activities for now
    setRecentActivities([
      { id: 1, type: 'training', message: 'Training session completed', time: '2 hours ago' },
      { id: 2, type: 'player', message: 'New player registered', time: '1 day ago' },
      { id: 3, type: 'event', message: 'Match scheduled for tomorrow', time: '2 days ago' },
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Academy</p>
          <p className="font-medium text-gray-900">{user?.academy?.name || 'Football Academy'}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPlayers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Programs</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalTrainingPrograms}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-orange-600">{stats.upcomingEvents}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/pages/players_management"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Manage Players</span>
          </Link>

          <Link
            href="/pages/training_programs"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Trophy className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Training Programs</span>
          </Link>

          <Link
            href="/pages/event_management"
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Events & Matches</span>
          </Link>

          <Link
            href="/pages/ai-insights"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Brain className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">AI Insights</span>
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Analysis</h3>
          <div className="space-y-3">
            <Link
              href="/pages/player-comparison"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Player Comparison</span>
            </Link>
            <Link
              href="/pages/advanced-stats"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Advanced Statistics</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
          <div className="space-y-3">
            <Link
              href="/pages/messaging"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Messaging</span>
            </Link>
            <Link
              href="/pages/attandance_management"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserCheck className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Attendance Management</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
