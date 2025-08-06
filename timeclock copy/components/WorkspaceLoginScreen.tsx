
import React, { useState } from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { LockIcon } from './icons/LockIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface WorkspaceLoginScreenProps {
  onLogin: (password: string) => boolean;
  onCancel: () => void;
}

const WorkspaceLoginScreen: React.FC<WorkspaceLoginScreenProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-slide-in-up">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <BriefcaseIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-brand-primary" />
          <h1 className="mt-4 text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your password to access the workspace.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Workspace Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <LockIcon className="w-5 h-5" />
              </span>
              <input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                aria-describedby="password-error"
                autoFocus
              />
            </div>
            {error && <p id="password-error" className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!password.trim()}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>Login</span>
            <ArrowRightIcon />
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-center mt-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
          >
            Back to Time Clock
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceLoginScreen;
