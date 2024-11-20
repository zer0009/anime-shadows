import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './OptimizedImage.module.css';

const OptimizedImage = ({ avif, webp, jpg, alt, loading = 'lazy', crossorigin, ...props }) => {
    // If loading is 'eager', use a regular img tag instead of LazyLoadImage
    if (loading === 'eager') {
        return (
            <picture className={styles.lazyImageWrapper}>
                {avif && <source srcSet={avif} type="image/avif" />}
                {webp && <source srcSet={webp} type="image/webp" />}
                <img src={jpg} alt={alt} className={styles.lazyImage} loading="eager" crossorigin={crossorigin} {...props} />
            </picture>
        );
    }

    // Default to lazy loading
    return (
        <picture className={styles.lazyImageWrapper}>
            {avif && <source srcSet={avif} type="image/avif" />}
            {webp && <source srcSet={webp} type="image/webp" />}
            <LazyLoadImage
                src={jpg}
                alt={alt}
                effect="blur"
                threshold={300}
                wrapperClassName={styles.lazyImageWrapper}
                loading={loading}
                {...props}
            />
        </picture>
    );
};

export default OptimizedImage;