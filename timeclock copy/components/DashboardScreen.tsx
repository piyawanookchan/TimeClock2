
import React from 'react';
import { Employee } from '../types';
import TimestampList from './TimestampList';
import { ClockIcon } from './icons/ClockIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { LogoutIcon } from './icons/LogoutIcon';


interface DashboardScreenProps {
  user: Employee;
  company: string;
  onClockIn: () => void;
  onClockOut: () => void;
  onRemoveEmployee: () => void; // Kept for potential future admin actions
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, company, onClockIn, onClockOut, onLogout }) => {
  const lastTimestampType = user.timestamps[0]?.type;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full animate-slide-in-up">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark dark:text-brand-light">
            Welcome, {user.name.split(' ')[0]}!
          </h1>
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <BuildingIcon className="w-4 h-4" />
            <span>{company}</span>
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={onClockIn}
          disabled={lastTimestampType === 'in'}
          className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          <ClockIcon />
          <span>Clock In</span>
        </button>
        <button
          onClick={onClockOut}
          disabled={lastTimestampType !== 'in'}
          className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          <ClockIcon />
          <span>Clock Out</span>
        </button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
            Your History
        </h2>
        <TimestampList timestamps={user.timestamps} />
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Finished using the time clock?
        </p>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <LogoutIcon />
          <span>Switch User</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardScreen;
