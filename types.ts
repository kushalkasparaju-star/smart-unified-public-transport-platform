
export type Screen = 
  | 'home' 
  | 'tracking' 
  | 'routes' 
  | 'booking' 
  | 'safety' 
  | 'eco' 
  | 'driver' 
  | 'admin';

export interface TransportMode {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface RouteOption {
  id: string;
  modes: string[];
  duration: string;
  cost: number;
  ecoScore: number;
  label: string;
}

export interface ChartData {
  name: string;
  co2: number;
  trips: number;
}

// Driver-related types
export type VehicleStatus = 'on-time' | 'delayed' | 'breakdown';
export type CrowdLevel = 'low' | 'medium' | 'high' | 'overcrowded';

export interface VehicleStatusUpdate {
  routeId: string;
  vehicleNumber: string;
  status: VehicleStatus;
  delayReason?: string;
  timestamp: number;
  driverId: string;
}

export interface CrowdLevelUpdate {
  routeId: string;
  crowdLevel: CrowdLevel;
  timestamp: number;
  driverId: string;
}

export interface DriverStatusUpdate {
  id: string;
  routeId: string;
  vehicleNumber: string;
  vehicleStatus: VehicleStatus;
  delayReason?: string;
  crowdLevel: CrowdLevel;
  timestamp: number;
  driverId: string;
}
