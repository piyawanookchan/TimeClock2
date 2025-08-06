
import React, { useState } from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { LockIcon } from './icons/LockIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface AdminSetupScreenProps {
  onSetup: (password: string) => void;
}

const AdminSetupScreen: React.FC<AdminSetupScreenProps> = ({ onSetup }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    onSetup(password);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-sm mx-auto">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <BriefcaseIcon className="mx-auto h-16 w-16 text-brand-primary" />
            <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Create Your Private Workspace</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Set an admin password to secure your company's time clock data.
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LockIcon className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a secure password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                  aria-describedby="password-error"
                />
              </div>
              {error && <p id="password-error" className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!password.trim()}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span>Create Workspace</span>
              <ArrowRightIcon />
            </button>
          </div>
        </form>
        <footer className="text-center mt-8 text-xs text-slate-400">
          <p>Time Clock App &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminSetupScreen;
