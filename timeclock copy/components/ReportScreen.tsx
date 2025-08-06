import React from 'react';
import { Employee, TimestampEntry } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { FileDownloadIcon } from './icons/FileDownloadIcon';


// Declare the XLSX variable injected by the script tag in index.html
declare const XLSX: any;

interface ReportScreenProps {
  employees: Employee[];
}

interface WorkSession {
  inTime: string;
  outTime: string | null;
  duration: number | null; // in milliseconds
}

// Helper Functions
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const formatTime = (dateString: string) => dateString ? new Date(dateString).toLocaleTimeString(undefined, {
  hour: '2-digit', minute: '2-digit',
}) : '';

const formatDuration = (ms: number | null) => {
  if (ms === null || ms < 0) return '0m';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  let result = '';
  if (hours > 0) result += `${hours}h `;
  result += `${minutes}m`;
  return result.trim();
};

const formatDurationForExcel = (ms: number | null): string => {
  if (ms === null || ms < 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const calculateWorkSessionsForEmployee = (timestamps: TimestampEntry[]): WorkSession[] => {
  const sessions: WorkSession[] = [];
  const sortedTs = [...timestamps].reverse();
  let currentIn: string | null = null;
  for (const ts of sortedTs) {
    if (ts.type === 'in') {
      if (currentIn) sessions.push({ inTime: currentIn, outTime: null, duration: null });
      currentIn = ts.time;
    } else if (ts.type === 'out' && currentIn) {
      sessions.push({
        inTime: currentIn,
        outTime: ts.time,
        duration: new Date(ts.time).getTime() - new Date(currentIn).getTime(),
      });
      currentIn = null;
    }
  }
  if (currentIn) sessions.push({ inTime: currentIn, outTime: null, duration: null });
  return sessions.reverse();
};

// Data Structure Interfaces
interface DailyReport { sessions: WorkSession[]; totalDuration: number; }
interface EmployeeReport { employeeId: string; employeeName: string; dailyReports: Record<string, DailyReport>; totalDuration: number; }
interface CompanyReport { companyName: string; employeeReports: EmployeeReport[]; totalDuration: number; }


const ReportScreen: React.FC<ReportScreenProps> = ({ employees }) => {
  
  const processedReportData = React.useMemo<CompanyReport[]>(() => {
    const employeesByCompany = employees.reduce<Record<string, Employee[]>>((acc, emp) => {
      const companyName = emp.company || 'Uncategorized';
      if (!acc[companyName]) acc[companyName] = [];
      acc[companyName].push(emp);
      return acc;
    }, {});

    return Object.entries(employeesByCompany).map(([companyName, companyEmployees]) => {
      let companyTotalDuration = 0;
      const employeeReports: EmployeeReport[] = companyEmployees.map(employee => {
        const workSessions = calculateWorkSessionsForEmployee(employee.timestamps);
        let employeeTotalDuration = 0;
        const dailyReports = workSessions.reduce<Record<string, DailyReport>>((acc, session) => {
          const dateKey = formatDate(session.inTime);
          if (!acc[dateKey]) acc[dateKey] = { sessions: [], totalDuration: 0 };
          acc[dateKey].sessions.push(session);
          if (session.duration) {
            acc[dateKey].totalDuration += session.duration;
            employeeTotalDuration += session.duration;
          }
          return acc;
        }, {});
        companyTotalDuration += employeeTotalDuration;
        return { employeeId: employee.id, employeeName: employee.name, dailyReports, totalDuration: employeeTotalDuration };
      });

      return {
        companyName,
        employeeReports: employeeReports.filter(er => Object.keys(er.dailyReports).length > 0),
        totalDuration: companyTotalDuration,
      };
    }).sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [employees]);

  const handleExport = () => {
    const flatData: (string | number)[][] = [];
    flatData.push(['Company', 'Employee', 'Date', 'Clock In', 'Clock Out', 'Duration (HH:MM)']);
    
    processedReportData.forEach(companyData => {
        companyData.employeeReports.forEach(employeeData => {
            Object.entries(employeeData.dailyReports).forEach(([date, dateData]) => {
                dateData.sessions.forEach(session => {
                    flatData.push([
                        companyData.companyName,
                        employeeData.employeeName,
                        date,
                        formatTime(session.inTime),
                        session.outTime ? formatTime(session.outTime) : 'In Progress',
                        session.duration ? formatDurationForExcel(session.duration) : '00:00'
                    ]);
                });
            });
        });
    });

    if (flatData.length <= 1) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(flatData);
    worksheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consolidated Report');
    const today = new Date().toISOString().split('T')[0];
    const fileName = `Consolidated_Work_Report_${today}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const hasReports = processedReportData.some(c => c.employeeReports.length > 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-end items-center">
        <button onClick={handleExport} disabled={!hasReports} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-light dark:bg-brand-dark dark:text-brand-light rounded-md hover:bg-brand-secondary/30 dark:hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Export all work reports to Excel">
          <FileDownloadIcon className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>
      
      { !hasReports ? (
        <div className="text-center py-10 px-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          <ChartBarIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No Report Data</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No time has been logged by any employee yet.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2 space-y-3">
          {processedReportData.map(companyData => companyData.employeeReports.length > 0 && (
            <details key={companyData.companyName} className="bg-slate-100 dark:bg-slate-900/50 rounded-lg group" open>
              <summary className="font-bold text-lg text-brand-dark dark:text-brand-light cursor-pointer list-none flex justify-between items-center p-3">
                <span>{companyData.companyName}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total: {formatDuration(companyData.totalDuration)}</span>
                  <div className="transition-transform duration-300 group-open:rotate-90 text-slate-500">&#9654;</div>
                </div>
              </summary>
              <div className="pl-3 pr-1 pb-1 space-y-2">
                {companyData.employeeReports.map(employeeData => (
                  <details key={employeeData.employeeId} className="bg-white dark:bg-slate-800 rounded-lg" open>
                    <summary className="font-semibold text-slate-800 dark:text-slate-100 cursor-pointer list-none flex justify-between items-center p-3">
                      <span>{employeeData.employeeName}</span>
                      <span className="text-xs font-bold text-brand-primary dark:text-brand-light">Total: {formatDuration(employeeData.totalDuration)}</span>
                    </summary>
                    <div className="px-3 pb-3 border-t border-slate-200 dark:border-slate-700 space-y-4 pt-3">
                      {Object.entries(employeeData.dailyReports).map(([date, dateData]) => (
                        <div key={date}>
                          <div className="flex justify-between items-baseline mb-2 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                            <h3 className="font-semibold text-slate-600 dark:text-slate-300 text-sm">{date}</h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Daily: {formatDuration(dateData.totalDuration)}</p>
                          </div>
                          <ul className="space-y-2">
                            {dateData.sessions.map((session, index) => (
                              <li key={index} className="grid grid-cols-3 items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                 <div className="font-mono flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                  {formatTime(session.inTime)}
                                </div>
                                <div className="text-center text-slate-400">&rarr;</div>
                                <div className="font-mono flex items-center justify-end gap-2">
                                  {session.outTime ? (
                                      <>
                                          {formatTime(session.outTime)}
                                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                      </>
                                  ) : ( <span className="text-xs italic text-slate-400">In Progress</span> )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportScreen;