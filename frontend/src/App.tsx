import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import CommitModal from './components/CommitModal';
import FetchPanel from './components/FetchPanel';
import LandingPage from './components/LandingPage';
import { apiService } from './services/api';
import { showBackendStatus } from './utils/healthCheck';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatListItem {
  chatId: string;
  name: string;
  updatedAt: string;
}

const AppContent: React.FC = () => {
  const { user, login, register, logout, isLoading: authLoading, error: authError } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showFetchPanel, setShowFetchPanel] = useState(false);
  const [chats, setChats] = useState<ChatListItem[]>([]);

  // Check backend health and load chats on login
  useEffect(() => {
    showBackendStatus();
  }, []);

  useEffect(() => {
    if (!user) return;
    loadChats();
  }, [user]);

  const loadChats = async () => {
    const result = await apiService.listChats();
    if (!result.error) {
      setChats(result.data?.chats || []);
      if (!activeChatId && (result.data?.chats?.length || 0) > 0) {
        setActiveChatId(result.data!.chats[0].chatId);
        // Optionally load messages here
        const msgs = await apiService.getChatMessages(result.data!.chats[0].chatId);
        if (!msgs.error) {
          setMessages((msgs.data?.messages || []).map((m: any, i: number) => ({
            id: `${i}`,
            content: m.content,
            sender: m.role === 'user' ? 'user' : 'assistant',
            timestamp: new Date(m.timestamp),
          })));
        }
      }
    }
  };

  // Show landing page if not authenticated
  if (!user) {
    return (
      <LandingPage
        onLogin={login}
        onRegister={register}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  const createNewChat = async () => {
    // Create on backend with sequential name
    const result = await apiService.createChat();
    if (result.error) {
      alert(result.error);
      return;
    }
    const created = result.data!;
    setChats(prev => [{ chatId: created.chatId, name: created.name, updatedAt: created.updatedAt }, ...prev]);
    setActiveChatId(created.chatId);
    setMessages([]);
    setShowFetchPanel(false);
  };

  const handleSendMessage = async (content: string) => {
    const chatId = activeChatId || (await (async () => {
      const r = await apiService.createChat();
      if (r.error) throw new Error(r.error);
      const c = r.data!;
      setChats(prev => [{ chatId: c.chatId, name: c.name, updatedAt: c.updatedAt }, ...prev]);
      setActiveChatId(c.chatId);
      return c.chatId;
    })());

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await apiService.sendMessage(chatId, content);
      if (result.error) throw new Error(result.error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.data?.assistantMessage || 'Sorry, I could not process your request.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      // refresh chat list order
      loadChats();
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, there was an error processing your message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    setActiveChatId(chatId);
    const msgs = await apiService.getChatMessages(chatId);
    if (!msgs.error) {
      setMessages((msgs.data?.messages || []).map((m: any, i: number) => ({
        id: `${i}`,
        content: m.content,
        sender: m.role === 'user' ? 'user' : 'assistant',
        timestamp: new Date(m.timestamp),
      })));
    } else {
      setMessages([]);
    }
  };

  const handleCommit = async (commitName: string) => {
    try {
      const result = await apiService.createCommit(activeChatId || 'default-chat', commitName);
      if (result.error) throw new Error(result.error);
      alert(`Commit "${commitName}" created successfully!`);
    } catch (error) {
      console.error('Commit error:', error);
      alert(`Failed to create commit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFetch = async (commitId: string) => {
    try {
      const result = await apiService.fetchCommit(commitId);
      if (result.error) throw new Error(result.error);
      const restoredMessages = result.data?.restoredMessages || [];
      setMessages(restoredMessages.map((msg: any, index: number) => ({ id: index.toString(), content: msg.content, sender: msg.role === 'user' ? 'user' : 'assistant', timestamp: new Date(msg.timestamp) })));
      alert(`Fetched commit ${commitId}!`);
      setShowFetchPanel(false);
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Failed to fetch commit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      {/* Sidebar */}
      <Sidebar 
        onChatSelect={handleChatSelect}
        activeChatId={activeChatId}
        onLogout={logout}
        user={user}
        onNewChat={createNewChat}
        chats={chats}
      >
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="bg-dark-surface/50 backdrop-blur-sm border-b border-dark-border p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">PromptPilot</h1>
                <p className="text-xs text-text-muted">{activeChatId ? `Chat: ${activeChatId}` : 'Start a new chat'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowCommitModal(true)} className="btn-secondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Commit
              </button>
              <button onClick={() => setShowFetchPanel(true)} className="btn-primary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Fetch
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area or Fetch Panel */}
        {showFetchPanel ? (
          <FetchPanel onFetch={handleFetch} onBack={() => setShowFetchPanel(false)} chatId={activeChatId || 'default-chat'} />
        ) : (
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
        )}
      </div>

      {/* Commit Modal */}
      <CommitModal isOpen={showCommitModal} onClose={() => setShowCommitModal(false)} onCommit={handleCommit} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
