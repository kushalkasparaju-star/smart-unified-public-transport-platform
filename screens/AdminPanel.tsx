import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { driverReportsService, DriverReport } from '../driverReports';
import { ICON_MAP } from '../constants';

interface AdminPanelProps {
  onNavigate: (screen: Screen) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<DriverReport[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadReports();
    // Refresh reports every 5 seconds
    const interval = setInterval(() => {
      loadReports();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const loadReports = () => {
    const allReports = driverReportsService.getAllReports();
    // Sort by timestamp, newest first
    const sorted = allReports.sort((a, b) => b.timestamp - a.timestamp);
    setReports(sorted);
  };

  const getDelayBadgeColor = (delay: string) => {
    switch (delay) {
      case 'on-time': return 'bg-emerald-100 text-emerald-600';
      case 'delayed': return 'bg-amber-100 text-amber-600';
      case 'heavily-delayed': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getCrowdBadgeColor = (crowd: string) => {
    switch (crowd) {
      case 'low': return 'bg-emerald-100 text-emerald-600';
      case 'medium': return 'bg-amber-100 text-amber-600';
      case 'high': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getDelayLabel = (delay: string) => {
    switch (delay) {
      case 'on-time': return 'On-Time';
      case 'delayed': return 'Delayed';
      case 'heavily-delayed': return 'Heavily Delayed';
      default: return delay;
    }
  };

  const getCrowdLabel = (crowd: string) => {
    return crowd.charAt(0).toUpperCase() + crowd.slice(1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h1>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Driver Reports</h2>
        {reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400">No driver reports yet. Reports will appear here when drivers submit delay and crowd level information.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {report.routeName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatTimestamp(report.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                      Delay Status
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getDelayBadgeColor(report.delayStatus)}`}>
                      {getDelayLabel(report.delayStatus)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                      Crowd Level
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${getCrowdBadgeColor(report.crowdLevel)}`}>
                      {getCrowdLabel(report.crowdLevel)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <button
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
          onClick={() => onNavigate('home')}
        >
          Go to Home
        </button>

        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          onClick={() => onNavigate('driver')}
        >
          Go to Driver Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
