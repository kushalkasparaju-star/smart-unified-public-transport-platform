import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { ICON_MAP } from '../constants';
import { driverReportsService, VehicleStatus, CrowdLevel } from '../driverReports';
import { useDriverAuth } from '../driverAuthContext';
import { LogOut, Clock, CheckCircle2, AlertTriangle, XCircle, Home, ArrowLeft } from 'lucide-react';

interface DriverDashboardProps {
  onNavigate: (screen: Screen) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onNavigate }) => {
  const { driver, signOut } = useDriverAuth();
  const [routeId, setRouteId] = useState(driver?.routeId || '42B');
  const [vehicleNumber, setVehicleNumber] = useState(driver?.vehicleNumber || '');
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus | null>(null);
  const [delayReason, setDelayReason] = useState('');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Sample routes for dropdown
  const availableRoutes = [
    { id: '42B', name: '42B • Blue Line' },
    { id: '101', name: '101 • Red Line' },
    { id: '205', name: '205 • Green Line' },
    { id: '88', name: '88 • Express' },
  ];

  useEffect(() => {
    // Load driver's vehicle number if available
    if (driver?.vehicleNumber) {
      setVehicleNumber(driver.vehicleNumber);
    }
    if (driver?.routeId) {
      setRouteId(driver.routeId);
    }

    // Load latest status updates
    loadLatestStatus();
  }, [driver, routeId]);

  useEffect(() => {
    // Load latest status when route changes
    loadLatestStatus();
  }, [routeId]);

  useEffect(() => {
    // Handle submit cooldown timer
    if (submitCooldown > 0) {
      const timer = setTimeout(() => {
        setSubmitCooldown(submitCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (submitCooldown === 0 && submitDisabled) {
      setSubmitDisabled(false);
    }
  }, [submitCooldown, submitDisabled]);

  const loadLatestStatus = () => {
    const latestUpdate = driverReportsService.getLatestStatusUpdate(routeId);
    const latestCrowd = driverReportsService.getLatestCrowdLevel(routeId);
    
    if (latestUpdate) {
      setVehicleStatus(latestUpdate.vehicleStatus || null);
      setDelayReason(latestUpdate.delayReason || '');
      setLastUpdated(latestUpdate.timestamp);
    }
    
    if (latestCrowd) {
      setCrowdLevel(latestCrowd);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);

    if (!vehicleNumber.trim()) {
      setError('Please enter vehicle number');
      return;
    }

    if (!vehicleStatus) {
      setError('Please select vehicle status');
      return;
    }

    if (!crowdLevel) {
      setError('Please select crowd level');
      return;
    }

    if (vehicleStatus === 'delayed' && !delayReason.trim()) {
      setError('Please provide a delay reason');
      return;
    }

    try {
      const routeName = availableRoutes.find(r => r.id === routeId)?.name || routeId;
      
      driverReportsService.createStatusUpdate(
        routeId,
        routeName,
        vehicleNumber.trim(),
        vehicleStatus,
        crowdLevel,
        driver?.driverId || 'unknown',
        vehicleStatus === 'delayed' ? delayReason.trim() : undefined
      );

      setLastUpdated(Date.now());
      setShowSuccess(true);
      setSubmitDisabled(true);
      setSubmitCooldown(30);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    // Redirect will be handled by App.tsx
  };

  const getStatusColor = (status: VehicleStatus | null): string => {
    switch (status) {
      case 'on-time': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'delayed': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'breakdown': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCrowdColor = (level: CrowdLevel | null): string => {
    switch (level) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'overcrowded': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const formatLastUpdated = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* BACK BUTTON - Issue 1 Fix */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Driver Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {driver?.name || `Driver: ${driver?.driverId || 'Unknown'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              Status updated successfully!
            </span>
          </div>
        )}

        {/* Current Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Vehicle Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Vehicle Status</h3>
              {vehicleStatus === 'on-time' && <CheckCircle2 className="text-emerald-500" size={20} />}
              {vehicleStatus === 'delayed' && <AlertTriangle className="text-amber-500" size={20} />}
              {vehicleStatus === 'breakdown' && <XCircle className="text-red-500" size={20} />}
            </div>
            <p className={`text-2xl font-bold mb-2 ${
              vehicleStatus === 'on-time' ? 'text-emerald-600' :
              vehicleStatus === 'delayed' ? 'text-amber-600' :
              vehicleStatus === 'breakdown' ? 'text-red-600' :
              'text-slate-400'
            }`}>
              {vehicleStatus ? vehicleStatus.charAt(0).toUpperCase() + vehicleStatus.slice(1).replace('-', ' ') : 'Not Set'}
            </p>
            {vehicleNumber && (
              <p className="text-xs text-slate-500 dark:text-slate-400">Vehicle: {vehicleNumber}</p>
            )}
          </div>

          {/* Crowd Level Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Crowd Level</h3>
              {ICON_MAP.Users}
            </div>
            <p className={`text-2xl font-bold mb-2 ${
              crowdLevel === 'low' ? 'text-emerald-600' :
              crowdLevel === 'medium' ? 'text-amber-600' :
              crowdLevel === 'high' ? 'text-orange-600' :
              crowdLevel === 'overcrowded' ? 'text-red-600' :
              'text-slate-400'
            }`}>
              {crowdLevel ? crowdLevel.charAt(0).toUpperCase() + crowdLevel.slice(1) : 'Not Set'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current route</p>
          </div>

          {/* Last Updated Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Updated</h3>
              <Clock className="text-slate-400" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {formatLastUpdated(lastUpdated)}
            </p>
            {lastUpdated && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Status Update Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Driver Status Update Panel
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Route ID and Vehicle Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Route ID <span className="text-red-500">*</span>
                </label>
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  {availableRoutes.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vehicle Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase"
                  placeholder="MH-12-AB-1234"
                  required
                />
              </div>
            </div>

            {/* Vehicle Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Current Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setVehicleStatus('on-time');
                    setDelayReason('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    vehicleStatus === 'on-time'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`${vehicleStatus === 'on-time' ? 'text-emerald-600' : 'text-slate-400'}`} size={24} />
                    <div className="text-left">
                      <p className={`font-bold ${vehicleStatus === 'on-time' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        On Time
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Running smoothly</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleStatus('delayed')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    vehicleStatus === 'delayed'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`${vehicleStatus === 'delayed' ? 'text-amber-600' : 'text-slate-400'}`} size={24} />
                    <div className="text-left">
                      <p className={`font-bold ${vehicleStatus === 'delayed' ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        Delayed
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Running behind</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVehicleStatus('breakdown');
                    setDelayReason('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    vehicleStatus === 'breakdown'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <XCircle className={`${vehicleStatus === 'breakdown' ? 'text-red-600' : 'text-slate-400'}`} size={24} />
                    <div className="text-left">
                      <p className={`font-bold ${vehicleStatus === 'breakdown' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        Breakdown
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Vehicle issue</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Delay Reason (only shown when Delayed is selected) */}
            {vehicleStatus === 'delayed' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Delay Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Heavy traffic, Accident on route, Weather conditions..."
                  rows={3}
                  required
                />
              </div>
            )}

            {/* Crowd Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Crowd Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['low', 'medium', 'high', 'overcrowded'] as CrowdLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setCrowdLevel(level)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      crowdLevel === level
                        ? level === 'low' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' :
                          level === 'medium' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' :
                          level === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                          'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      <p className={`font-bold text-sm ${
                        crowdLevel === level
                          ? level === 'low' ? 'text-emerald-600' :
                            level === 'medium' ? 'text-amber-600' :
                            level === 'high' ? 'text-orange-600' :
                            'text-red-600'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </p>
                      {level === 'low' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Seats available</p>}
                      {level === 'medium' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Standing room</p>}
                      {level === 'high' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Crowded</p>}
                      {level === 'overcrowded' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full capacity</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                disabled={submitDisabled}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all ${
                  submitDisabled
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {submitDisabled
                  ? `Please wait ${submitCooldown}s before submitting again`
                  : 'Submit Status Update'
                }
              </button>
              {submitDisabled && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                  Status updates are rate-limited to prevent spam
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
