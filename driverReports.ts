// Driver reports storage service (mock data with localStorage persistence)

export type DelayStatus = 'on-time' | 'delayed' | 'heavily-delayed';
export type VehicleStatus = 'on-time' | 'delayed' | 'breakdown';
export type CrowdLevel = 'low' | 'medium' | 'high' | 'overcrowded';

export interface DriverReport {
  id: string;
  routeId: string;
  routeName: string;
  delayStatus: DelayStatus;
  crowdLevel: CrowdLevel;
  timestamp: number;
  driverId?: string;
  // New fields for enhanced status updates
  vehicleNumber?: string;
  vehicleStatus?: VehicleStatus;
  delayReason?: string;
}

const STORAGE_KEY = 'driver_reports';

// Load reports from localStorage
const loadReports = (): DriverReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return [];
};

// Save reports to localStorage
const saveReports = (reports: DriverReport[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // Ignore storage errors
  }
};

export const driverReportsService = {
  // Create a new report (legacy method for backward compatibility)
  createReport(
    routeId: string,
    routeName: string,
    delayStatus: DelayStatus,
    crowdLevel: CrowdLevel,
    driverId?: string
  ): DriverReport {
    const report: DriverReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      routeId,
      routeName,
      delayStatus,
      crowdLevel,
      timestamp: Date.now(),
      driverId
    };

    const reports = loadReports();
    reports.push(report);
    saveReports(reports);

    return report;
  },

  // Create a new enhanced status update
  createStatusUpdate(
    routeId: string,
    routeName: string,
    vehicleNumber: string,
    vehicleStatus: VehicleStatus,
    crowdLevel: CrowdLevel,
    driverId: string,
    delayReason?: string
  ): DriverReport {
    // Map vehicleStatus to delayStatus for compatibility
    let delayStatus: DelayStatus = 'on-time';
    if (vehicleStatus === 'delayed') {
      delayStatus = 'delayed';
    } else if (vehicleStatus === 'breakdown') {
      delayStatus = 'heavily-delayed';
    }

    const report: DriverReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      routeId,
      routeName,
      delayStatus,
      crowdLevel,
      timestamp: Date.now(),
      driverId,
      vehicleNumber,
      vehicleStatus,
      delayReason
    };

    const reports = loadReports();
    reports.push(report);
    saveReports(reports);

    return report;
  },

  // Get all reports
  getAllReports(): DriverReport[] {
    return loadReports();
  },

  // Get latest report for a route
  getLatestReport(routeId: string): DriverReport | null {
    const reports = loadReports()
      .filter(r => r.routeId === routeId)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return reports.length > 0 ? reports[0] : null;
  },

  // Get latest status update for a route (includes vehicle status)
  getLatestStatusUpdate(routeId: string): DriverReport | null {
    const reports = loadReports()
      .filter(r => r.routeId === routeId && r.vehicleStatus !== undefined)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return reports.length > 0 ? reports[0] : null;
  },

  // Get latest crowd level for a route
  getLatestCrowdLevel(routeId: string): CrowdLevel | null {
    const latestReport = this.getLatestReport(routeId);
    return latestReport?.crowdLevel || null;
  },

  // Get latest vehicle status for a route
  getLatestVehicleStatus(routeId: string): VehicleStatus | null {
    const latestUpdate = this.getLatestStatusUpdate(routeId);
    return latestUpdate?.vehicleStatus || null;
  },

  // Get reports for a specific route
  getReportsByRoute(routeId: string): DriverReport[] {
    return loadReports()
      .filter(r => r.routeId === routeId)
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  // Clear all reports (for testing)
  clearAllReports(): void {
    saveReports([]);
  }
};

