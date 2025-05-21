import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const NavigationLogger = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // PUSH, POP, or REPLACE

  useEffect(() => {
    // console.log(`[NAVIGATION] ${navigationType} to ${location.pathname}${location.search}`);
  }, [location, navigationType]);

  return null;
};