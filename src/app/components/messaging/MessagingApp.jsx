'use client';

import { useState } from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';

export default function MessagingApp() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar with conversations */}
      <div className="w-1/3 bg-white border-r">
        <ConversationList
          onConversationSelect={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <MessageList
            conversationId={selectedConversationId}
            onMessageSelect={() => {}}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




