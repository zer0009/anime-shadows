import React, { useState } from 'react';
import AnimeCard from '../components/AnimeCard/AnimeCard.jsx';
import TagsModal from '../components/TagsModal/TagsModal.jsx';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import Navbar from '../components/Navbar/Navbar.jsx';
import styles from './SearchPage.module.css';

const SearchPage = () => {
    const { animeList, searchResults, loading, error, handleSearch } = useFetchAnimeList();
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedPopular, setSelectedPopular] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [broadMatches, setBroadMatches] = useState(false);

    const handleTagsApply = (tags, broadMatches) => {
        setSelectedTags(tags);
        setBroadMatches(broadMatches);
        console.log('Applying tags:', tags, 'Broad matches:', broadMatches);
        handleSearch('', tags, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches); // Re-run the search with the new filters
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        console.log('Applying type:', type);
        handleSearch('', selectedTags, type, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches); // Re-run the search with the new filters
    };

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
        console.log('Applying season:', season);
        handleSearch('', selectedTags, selectedType, season, selectedSort, selectedPopular, selectedState, broadMatches); // Re-run the search with the new filters
    };

    const handleSortChange = (sort) => {
        setSelectedSort(sort);
        console.log('Applying sort:', sort);
        handleSearch('', selectedTags, selectedType, selectedSeason, sort, selectedPopular, selectedState, broadMatches); // Re-run the search with the new filters
    };

    const handlePopularChange = (popular) => {
        setSelectedPopular(popular);
        console.log('Applying popular:', popular);
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, popular, selectedState, broadMatches); // Re-run the search with the new filters
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
        console.log('Applying state:', state);
        handleSearch('', selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, state, broadMatches); // Re-run the search with the new filters
    };

    const handleReset = () => {
        setSelectedTags([]);
        setSelectedType('');
        setSelectedSeason('');
        setSelectedSort('');
        setSelectedPopular('');
        setBroadMatches(false);
        setSelectedState('');
        handleSearch('');
    };

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
                onSearch={(query) => handleSearch(query, selectedTags, selectedType, selectedSeason, selectedSort, selectedPopular, selectedState, broadMatches)}
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
            <TagsModal
                open={isTagsModalOpen}
                onClose={() => setIsTagsModalOpen(false)}
                onApply={handleTagsApply}
            />
        </div>
    );
};

export default SearchPage;