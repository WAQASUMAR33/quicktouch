'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TrainingProgramsPage() {
  const [programs, setPrograms] = useState([]);
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

    fetchPrograms();
  }, [router]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/training_programs', {
        headers: {
                    'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch training programs');
      }

      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!confirm('Are you sure you want to delete this training program?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/training_programs/${programId}`, {
        method: 'DELETE',
        headers: {
                  },
      });

      if (!response.ok) {
        throw new Error('Failed to delete training program');
      }

      // Refresh the programs list
      fetchPrograms();
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
          <h1 className="text-3xl font-bold text-gray-900">Training Programs</h1>
          <p className="text-gray-600 mt-1">Manage training sessions and development programs</p>
        </div>
        {user?.role === 'coach' || user?.role === 'admin' ? (
          <Link
            href="/pages/training_programs/new"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
          >
            Create New Program
          </Link>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No training programs found</h3>
            <p className="text-gray-500 mb-4">Create your first training program to get started.</p>
            {(user?.role === 'coach' || user?.role === 'admin') && (
              <Link
                href="/pages/training_programs/new"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Create First Program
              </Link>
            )}
          </div>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{program.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Training
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(program.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Coach: {program.User?.fullName || 'Not specified'}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/pages/training_programs/${program.id}`}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-center font-medium hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </Link>
                  {(user?.role === 'coach' || user?.role === 'admin') && (
                    <>
                      <Link
                        href={`/pages/training_programs/${program.id}/edit`}
                        className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-center font-medium hover:bg-green-100 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProgram(program.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {programs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{programs.length}</p>
              <p className="text-gray-600">Total Programs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {programs.filter(p => new Date(p.date) >= new Date()).length}
              </p>
              <p className="text-gray-600">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {programs.filter(p => new Date(p.date) < new Date()).length}
              </p>
              <p className="text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {programs.filter(p => p.drills && p.drills.length > 0).length}
              </p>
              <p className="text-gray-600">Programs with Drills</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
