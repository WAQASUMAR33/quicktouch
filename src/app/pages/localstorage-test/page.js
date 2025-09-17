'use client';

import { useEffect, useState } from 'react';

export default function LocalStorageTestPage() {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    // Get data from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setRole(storedRole);

    console.log('LocalStorage Test - Client-side data:');
    console.log('  Token:', storedToken ? 'Found' : 'Not found');
    console.log('  User:', storedUser ? JSON.parse(storedUser) : 'Not found');
    console.log('  Role:', storedRole || 'Not found');
  }, []);

  const testLogin = async () => {
    try {
      console.log('Testing login...');
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@quicktouch.com',
          password: 'admin123'
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);

        // Update state
        setToken(data.token);
        setUser(data.user);
        setRole(data.user.role);

        console.log('Data stored in localStorage');
        console.log('Token:', data.token);
        console.log('User:', data.user);
        console.log('Role:', data.user.role);
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    setRole(null);
    console.log('Storage cleared');
  };

  const testTokenVerification = async () => {
    if (!token) {
      console.log('No token to verify');
      return;
    }

    try {
      console.log('Testing token verification...');
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Verify response:', data);

      if (response.ok) {
        console.log('Token verification successful');
      } else {
        console.error('Token verification failed:', data.error);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  if (!isClient) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">LocalStorage Test Page</h1>
      
      {/* Current State */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-blue-800 font-bold mb-3">Current State</h2>
        <div className="space-y-2">
          <p><strong>Is Client:</strong> {isClient ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Token:</strong> {token ? '✅ Found' : '❌ Not found'}</p>
          <p><strong>User:</strong> {user ? '✅ Found' : '❌ Not found'}</p>
          <p><strong>Role:</strong> {role || '❌ Not found'}</p>
        </div>
        
        {token && (
          <div className="mt-3">
            <p><strong>Token Preview:</strong> {token.substring(0, 20)}...</p>
          </div>
        )}
        
        {user && (
          <div className="mt-3">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>User Name:</strong> {user.fullName}</p>
            <p><strong>User Email:</strong> {user.email}</p>
            <p><strong>User Role:</strong> {user.role}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-gray-800 font-bold mb-3">Actions</h2>
        <div className="space-x-4">
          <button 
            onClick={testLogin}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Login
          </button>
          <button 
            onClick={testTokenVerification}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Token Verification
          </button>
          <button 
            onClick={clearStorage}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Storage
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-yellow-800 font-bold mb-3">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-yellow-700">
          <li>Click &quot;Test Login&quot; to login and store data in localStorage</li>
          <li>Check if data is stored correctly in the &quot;Current State&quot; section</li>
          <li>Click &quot;Test Token Verification&quot; to verify the token</li>
          <li>Check browser console for detailed logs</li>
          <li>If everything works, try accessing the dashboard</li>
        </ol>
      </div>
    </div>
  );
}
