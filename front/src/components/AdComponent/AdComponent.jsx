import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AdComponent.module.css';

const AdComponent = ({ adKey, format, height, width, showAd }) => {
    useEffect(() => {
        if (!showAd) return;

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            atOptions = {
                'key' : '${adKey}',
                'format' : '${format}',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
            };
        `;
        const scriptSrc = document.createElement('script');
        scriptSrc.type = 'text/javascript';
        scriptSrc.src = `//www.topcreativeformat.com/${adKey}/invoke.js`;
        document.getElementById(`ad-container-${adKey}`).appendChild(script);
        document.getElementById(`ad-container-${adKey}`).appendChild(scriptSrc);
    }, [adKey, format, height, width, showAd]);

    if (!showAd) return null;

    return <div id={`ad-container-${adKey}`} className={styles.adContainer}></div>;
};

AdComponent.propTypes = {
    adKey: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    showAd: PropTypes.bool.isRequired,
};

export default AdComponent;