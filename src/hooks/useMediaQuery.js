import { useState, useEffect } from 'react';

// Hook feito, no entanto, descontinuado por questões de performace

export function useMediaQuery(mediaQuery) {
  // Initialize with the default value for media query match status

  const [mediaQueryMatches, setMediaQueryMatches] = useState();

  useEffect(() => {
    const desktopBreakpoint = getComputedStyle(document.documentElement).getPropertyValue(mediaQuery);
    //console.log(getComputedStyle(document.documentElement).getPropertyValue(mediaQuery));

    // Function to check the media query match status
    const checkMediaQuery = () => {
      setMediaQueryMatches(window.matchMedia(`(min-width: ${desktopBreakpoint}px)`).matches); // Para funcionar as variáveis de css teriam de ser apenas valores numéricos e não strings com "px" nelas
      console.log(window.matchMedia(`(min-width: ${desktopBreakpoint}px)`).matches);
    };

    // Set initial media query match status
    checkMediaQuery();

    // Add event listener for changes to the media query
    const mediaQueryList = window.matchMedia(`(min-width: ${desktopBreakpoint}px)`); // Para funcionar as variáveis de css teriam de ser apenas valores numéricos e não strings com "px" nelas
    console.log(mediaQueryList);
    mediaQueryList.addEventListener('change', checkMediaQuery);

    // Cleanup the event listener on component unmount
    return () => mediaQueryList.removeEventListener('change', checkMediaQuery);
  }, []); // Depend on desktopBreakpoint to re-run when it changes

  return mediaQueryMatches;
}

/* export function useWindowDimensions() {
  // Initialize with default values
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Define the function to get window dimensions
    const getWindowDimensions = () => {
      if (typeof window !== 'undefined') {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      }
      return {
        width: 0,
        height: 0,
      };
    };

    // Set the initial dimensions
    setWindowDimensions(getWindowDimensions());

    // Define the resize event handler
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    // Add event listener for resize events
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
} */
