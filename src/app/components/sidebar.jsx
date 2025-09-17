'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Brain,
  Trophy,
  UserCheck,
  Settings,
  FileText,
  Target,
  Building2,
  Shield,
  UserCog,
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        router.push('/login');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      router.push('/login');
    }
  };

  // Role-based navigation items
  const getNavItems = () => {
    if (!user) return [];

    // Super Admin - Full access to everything
    if (user.role === 'super_admin') {
      return [
        { href: '/pages/dashboard', label: 'Admin Dashboard', icon: Shield },
        { href: '/pages/academy_management', label: 'Academy Management', icon: Building2 },
        { href: '/pages/admin-approvals', label: 'Academy Approvals', icon: UserCog },
        { href: '/pages/players_management', label: 'All Players', icon: Users },
        { href: '/pages/event_management', label: 'All Events', icon: Calendar },
        { href: '/pages/users', label: 'User Management', icon: Settings },
        { href: '/pages/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/pages/player-comparison', label: 'Player Comparison', icon: BarChart3 },
        { href: '/pages/ai-insights', label: 'AI Insights', icon: Brain },
        { href: '/pages/advanced-stats', label: 'Advanced Stats', icon: Target },
        { href: '/pages/training_programs', label: 'Training Programs', icon: Trophy },
        { href: '/pages/attandance_management', label: 'Attendance', icon: UserCheck },
      ];
    }

    // Academy Admin - Limited to their academy
    if (user.role === 'admin') {
      return [
        { href: '/pages/academy-dashboard', label: 'Academy Dashboard', icon: LayoutDashboard },
        { href: '/pages/players_management', label: 'Players', icon: Users },
        { href: '/pages/event_management', label: 'Events & Matches', icon: Calendar },
        { href: '/pages/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/pages/ai-insights', label: 'AI Insights', icon: Brain },
        { href: '/pages/advanced-stats', label: 'Advanced Stats', icon: Target },
        { href: '/pages/training_programs', label: 'Training Programs', icon: Trophy },
        { href: '/pages/attandance_management', label: 'Attendance', icon: UserCheck },
      ];
    }

    // Coach - Limited access
    if (user.role === 'coach') {
      return [
        { href: '/pages/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/pages/players_management', label: 'Players', icon: Users },
        { href: '/pages/event_management', label: 'Events & Matches', icon: Calendar },
        { href: '/pages/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/pages/ai-insights', label: 'AI Insights', icon: Brain },
        { href: '/pages/advanced-stats', label: 'Advanced Stats', icon: Target },
        { href: '/pages/training_programs', label: 'Training Programs', icon: Trophy },
        { href: '/pages/attandance_management', label: 'Attendance', icon: UserCheck },
      ];
    }

    // Player - Very limited access
    if (user.role === 'player') {
      return [
        { href: '/pages/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { href: '/pages/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/pages/ai-insights', label: 'My AI Insights', icon: Brain },
        { href: '/pages/advanced-stats', label: 'My Stats', icon: Target },
      ];
    }

    // Scout - Limited access
    if (user.role === 'scout') {
      return [
        { href: '/pages/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/pages/players_management', label: 'Players', icon: Users },
        { href: '/pages/player-comparison', label: 'Player Comparison', icon: BarChart3 },
        { href: '/pages/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/pages/ai-insights', label: 'AI Insights', icon: Brain },
        { href: '/pages/advanced-stats', label: 'Advanced Stats', icon: Target },
      ];
    }

    // Default fallback
    return [
      { href: '/pages/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-full">
      {/* Header with Role-specific Info */}
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        {isOpen && (
          <div className="text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <Image
                  src="/quicktouch.png"
                  alt="Quick Touch Academy"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <div>
                <p className="font-semibold text-white">Quick Touch</p>
                <p className="text-xs text-white/70">
                  {user?.role === 'super_admin' ? 'Super Admin' : 
                   user?.role === 'admin' ? 'Academy Admin' :
                   user?.role === 'coach' ? 'Coach' :
                   user?.role === 'player' ? 'Player' :
                   user?.role === 'scout' ? 'Scout' : 'User'}
                </p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white transition-all duration-200 group"
            aria-label={item.label}
          >
            <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 w-full text-left rounded-xl hover:bg-red-500/20 text-white transition-all duration-200 group"
          aria-label="Logout"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}