import React from 'react';

interface Commit {
  id: string;
  name: string;
  timestamp: Date;
  author: string;
  message: string;
}

interface FetchPanelProps {
  onFetch: (commitId: string) => void;
  onBack: () => void;
}

const FetchPanel: React.FC<FetchPanelProps> = ({ onFetch, onBack }) => {
  // Mock data for commits
  const commits: Commit[] = [
    {
      id: '1',
      name: 'Add user authentication',
      timestamp: new Date('2024-01-15T10:30:00'),
      author: 'Developer',
      message: 'Implemented JWT-based authentication system with login and registration endpoints'
    },
    {
      id: '2',
      name: 'Update dashboard UI',
      timestamp: new Date('2024-01-14T15:45:00'),
      author: 'Developer',
      message: 'Redesigned dashboard with new components and improved responsive layout'
    },
    {
      id: '3',
      name: 'Fix API validation',
      timestamp: new Date('2024-01-13T09:20:00'),
      author: 'Developer',
      message: 'Added proper input validation and error handling for all API endpoints'
    },
    {
      id: '4',
      name: 'Add database migrations',
      timestamp: new Date('2024-01-12T14:15:00'),
      author: 'Developer',
      message: 'Created migration scripts for user table and added proper indexing'
    },
    {
      id: '5',
      name: 'Implement file upload',
      timestamp: new Date('2024-01-11T11:30:00'),
      author: 'Developer',
      message: 'Added file upload functionality with AWS S3 integration and progress tracking'
    },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-border p-6 bg-dark-surface/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="btn-ghost p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Commit History</h2>
                <p className="text-sm text-text-muted">Select a commit to restore</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated: {formatDate(commits[0].timestamp)}
          </div>
        </div>
      </div>

      {/* Commits List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {commits.map((commit, index) => (
            <div
              key={commit.id}
              onClick={() => onFetch(commit.id)}
              className="card-modern p-6 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-accent-secondary rounded-full animate-pulse"></div>
                    <h3 className="text-text-primary font-semibold group-hover:text-accent-primary transition-colors duration-300">
                      {commit.name}
                    </h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">{commit.message}</p>
                  <div className="flex items-center gap-6 text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {commit.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(commit.timestamp)}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {commit.id.substring(0, 8)}
                    </div>
                  </div>
                </div>
                <div className="ml-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no commits */}
        {commits.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-text-secondary animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-3xl flex items-center justify-center">
                <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-primary">No commits found</h3>
              <p className="text-sm">Create your first commit to see it here</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-dark-border p-6 bg-dark-surface/50 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {commits.length} commits available
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <div className="w-2 h-2 bg-accent-secondary rounded-full animate-pulse"></div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Auto-refresh enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchPanel;
