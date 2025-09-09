import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Commit {
  commitId: string;
  name: string;
  timestamp: string;
  messageCount: number;
}

interface FetchPanelProps {
  onFetch: (commitId: string) => void;
  onBack: () => void;
  chatId?: string;
}

const FetchPanel: React.FC<FetchPanelProps> = ({ onFetch, onBack, chatId = 'default-chat' }) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCommits();
  }, [chatId]);

  const loadCommits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.getCommitHistory(chatId);
      
      if (result.error) {
        throw new Error(result.error);
      }

      setCommits(result.data?.commits || []);
    } catch (err) {
      console.error('Failed to load commits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load commits');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
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
            {commits.length > 0 ? `Last updated: ${formatDate(commits[0].timestamp)}` : 'No commits yet'}
          </div>
        </div>
      </div>

      {/* Commits List */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-text-secondary">
              <svg className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p>Loading commits...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-text-secondary">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent-danger/20 rounded-3xl flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text-primary">Error Loading Commits</h3>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={loadCommits}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map((commit, index) => (
              <div
                key={commit.commitId}
                onClick={() => onFetch(commit.commitId)}
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
                    <div className="flex items-center gap-6 text-xs text-text-muted">
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(commit.timestamp)}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {commit.messageCount} messages
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {commit.commitId.substring(0, 8)}
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
        )}

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
