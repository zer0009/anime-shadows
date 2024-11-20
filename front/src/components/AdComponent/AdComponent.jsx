import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdComponent.module.css';

const AdComponent = ({ 
    adKey,
    format = 'banner',
    showAd = true,
    width,
    height
}) => {
    const adRef = useRef(null);
    const [adError, setAdError] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!showAd || adError) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        if (adRef.current) {
            observer.observe(adRef.current);
        }

        return () => {
            if (adRef.current) {
                observer.unobserve(adRef.current);
            }
        };
    }, [showAd, adError]);

    useEffect(() => {
        if (!isInView || !adRef.current || adError) return;

        // Clear any existing content
        adRef.current.innerHTML = '';

        try {
            // Create atOptions if needed for iframe ads
            if (format === 'iframe') {
                window.atOptions = {
                    'key': adKey,
                    'format': format,
                    'height': height,
                    'width': width,
                    'params': {}
                };
            }

            // Create and append the script with error handling
            const script = document.createElement('script');
            script.type = 'text/javascript';

            // Error handling for script loading
            script.onerror = () => {
                setAdError(true);
                if (adRef.current) {
                    adRef.current.style.display = 'none';
                }
            };

            // Set the appropriate script source based on the ad type
            switch (adKey) {
                case 'popunder':
                    script.src = '//pl24945279.profitablecpmrate.com/a9/7d/10/a97d10481db6c113afadffc636b8e9df.js';
                    break;
                case 'social-bar':
                    script.src = '//pl24955350.profitablecpmrate.com/27/bd/52/27bd52e99d1acbc711870e3e81c9d875.js';
                    break;
                default:
                    script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
                    break;
            }

            // Set a timeout to remove failed ads
            const timeoutId = setTimeout(() => {
                if (adRef.current && !adRef.current.querySelector('iframe')) {
                    setAdError(true);
                    adRef.current.style.display = 'none';
                }
            }, 5000); // 5 second timeout

            adRef.current.appendChild(script);

            return () => {
                clearTimeout(timeoutId);
                if (adRef.current) {
                    adRef.current.innerHTML = '';
                }
            };
        } catch (error) {
            setAdError(true);
        }
    }, [isInView, adKey, format, showAd, width, height, adError]);

    // Don't render anything if there's an error or we shouldn't show the ad
    if (!showAd || adError) return null;

    return (
        <div 
            ref={adRef}
            className={styles.adContainer}
            style={{
                width: width || '100%',
                height: height || 'auto',
                minHeight: height || '100px',
                display: adError ? 'none' : 'block'
            }}
        />
    );
};

AdComponent.propTypes = {
    adKey: PropTypes.string.isRequired,
    format: PropTypes.string,
    showAd: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default React.memo(AdComponent);