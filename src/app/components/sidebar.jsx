'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();

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

  // Academy-specific navigation items
  const navItems = [
    { href: '/pages/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/pages/players_management', label: 'Players', icon: Users },
    { href: '/pages/event_management', label: 'Events & Matches', icon: Calendar },
    { href: '/pages/messaging', label: 'Messaging', icon: MessageSquare },
    { href: '/pages/player-comparison', label: 'Player Comparison', icon: BarChart3 },
    { href: '/pages/ai-insights', label: 'AI Insights', icon: Brain },
    { href: '/pages/advanced-stats', label: 'Advanced Stats', icon: Target },
    { href: '/pages/training_programs', label: 'Training Programs', icon: Trophy },
    { href: '/pages/attandance_management', label: 'Attendance', icon: UserCheck },
    { href: '/pages/users', label: 'User Management', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with Academy Info */}
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        {isOpen && (
          <div className="text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Quick Touch</p>
                <p className="text-xs text-white/70">Academy</p>
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