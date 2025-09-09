import React, { useState, useEffect } from 'react';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (commitName: string) => void;
}

const CommitModal: React.FC<CommitModalProps> = ({ isOpen, onClose, onCommit }) => {
  const [commitName, setCommitName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCommitName('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commitName.trim()) {
      onCommit(commitName.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="glass-card p-8 w-full max-w-md mx-4 animate-slide-up"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-secondary to-accent-secondary-hover rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Commit Changes</h2>
              <p className="text-sm text-text-muted">Save your conversation state</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="commitName" className="block text-sm font-medium text-text-secondary mb-3">
              Enter commit name
            </label>
            <input
              id="commitName"
              type="text"
              value={commitName}
              onChange={(e) => setCommitName(e.target.value)}
              placeholder="e.g., Add user authentication"
              className="input-modern w-full"
              autoFocus
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!commitName.trim()}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:rounded-none flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Commit
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-dark-surface-2/50 rounded-xl border border-dark-border">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Note:</span> This will save your current conversation state and allow you to fetch it later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitModal;
