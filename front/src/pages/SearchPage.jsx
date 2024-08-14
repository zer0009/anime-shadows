import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import ListDisplay from '../components/ListDisplay/ListDisplay.jsx';
import TagsModal from '../components/TagsModal/TagsModal.jsx';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import Navbar from '../components/Navbar/Navbar.jsx';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { HelmetProvider } from 'react-helmet-async';
import { JsonLd } from 'react-schemaorg';
import { useSEO } from '../hooks/useSEO';
import { useTranslation } from 'react-i18next';

const SearchPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const { searchResults, loading, error, handleSearch, totalPages, setCurrentPage, limit, setLimit } = useFetchAnimeList();
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedPopular, setSelectedPopular] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [broadMatches, setBroadMatches] = useState(false);

    useEffect(() => {
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, currentPage, limit);
    }, [currentPage, limit, handleSearch]);

    const handleTagsApply = useCallback((tags, broadMatches) => {
        setSelectedTags(tags);
        setBroadMatches(broadMatches);
        handleSearch('', tags, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit);
    }, [handleSearch, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, limit]);

    const handleTypeChange = useCallback((type) => {
        setSelectedType(type);
        handleSearch('', selectedTags, type, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit);
    }, [handleSearch, selectedTags, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, limit]);

    const handleSeasonChange = useCallback((season) => {
        setSelectedSeason(season);
        handleSearch('', selectedTags, selectedType, season, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit);
    }, [handleSearch, selectedTags, selectedType, selectedSort, selectedPopular, selectedState, broadMatches, limit]);

    const handleSortChange = useCallback((sort) => {
        setSelectedSort(sort);
        handleSearch('', selectedTags, selectedType, selectedSeason, sort, selectedPopular, selectedState, broadMatches, 1, limit);
    }, [handleSearch, selectedTags, selectedType, selectedSeason, selectedPopular, selectedState, broadMatches, limit]);

    const handlePopularChange = useCallback((popular) => {
        setSelectedPopular(popular);
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, popular, selectedState, broadMatches, 1, limit);
    }, [handleSearch, selectedTags, selectedType, selectedSeason, selectedSort, selectedState, broadMatches, limit]);

    const handleStateChange = useCallback((state) => {
        setSelectedState(state);
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, state, broadMatches, 1, limit);
    }, [handleSearch, selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, broadMatches, limit]);

    const handleReset = useCallback(() => {
        setSelectedTags([]);
        setSelectedType('');
        setSelectedSeason('');
        setSelectedSort('');
        setSelectedPopular('');
        setBroadMatches(false);
        setSelectedState('');
        handleSearch('', [], '', '', '', '', '', false, 1, limit);
    }, [handleSearch, limit]);

    const handlePageChange = useCallback((page) => {
        setSearchParams({ page });
    }, [setSearchParams]);

    const seoProps = {
        title: t('searchPage.title', 'نتائج البحث | أنمي شادوز - Anime Shadows'),
        description: t('searchPage.description', 'استعرض نتائج البحث على أنمي شادوز (Anime Shadows).'),
        keywords: t('searchPage.keywords', 'نتائج البحث, أنمي, مشاهدة أنمي اون لاين, Anime Shadows'),
        canonicalUrl: `https://animeshadows.xyz/search?page=${currentPage}`,
        ogType: "website",
        ogImage: "https://animeshadows.xyz/default-og-image.jpg", // Add a default OG image
        twitterImage: "https://animeshadows.xyz/default-twitter-image.jpg", // Add a default Twitter image
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "name": t('searchPage.title', 'نتائج البحث | أنمي شادوز - Anime Shadows'),
            "description": t('searchPage.description', 'استعرض نتائج البحث على أنمي شادوز (Anime Shadows).'),
            "url": `https://animeshadows.xyz/search?page=${currentPage}`,
            "inLanguage": "ar",
            "isPartOf": {
                "@type": "WebSite",
                "name": "Anime Shadows",
                "alternateName": "أنمي شادوز",
                "url": "https://animeshadows.xyz"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": `https://animeshadows.xyz/search?page=${currentPage}`
            }
        }
    };

    useSEO(seoProps);

    return (
        <HelmetProvider>
            <Container maxWidth="lg">
                <Navbar
                    onTagsClick={() => setIsTagsModalOpen(true)}
                    onTypeChange={handleTypeChange}
                    onSeasonChange={handleSeasonChange}
                    onSortChange={handleSortChange}
                    onPopularChange={handlePopularChange}
                    onReset={handleReset}
                    onStateChange={handleStateChange}
                    onSearch={(query) => handleSearch(query, selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit)}
                />
                <Box my={4}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <ListDisplay
                        title="Search Results"
                        list={searchResults}
                        loading={loading}
                        error={error}
                        fields={{ onClick: (id) => console.log(`Clicked on anime with id: ${id}`) }}
                    />
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Box>
                <TagsModal
                    open={isTagsModalOpen}
                    onClose={() => setIsTagsModalOpen(false)}
                    onApply={handleTagsApply}
                />
            </Container>
        </HelmetProvider>
    );
};

export default SearchPage;