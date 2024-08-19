// src/hooks/useSEO.js
import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords, canonicalUrl, ogType, jsonLd, ogImage, twitterImage }) => {
  useEffect(() => {
    const defaultTitle = 'Anime Shadows';
    document.title = title || defaultTitle;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: ogType || 'website' },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: twitterImage },
      { name: 'author', content: 'Anime Shadows' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ];

    const existingMetaTags = document.querySelectorAll('meta[name], meta[property]');
    existingMetaTags.forEach(tag => tag.remove());

    metaTags.forEach(({ name, property, content }) => {
      if (content) {
        const element = document.createElement('meta');
        if (name) {
          element.setAttribute('name', name);
        } else {
          element.setAttribute('property', property);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    });

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonicalUrl);
      document.head.appendChild(linkCanonical);
    }

    return () => {
      metaTags.forEach(({ name, property }) => {
        const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
        const element = document.querySelector(selector);
        if (element) {
          document.head.removeChild(element);
        }
      });
      if (linkCanonical) {
        document.head.removeChild(linkCanonical);
      }
    };
  }, [title, description, keywords, canonicalUrl, ogType, ogImage, twitterImage]);

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
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: twitterImage },
        { name: 'author', content: 'Anime Shadows' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl },
      ],
    },
    jsonLd,
  };
};