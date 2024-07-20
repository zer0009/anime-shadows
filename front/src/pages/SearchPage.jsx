import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard/AnimeCard.jsx';
import TagsModal from '../components/TagsModal/TagsModal.jsx';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import Navbar from '../components/Navbar/Navbar.jsx';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import styles from './SearchPage.module.css';

const SearchPage = () => {
    const { searchResults, loading, error, handleSearch, totalPages, currentPage, setCurrentPage, limit, setLimit } = useFetchAnimeList();
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
    }, [currentPage, limit]);

    const handleTagsApply = (tags, broadMatches) => {
        setSelectedTags(tags);
        setBroadMatches(broadMatches);
        handleSearch('', tags, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        handleSearch('', selectedTags, type, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit);
    };

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
        handleSearch('', selectedTags, selectedType, season, selectedSort, selectedPopular, selectedState, broadMatches, 1, limit);
    };

    const handleSortChange = (sort) => {
        setSelectedSort(sort);
        handleSearch('', selectedTags, selectedType, selectedSeason, sort, selectedPopular, selectedState, broadMatches, 1, limit);
    };

    const handlePopularChange = (popular) => {
        setSelectedPopular(popular);
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, popular, selectedState, broadMatches, 1, limit);
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, state, broadMatches, 1, limit);
    };

    const handleReset = () => {
        setSelectedTags([]);
        setSelectedType('');
        setSelectedSeason('');
        setSelectedSort('');
        setSelectedPopular('');
        setBroadMatches(false);
        setSelectedState('');
        handleSearch('', [], '', '', '', '', '', false, 1, limit);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    console.log('searchResults:', searchResults);

    return (
        <div className={styles.searchPage}>
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
            {loading && <div className={styles.loading}>Loading...</div>}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.animeCards}>
                {searchResults.length > 0 ? (
                    searchResults.map(anime => (
                        <AnimeCard key={anime._id} anime={anime} />
                    ))
                ) : (
                    <div className={styles.noResults}>No anime found</div>
                )}
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <TagsModal
                open={isTagsModalOpen}
                onClose={() => setIsTagsModalOpen(false)}
                onApply={handleTagsApply}
            />
        </div>
    );
};

export default SearchPage;