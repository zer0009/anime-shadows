import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import styles from './AnimeList.module.css';

const AnimeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();

  useEffect(() => {
    handleSearch('', [], '', '', '', '', '', false, currentPage);
  }, [currentPage, handleSearch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams({ page });
  }, [setSearchParams]);

  const seoProps = {
    title: "قائمة الأنمي | أنمي شادوز - Anime Shadows",
    description: "تصفح مجموعتنا الواسعة من مسلسلات الأنمي على أنمي شادوز (Anime Shadows). اعثر على مسلسلك المفضل القادم.",
    keywords: "قائمة الأنمي, مسلسلات أنمي, مشاهدة أنمي اون لاين, Anime Shadows",
    canonicalUrl: `https://animeshadows.xyz/anime-list?page=${currentPage}`,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "قائمة الأنمي | أنمي شادوز - Anime Shadows",
      "description": "تصفح مجموعتنا الواسعة من مسلسلات الأنمي على أنمي شادوز (Anime Shadows). اعثر على مسلسلك المفضل القادم.",
      "url": `https://animeshadows.xyz/anime-list?page=${currentPage}`,
      "inLanguage": "ar",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Anime Shadows",
        "alternateName": "أنمي شادوز",
        "url": "https://animeshadows.xyz"
      }
    }
  };

  const seo = useSEO(seoProps);

  return (
    <Box sx={{ padding: '20px', backgroundColor: 'var(--primary-dark)', color: 'var(--text-color)' }}>
      <Helmet>
        {seo.helmet.title && <title>{seo.helmet.title}</title>}
        {seo.helmet.meta.map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
        {seo.helmet.link.map((link, index) => (
          <link key={index} {...link} />
        ))}
      </Helmet>
      {seo.jsonLd && <JsonLd item={seo.jsonLd} />}
      
      <ListDisplay
        title="Anime List"
        list={animeList}
        loading={loading}
        error={error}
        fields={['title', 'genre', 'rating']}
      />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default AnimeList;