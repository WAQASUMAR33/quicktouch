'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TokenDebugPage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get data from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setRole(storedRole);

    console.log('Token Debug - localStorage data:');
    console.log('  Token:', storedToken ? 'Found' : 'Not found');
    console.log('  User:', storedUser ? JSON.parse(storedUser) : 'Not found');
    console.log('  Role:', storedRole || 'Not found');
  }, []);

  const testTokenVerification = async () => {
    if (!token) {
      setVerifyResult({ error: 'No token found' });
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

      setVerifyResult({
        status: response.status,
        success: response.ok,
        data: data
      });
    } catch (error) {
      console.error('Verify error:', error);
      setVerifyResult({ error: error.message });
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    setRole(null);
    setVerifyResult(null);
    console.log('Storage cleared');
  };

  const goToLogin = () => {
    router.push('/login');
  };

  const goToDashboard = () => {
    if (role === 'super_admin') {
      router.push('/pages/dashboard');
    } else if (role === 'admin') {
      router.push('/pages/academy-dashboard');
    } else {
      router.push('/pages/dashboard');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Token Debug Page</h1>
      
      {/* LocalStorage Data */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-blue-800 font-bold mb-3">LocalStorage Data</h2>
        <div className="space-y-2">
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

      {/* Token Verification */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-green-800 font-bold mb-3">Token Verification</h2>
        <button 
          onClick={testTokenVerification}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-3"
        >
          Test Token Verification
        </button>
        
        {verifyResult && (
          <div className="mt-3">
            {verifyResult.error ? (
              <p className="text-red-600"><strong>Error:</strong> {verifyResult.error}</p>
            ) : (
              <div>
                <p><strong>Status:</strong> {verifyResult.status}</p>
                <p><strong>Success:</strong> {verifyResult.success ? '✅ Yes' : '❌ No'}</p>
                {verifyResult.data && (
                  <div className="mt-2">
                    <p><strong>Message:</strong> {verifyResult.data.message}</p>
                    {verifyResult.data.user && (
                      <div className="mt-2">
                        <p><strong>Verified User Role:</strong> {verifyResult.data.user.role}</p>
                        <p><strong>Verified User Name:</strong> {verifyResult.data.user.fullName}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-gray-800 font-bold mb-3">Actions</h2>
        <div className="space-x-4">
          <button 
            onClick={clearStorage}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Storage
          </button>
          <button 
            onClick={goToLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
          <button 
            onClick={goToDashboard}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-yellow-800 font-bold mb-3">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-yellow-700">
          <li>Login with admin credentials: admin@quicktouch.com / admin123</li>
          <li>Check if token and user data are stored in localStorage</li>
          <li>Test token verification</li>
          <li>Try going to dashboard</li>
        </ol>
      </div>
    </div>
  );
}
