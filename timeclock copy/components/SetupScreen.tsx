
import React, { useState, useMemo, useEffect } from 'react';
import { COMPANY_NAMES } from '../constants';
import { BuildingIcon } from './icons/BuildingIcon';
import { UserIcon } from './icons/UserIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { Employee } from '../types';

interface SetupScreenProps {
  onSetupComplete: (name: string, company: string) => void;
  employees: Employee[];
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete, employees }) => {
  const [newName, setNewName] = useState('');
  const [company, setCompany] = useState(COMPANY_NAMES[0]);
  const [error, setError] = useState('');
  const [view, setView] = useState<'select' | 'new'>('new');

  const filteredEmployees = useMemo(() => {
    // Gracefully handle employees from old data model without a company property
    return employees.filter(emp => emp.company === company);
  }, [employees, company]);
  
  useEffect(() => {
    // When company or employee list changes, decide which view to show.
    // If there are users for this company, show the list. Otherwise, go to new user form.
    setView(filteredEmployees.length > 0 ? 'select' : 'new');
  }, [filteredEmployees]);


  const handleSelectUser = (userName: string) => {
    onSetupComplete(userName, company);
  };

  const handleSubmitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim().length < 2) {
      setError('Please enter a valid name (at least 2 characters).');
      return;
    }
    // Prevent creating a user with a name that already exists in the selected company
    if (filteredEmployees.some(emp => emp.name.toLowerCase() === newName.trim().toLowerCase())) {
        setError('This name already exists in this company. Please choose another name or select from the list.');
        return;
    }
    setError('');
    onSetupComplete(newName, company);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2 text-brand-primary dark:text-brand-light">
        {view === 'select' ? 'Select Profile' : 'Welcome!'}
      </h1>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
        {view === 'select' ? 'Choose your company and name to continue.' : "Let's get you set up."}
      </p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Select Your Company
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <BuildingIcon />
            </span>
            <select
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            >
              {COMPANY_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {view === 'select' ? (
          <div className="animate-fade-in">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Returning Users for {company}</h2>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 -mr-2">
              {filteredEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => handleSelectUser(emp.name)}
                  className="w-full flex items-center gap-3 text-left p-3 bg-slate-100 dark:bg-slate-700 hover:bg-brand-light dark:hover:bg-brand-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <UserIcon />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{emp.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setView('new')}
              className="w-full text-center mt-4 text-sm font-semibold text-brand-primary hover:text-brand-secondary dark:text-brand-light dark:hover:text-white transition"
            >
              + Add a new user for {company}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitNewUser} className="space-y-6 animate-fade-in">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Enter Your Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon />
                </span>
                <input
                  id="name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!newName.trim()}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span>Continue</span>
              <ArrowRightIcon />
            </button>
            {filteredEmployees.length > 0 && (
                <button
                    type="button"
                    onClick={() => setView('select')}
                    className="w-full text-center mt-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
                >
                    Back to user list
                </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SetupScreen;
