'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AuthenticatedLayout({ isSidebarOpen, toggleSidebar, children }) {
  const router = useRouter();
  const { role, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      setIsLoading(false);
      return;
    }

    async function verifyToken() {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Invalid token');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        logout();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [router, logout]);

  useEffect(() => {
    if (!isLoading && !['admin', 'coach', 'player', 'scout'].includes(role)) {
      console.log('Invalid role, redirecting to login');
      router.push('/login');
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white transition-all duration-300 ease-in-out z-20 hidden md:block`}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white transition-all duration-300 ease-in-out z-20 fixed h-full md:hidden`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main
          className="flex-1 overflow-y-auto bg-gray-50"
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AuthProvider>
      <AuthenticatedLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
        {children}
      </AuthenticatedLayout>
    </AuthProvider>
  );
}
