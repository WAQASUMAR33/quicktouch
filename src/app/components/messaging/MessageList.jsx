'use client';

import { useState, useEffect } from 'react';

export default function MessageList({ conversationId, onMessageSelect }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/messaging/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content, messageType = 'text', mediaUrl = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`/api/messaging/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, messageType, mediaUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Error sending message');
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === session?.user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {message.sender.fullName}
              </div>
              <div className="text-sm">
                {message.content}
              </div>
              {message.mediaUrl && (
                <div className="mt-2">
                  {message.messageType === 'image' ? (
                    <img
                      src={message.mediaUrl}
                      alt="Message attachment"
                      className="max-w-full h-auto rounded"
                    />
                  ) : (
                    <a
                      href={message.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-100 underline"
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              )}
              <div className="text-xs opacity-75 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || file) {
      if (file) {
        // In a real app, you'd upload the file first
        onSendMessage(message, 'image', URL.createObjectURL(file));
        setFile(null);
      } else {
        onSendMessage(message);
      }
      setMessage('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300"
        >
          📎
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
      {file && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {file.name}
        </div>
      )}
    </form>
  );
}




