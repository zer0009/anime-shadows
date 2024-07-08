import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard.jsx';
import './SearchResults.css';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/anime/search?q=${query}`);
                setResults(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching search results: {error.message}</div>;
    }

    return (
        <div className="search-results-container">
            <h2>Search Results for "{query}"</h2>
            <div className="anime-cards-container">
                {results.map((anime) => (
                    <AnimeCard key={anime._id} anime={anime} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;