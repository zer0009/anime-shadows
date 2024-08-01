import React from 'react';
import useLazyLoad from '../hooks/useLazyLoad';

const OptimizedImage = ({ webp, jpg, alt, ...props }) => {
  const [ref, isIntersecting] = useLazyLoad();

  return (
    <picture ref={ref}>
      {isIntersecting && (
        <>
          <source srcSet={webp} type="image/webp" />
          <img src={jpg} alt={alt} loading="lazy" {...props} />
        </>
      )}
    </picture>
  );
};

export default OptimizedImage;