// src/hooks/useSEO.js
import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords, canonicalUrl, ogType, jsonLd }) => {
  useEffect(() => {
  }, [title, description, canonicalUrl]);

  return {
    helmet: {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: ogType || 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl },
      ],
    },
    jsonLd,
  };
};