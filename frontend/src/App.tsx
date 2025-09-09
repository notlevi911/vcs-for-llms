import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import CommitModal from './components/CommitModal';
import FetchPanel from './components/FetchPanel';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showFetchPanel, setShowFetchPanel] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${content}". This is a placeholder response from the AI assistant. In a real implementation, this would connect to your backend API.`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    // In a real app, this would load the chat history from the backend
    setMessages([
      {
        id: '1',
        content: 'Hello! How can I help you with your development today?',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
  };

  const handleCommit = (commitName: string) => {
    console.log('Committing with name:', commitName);
    // Placeholder for commit functionality
    // In a real app, this would save the current conversation state
    alert(`Commit "${commitName}" created successfully!`);
  };

  const handleFetch = (commitId: string) => {
    console.log('Fetching commit:', commitId);
    // Placeholder for fetch functionality
    // In a real app, this would restore the conversation from the commit
    alert(`Fetched commit ${commitId}!`);
    setShowFetchPanel(false);
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      {/* Sidebar */}
      <Sidebar 
        onChatSelect={handleChatSelect}
        activeChatId={activeChatId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="bg-dark-surface/50 backdrop-blur-sm border-b border-dark-border p-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowCommitModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Commit
            </button>
            <button
              onClick={() => setShowFetchPanel(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Fetch
            </button>
          </div>
        </div>

        {/* Chat Area or Fetch Panel */}
        {showFetchPanel ? (
          <FetchPanel
            onFetch={handleFetch}
            onBack={() => setShowFetchPanel(false)}
          />
        ) : (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Commit Modal */}
      <CommitModal
        isOpen={showCommitModal}
        onClose={() => setShowCommitModal(false)}
        onCommit={handleCommit}
      />
    </div>
  );
}

export default App;
