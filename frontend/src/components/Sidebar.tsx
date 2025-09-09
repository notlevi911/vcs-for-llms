import React from 'react';

interface SidebarProps {
  onChatSelect: (chatId: string) => void;
  activeChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onChatSelect, activeChatId }) => {
  // Mock data for previous chats
  const previousChats = [
    { id: '1', title: 'React Component Architecture', timestamp: '2 hours ago' },
    { id: '2', title: 'Tailwind CSS Best Practices', timestamp: '1 day ago' },
    { id: '3', title: 'TypeScript Advanced Types', timestamp: '3 days ago' },
    { id: '4', title: 'API Integration Patterns', timestamp: '1 week ago' },
    { id: '5', title: 'State Management Solutions', timestamp: '2 weeks ago' },
  ];

  return (
    <div className="w-64 bg-dark-surface h-screen flex flex-col border-r border-dark-border backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">PromptPilot</h1>
            <p className="text-xs text-text-muted">AI-Powered Development</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Previous Chats */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-4 px-2">Previous Chats</h3>
        <div className="space-y-1">
          {previousChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`sidebar-item ${activeChatId === chat.id ? 'active' : ''}`}
            >
              <div className="flex flex-col">
                <span className="text-sm text-text-primary truncate font-medium">{chat.title}</span>
                <span className="text-xs text-text-muted mt-1">{chat.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-secondary to-accent-secondary-hover rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-text-primary font-medium">Developer</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent-secondary rounded-full animate-pulse"></div>
              <p className="text-xs text-text-muted">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
