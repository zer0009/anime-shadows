import ReactGA from "react-ga4";

let isInitialized = false;

export const initGA = async (measurementId) => {
  if (isInitialized) return;

  // Dynamically load the gtag script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize ReactGA after the script is loaded
  script.onload = () => {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
      gtagOptions: {
        send_page_view: false,
      },
    });

    // Event listeners
    window.addEventListener("pagehide", () => {
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
      }
    });

    isInitialized = true;
  };
};

export const logPageView = (path) => {
  if (isInitialized) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};

export const logEvent = (category, action, label) => {
  if (isInitialized) {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
    });
  }
};