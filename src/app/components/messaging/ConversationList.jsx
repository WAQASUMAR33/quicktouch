'use client';

import { useState, useEffect } from 'react';

export default function ConversationList({ onConversationSelect, selectedConversationId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/messaging/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        setError('Failed to fetch conversations');
      }
    } catch (err) {
      setError('Error fetching conversations');
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/messaging/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(prev => [data.conversation, ...prev]);
        onConversationSelect(data.conversation.id);
      } else {
        setError('Failed to start conversation');
      }
    } catch (err) {
      setError('Error starting conversation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
        <NewConversationButton onStartConversation={startNewConversation} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No conversations yet. Start a new conversation to begin messaging.
          </div>
        ) : (
          conversations.map((conversation) => {
            const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
            const otherParticipant = conversation.participant1Id === currentUserId 
              ? conversation.participant2 
              : conversation.participant1;
            const lastMessage = conversation.messages[0];

            return (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {otherParticipant.profilePhoto ? (
                      <img
                        src={otherParticipant.profilePhoto}
                        alt={otherParticipant.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {otherParticipant.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {otherParticipant.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage ? lastMessage.content : 'No messages yet'}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        otherParticipant.role === 'coach' ? 'bg-blue-100 text-blue-800' :
                        otherParticipant.role === 'admin' ? 'bg-red-100 text-red-800' :
                        otherParticipant.role === 'scout' ? 'bg-green-100 text-green-800' :
                        otherParticipant.role === 'parent' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {otherParticipant.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function NewConversationButton({ onStartConversation }) {
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('/api/messaging/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = (userId) => {
    onStartConversation(userId);
    setShowUserList(false);
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => {
          setShowUserList(!showUserList);
          if (!showUserList && users.length === 0) {
            fetchUsers();
          }
        }}
        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + New Conversation
      </button>

      {showUserList && (
        <div className="mt-2 border rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Loading users...</div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleStartConversation(user.id)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">
                        {user.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}




