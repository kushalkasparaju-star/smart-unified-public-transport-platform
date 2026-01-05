import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { driverAuthService, Driver } from './driverAuthService';

interface DriverAuthContextType {
  driver: Driver | null;
  loading: boolean;
  signIn: (driverId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const DriverAuthContext = createContext<DriverAuthContextType | undefined>(undefined);

export const useDriverAuth = (): DriverAuthContextType => {
  const context = useContext(DriverAuthContext);
  if (!context) {
    throw new Error('useDriverAuth must be used within a DriverAuthProvider');
  }
  return context;
};

interface DriverAuthProviderProps {
  children: ReactNode;
}

export const DriverAuthProvider: React.FC<DriverAuthProviderProps> = ({ children }) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing driver session
    const currentDriver = driverAuthService.getCurrentDriver();
    setDriver(currentDriver);
    setLoading(false);
  }, []);

  const signIn = async (driverId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await driverAuthService.signIn(driverId, password);
    if (result.success && result.driver) {
      setDriver(result.driver);
      return { success: true };
    }
    return { success: false, error: result.error || 'Invalid Driver ID or password' };
  };

  const signOut = async (): Promise<void> => {
    await driverAuthService.signOut();
    setDriver(null);
  };

  return (
    <DriverAuthContext.Provider value={{ driver, loading, signIn, signOut }}>
      {children}
    </DriverAuthContext.Provider>
  );
};


