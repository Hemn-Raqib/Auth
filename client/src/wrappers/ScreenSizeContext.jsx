import React, { createContext, useContext, useState, useLayoutEffect } from 'react';

const ScreenSizeContext = createContext();

export const useScreenSize = () => useContext(ScreenSizeContext);

export const ScreenSizeProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState('large');

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('small');
      } else if (window.innerWidth < 1024) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();

    // Use requestAnimationFrame to ensure the resize event is handled efficiently
    let resizeTimer;
    const handleResizeDebounced = () => {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(handleResize);
    };

    window.addEventListener('resize', handleResizeDebounced);
    return () => window.removeEventListener('resize', handleResizeDebounced);
  }, []);

  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
};