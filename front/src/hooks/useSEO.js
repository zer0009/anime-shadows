// src/hooks/useSEO.js
import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords, canonicalUrl, ogType, jsonLd, ogImage, twitterImage }) => {
  useEffect(() => {
    document.title = title;

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

    metaTags.forEach(({ name, property, content }) => {
      let element = document.querySelector(`meta[${name ? 'name' : 'property'}="${name || property}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
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