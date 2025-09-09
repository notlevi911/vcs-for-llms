import React, { useState } from 'react';

interface LandingPageProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, isLoading, error }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginMode) {
      onLogin(formData.email, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      onRegister(formData.name, formData.email, formData.password);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">PromptPilot</h1>
          <p className="text-text-muted">AI-Powered Development Assistant</p>
        </div>

        {/* Auth Form */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-text-muted text-sm">
              {isLoginMode ? 'Sign in to continue' : 'Join PromptPilot today'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-accent-danger/20 border border-accent-danger/30 rounded-xl">
              <p className="text-accent-danger text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLoginMode}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input-modern w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="input-modern w-full"
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLoginMode}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-modern w-full"
                  placeholder="Confirm your password"
                />
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-accent-danger text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLoginMode && formData.password !== formData.confirmPassword)}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="text-accent-primary hover:text-accent-primary-hover ml-1 font-medium transition-colors duration-200"
              >
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-text-primary font-medium text-sm">AI Chat</h3>
            <p className="text-text-muted text-xs">Intelligent conversations</p>
          </div>
          <div className="p-4">
            <div className="w-8 h-8 bg-accent-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-text-primary font-medium text-sm">Commit System</h3>
            <p className="text-text-muted text-xs">Save & restore chats</p>
          </div>
          <div className="p-4">
            <div className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-text-primary font-medium text-sm">Version Control</h3>
            <p className="text-text-muted text-xs">Git-like history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
