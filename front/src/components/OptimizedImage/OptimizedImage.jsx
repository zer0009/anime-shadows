import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './OptimizedImage.module.css';

const OptimizedImage = ({ avif, webp, jpg, alt, ...props }) => {
    return (
        <picture className={styles.lazyImageWrapper}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <LazyLoadImage
                src={jpg}
                alt={alt}
                effect="blur"
                threshold={300}
                wrapperClassName={styles.lazyImageWrapper}
                {...props}
            />
        </picture>
    );
};

export default OptimizedImage;