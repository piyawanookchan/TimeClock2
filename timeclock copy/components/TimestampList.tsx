
import React from 'react';
import { TimestampEntry } from '../types';
import { ClockIcon } from './icons/ClockIcon';

interface TimestampListProps {
  timestamps: TimestampEntry[];
}

const TimestampList: React.FC<TimestampListProps> = ({ timestamps }) => {
  if (timestamps.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <ClockIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No Timestamps Yet</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your clock-in and clock-out history will appear here.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const groupedByDate = timestamps.reduce<Record<string, TimestampEntry[]>>((acc, ts) => {
    const dateKey = formatDate(ts.time);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(ts);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="max-h-[22rem] overflow-y-auto pr-2 -mr-2 space-y-4">
        {Object.entries(groupedByDate).map(([date, entries]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 sticky top-0 bg-white dark:bg-slate-800 py-1 z-10">{date}</h3>
            <ul className="space-y-2">
              {entries.map((ts) => (
                <li key={ts.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${ts.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{ts.type}</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-300 font-mono">{formatTime(ts.time)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimestampList;
