import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchPage.css';
import { FaTags, FaBuilding, FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import AnimeCard from '../components/AnimeCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import TagsModal from '../components/TagsModal.jsx';

const SearchPage = () => {
    const [animeList, setAnimeList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [broadMatches, setBroadMatches] = useState(false);

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/anime');
                setAnimeList(response.data);
            } catch (error) {
                console.error('Error fetching anime list:', error);
            }
        };

        fetchAnimeList();
    }, []);

    const handleSearch = async (query) => {
        try {
            const params = {};
            if (query) params.q = query;
            if (selectedTags.length > 0) params.tags = selectedTags.join(',');
            if (broadMatches) params.broadMatches = broadMatches;

            const url = new URL('http://localhost:5000/api/anime/search');
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            console.log('Search URL:', url.toString());

            const response = await axios.get(url.toString());
            setAnimeList(response.data);
        } catch (error) {
            console.error('Error searching anime:', error);
        }
    };

    const handleTagsApply = (tags, broadMatches) => {
        setSelectedTags(tags);
        setBroadMatches(broadMatches);
        handleSearch(searchQuery); // Re-run the search with the new filters
    };

    return (
        <div className="search-page">
            <div className="search-navbar">
                <button className="nav-button" onClick={() => { setIsTagsModalOpen(true); console.log('Opening modal'); }}>
                    <FaTags /> Tags
                </button>
                <button className="nav-button">
                    <FaBuilding /> Brands
                </button>
                <button className="nav-button">
                    <FaFilter /> Blacklist
                </button>
                <button className="nav-button">
                    <FaSort /> Sort
                </button>
                <button className="nav-button" onClick={() => { setSelectedTags([]); setBroadMatches(false); setSearchQuery(''); handleSearch(''); }}>
                    Reset All
                </button>
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="anime-cards">
                {animeList.map(anime => (
                    <AnimeCard key={anime._id} anime={anime} />
                ))}
            </div>
            <TagsModal
                open={isTagsModalOpen}
                onClose={() => { setIsTagsModalOpen(false); console.log('Closing modal'); }}
                onApply={handleTagsApply}
            />
        </div>
    );
};

export default SearchPage;