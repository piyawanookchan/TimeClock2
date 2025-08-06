
import React, { useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Employee, TimestampEntry, TimestampType } from './types';
import SetupScreen from './components/SetupScreen';
import DashboardScreen from './components/DashboardScreen';
import ReportScreen from './components/ReportScreen';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { LogoutIcon } from './components/icons/LogoutIcon';
import AdminSetupScreen from './components/AdminSetupScreen';
import WorkspaceLoginScreen from './components/WorkspaceLoginScreen';
import { ShieldCheckIcon } from './components/icons/ShieldCheckIcon';


const App: React.FC = () => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', []);
  const [currentUser, setCurrentUser] = useLocalStorage<Employee | null>('currentUser', null);
  const [currentCompany, setCurrentCompany] = useLocalStorage<string | null>('currentCompany', null);
  
  const [workspacePassword, setWorkspacePassword] = useLocalStorage<string | null>('workspacePassword', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [view, setView] = useState<'employee' | 'admin_login'>('employee');

  useEffect(() => {
    // If a workspace password exists, but we are not authenticated,
    // ensure we are in a state where the user can act as an employee or login.
    if (workspacePassword && !isAuthenticated) {
      setView('employee');
    }
  }, [workspacePassword, isAuthenticated]);

  const handleAdminSetup = (password: string) => {
    setWorkspacePassword(password);
    setIsAuthenticated(true);
    setView('employee'); // Or redirect to a dedicated admin view
  };
  
  const handleWorkspaceLogin = (password: string): boolean => {
    if (password === workspacePassword) {
      setIsAuthenticated(true);
      setView('employee'); // Will render admin panel due to isAuthenticated
      return true;
    }
    return false;
  };
  
  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setView('employee');
  };

  const handleLogin = useCallback((name: string, company: string) => {
    const normalizedName = name.trim();
    let user = employees.find(emp => emp.name.toLowerCase() === normalizedName.toLowerCase() && emp.company === company);

    if (!user) {
      user = { id: crypto.randomUUID(), name: normalizedName, company, timestamps: [] };
      setEmployees(prev => [...prev, user!]);
    }
    
    setCurrentUser(user);
    setCurrentCompany(company);
  }, [employees, setEmployees, setCurrentUser, setCurrentCompany]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const addTimestamp = useCallback((type: TimestampType) => {
    if (!currentUser || !currentCompany) return;

    const newTimestamp: TimestampEntry = {
      id: crypto.randomUUID(),
      type,
      time: new Date().toISOString(),
    };
    
    const updatedEmployees = employees.map(emp => {
      if (emp.id === currentUser.id) {
        const updatedEmp = { ...emp, timestamps: [newTimestamp, ...emp.timestamps] };
        setCurrentUser(updatedEmp);
        return updatedEmp;
      }
      return emp;
    });

    setEmployees(updatedEmployees);
  }, [currentUser, currentCompany, employees, setCurrentUser, setEmployees]);
  
  const removeEmployee = useCallback(() => {
    if (!currentUser) return;
    
    const updatedEmployees = employees.filter(emp => emp.id !== currentUser.id);
    setEmployees(updatedEmployees);
    handleLogout();
  }, [currentUser, employees, setEmployees, handleLogout]);
  
  // Render initial setup if no password is set
  if (!workspacePassword) {
      return <AdminSetupScreen onSetup={handleAdminSetup} />;
  }
  
  // Render Admin View if authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-2xl mx-auto">
          
          <header className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                  <BriefcaseIcon className="w-8 h-8 text-brand-primary" />
                  <div>
                    <h1 className="text-xl font-bold text-slate-700 dark:text-slate-200">Admin Panel</h1>
                    <p className="text-sm text-slate-500">Consolidated Report</p>
                  </div>
              </div>
              <button
                  onClick={handleAdminLogout}
                  aria-label="Logout"
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors bg-slate-200 text-slate-700 hover:bg-red-200 hover:text-red-800 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-red-500/50 dark:hover:text-white"
              >
                  <LogoutIcon />
                  <span>Logout</span>
              </button>
          </header>
          
          <main className="animate-fade-in bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
              <ReportScreen employees={employees} />
          </main>
          
          <footer className="text-center mt-8 text-xs text-slate-400">
            <p>Time Clock App &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    );
  }

  // Render Employee-facing view (or login screen)
  const renderEmployeeContent = () => {
    if (view === 'admin_login') {
      return <WorkspaceLoginScreen onLogin={handleWorkspaceLogin} onCancel={() => setView('employee')} />;
    }

    if (currentUser && currentCompany) {
      return (
        <DashboardScreen
          user={currentUser}
          company={currentCompany}
          onClockIn={() => addTimestamp('in')}
          onClockOut={() => addTimestamp('out')}
          onRemoveEmployee={removeEmployee}
          onLogout={handleLogout}
        />
      );
    }
    
    return <SetupScreen onSetupComplete={handleLogin} employees={employees} />;
  };

  return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-md mx-auto relative">
               {renderEmployeeContent()}
               {view === 'employee' && (
                  <footer className="text-center mt-8 text-xs text-slate-400">
                      <button onClick={() => setView('admin_login')} className="hover:text-brand-primary transition-colors flex items-center gap-1 mx-auto font-semibold">
                         <ShieldCheckIcon className="w-4 h-4" />
                         Admin Login
                      </button>
                 </footer>
               )}
          </div>
      </div>
  )
};

export default App;
