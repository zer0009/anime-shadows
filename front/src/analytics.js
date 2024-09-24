import ReactGA from "react-ga4";

export const initGA = (measurementId) => {

  ReactGA.initialize(measurementId, {
    gaOptions: {
      siteSpeedSampleRate: 100
    },
    gtagOptions: {
      send_page_view: false
    }
  });

  // Use pagehide event instead of unload
  window.addEventListener('pagehide', () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  });

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  });
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

export const setConsent = (consent) => {
  ReactGA.gtag('consent', 'update', {
    'analytics_storage': consent ? 'granted' : 'denied'
  });
};