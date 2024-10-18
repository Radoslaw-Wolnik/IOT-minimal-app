import React, { useState, useEffect } from 'react';
import { isFirstRun } from '../utils/api';
import AdminPasswordChange from './AdminPasswordChange';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const checkFirstRun = async () => {
      try {
        const { isFirstRun: firstRun } = await isFirstRun();
        setIsFirstTime(firstRun);
      } catch (error) {
        console.error('Error checking first run status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkFirstRun();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFirstTime) {
    return <AdminPasswordChange onPasswordChanged={() => setIsFirstTime(false)} />;
  }

  return <>{children}</>;
};

export default AppInitializer;