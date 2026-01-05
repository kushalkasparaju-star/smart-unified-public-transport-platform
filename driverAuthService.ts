// Driver authentication service (separate from regular user auth)

export interface Driver {
  driverId: string;
  name?: string;
  vehicleNumber?: string;
  routeId?: string;
}

// Mock storage for driver auth
const MOCK_DRIVERS_STORAGE_KEY = 'mock_drivers_storage';
const mockDrivers: Map<string, { driverId: string; password: string; name?: string; vehicleNumber?: string; routeId?: string }> = new Map();
const mockDriverSessions: Map<string, Driver> = new Map();

// Load mock drivers from localStorage on initialization
const loadMockDrivers = (): void => {
  try {
    const stored = localStorage.getItem(MOCK_DRIVERS_STORAGE_KEY);
    if (stored) {
      const drivers = JSON.parse(stored);
      Object.entries(drivers).forEach(([driverId, driverData]: [string, any]) => {
        mockDrivers.set(driverId, driverData);
      });
    } else {
      // Initialize with sample drivers for testing
      const sampleDrivers = {
        'DRV001': { driverId: 'DRV001', password: 'driver123', name: 'John Driver', vehicleNumber: 'MH-12-AB-1234', routeId: '42B' },
        'DRV002': { driverId: 'DRV002', password: 'driver123', name: 'Jane Driver', vehicleNumber: 'MH-12-CD-5678', routeId: '101' },
      };
      Object.entries(sampleDrivers).forEach(([driverId, driverData]) => {
        mockDrivers.set(driverId, driverData);
      });
      saveMockDrivers();
    }
  } catch {
    // Ignore parse errors
  }
};

// Save mock drivers to localStorage
const saveMockDrivers = (): void => {
  try {
    const drivers: Record<string, { driverId: string; password: string; name?: string; vehicleNumber?: string; routeId?: string }> = {};
    mockDrivers.forEach((driverData, driverId) => {
      drivers[driverId] = driverData;
    });
    localStorage.setItem(MOCK_DRIVERS_STORAGE_KEY, JSON.stringify(drivers));
  } catch {
    // Ignore storage errors
  }
};

// Initialize mock drivers on load
if (typeof window !== 'undefined') {
  loadMockDrivers();
}

export const driverAuthService = {
  // Sign in with Driver ID and password
  async signIn(driverId: string, password: string): Promise<{ success: boolean; driver?: Driver; error?: string }> {
    try {
      const normalizedDriverId = driverId.toUpperCase().trim();
      const stored = mockDrivers.get(normalizedDriverId);
      
      if (!stored || stored.password !== password) {
        return { success: false, error: 'Invalid Driver ID or password' };
      }
      
      // Find or create driver session
      let driver: Driver | undefined;
      for (const [id, d] of mockDriverSessions.entries()) {
        if (d.driverId === normalizedDriverId) {
          driver = d;
          break;
        }
      }
      
      if (!driver) {
        driver = {
          driverId: normalizedDriverId,
          name: stored.name,
          vehicleNumber: stored.vehicleNumber,
          routeId: stored.routeId
        };
        mockDriverSessions.set(normalizedDriverId, driver);
      }
      
      localStorage.setItem('driver_auth_user', JSON.stringify(driver));
      return { success: true, driver };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to sign in' 
      };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      localStorage.removeItem('driver_auth_user');
      mockDriverSessions.clear();
    } catch (error) {
      console.error('Driver sign out error:', error);
      localStorage.removeItem('driver_auth_user');
      mockDriverSessions.clear();
    }
  },

  // Get current driver
  getCurrentDriver(): Driver | null {
    try {
      const stored = localStorage.getItem('driver_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  },

  // Register a new driver (for admin use)
  async registerDriver(
    driverId: string,
    password: string,
    name?: string,
    vehicleNumber?: string,
    routeId?: string
  ): Promise<{ success: boolean; driver?: Driver; error?: string }> {
    try {
      const normalizedDriverId = driverId.toUpperCase().trim();
      
      if (mockDrivers.has(normalizedDriverId)) {
        return { success: false, error: 'Driver ID already exists' };
      }
      
      mockDrivers.set(normalizedDriverId, {
        driverId: normalizedDriverId,
        password,
        name,
        vehicleNumber,
        routeId
      });
      saveMockDrivers();
      
      const driver: Driver = {
        driverId: normalizedDriverId,
        name,
        vehicleNumber,
        routeId
      };
      
      return { success: true, driver };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to register driver' 
      };
    }
  }
};


