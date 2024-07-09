import { useState, useEffect } from 'react';
import { fetchAnime, searchAnime, fetchPopularAnime } from '../api/modules/anime';

const useFetchAnimeList = () => {
    const [animeList, setAnimeList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                const response = await fetchAnime();
                const data = Array.isArray(response.data) ? response.data : [];
                setAnimeList(data);
                setSearchResults(data); // Initialize search results with the full list
                console.log('Fetched anime list:', data);
            } catch (error) {
                setError('Error fetching anime list');
                console.error('Error fetching anime list:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimeList();
    }, []);

    const handleSearch = async (query = '', tags = [], type = '', season = '', sort = '', popular = '', broadMatches = false) => {
        try {
            setLoading(true);
            let results = animeList;

            console.log('Search query:', query);
            console.log('Selected tags:', tags);
            console.log('Selected type:', type);
            console.log('Selected season:', season);
            console.log('Selected sort:', sort);
            console.log('Selected popular:', popular);
            console.log('Broad matches:', broadMatches);

            if (query) {
                results = results.filter(anime =>
                    anime.title.toLowerCase().includes(query.toLowerCase())
                );
            }

            if (tags.length > 0) {
                results = results.filter(anime => {
                    if (!anime.genres) {
                        return false;
                    }
                    const animeTagNames = anime.genres.map(tag => tag.name.toLowerCase());
                    console.log('Anime tag names:', animeTagNames);
                    const tagMatch = broadMatches
                        ? tags.some(tag => animeTagNames.includes(tag.toLowerCase()))
                        : tags.every(tag => animeTagNames.includes(tag.toLowerCase()));
                    console.log(`Anime: ${anime.title}, Tag match: ${tagMatch}`);
                    return tagMatch;
                });
            }

            if (type) {
                results = results.filter(anime => anime.type && anime.type.name.toLowerCase() === type.toLowerCase());
            }

            if (season) {
                results = results.filter(anime => anime.season && anime.season.name.toLowerCase() === season.toLowerCase());
            }

            if (sort) {
                results = results.sort((a, b) => {
                    if (sort === 'title') {
                        return a.title.localeCompare(b.title);
                    } else if (sort === 'rating') {
                        return b.rating - a.rating;
                    } else if (sort === 'releaseDate') {
                        return new Date(b.releaseDate) - new Date(a.releaseDate);
                    }
                    return 0;
                });
            }

            if (popular) {
                const response = await fetchPopularAnime(popular);
                results = Array.isArray(response.data) ? response.data : [];
                console.log('Response data:', response.data);
            }
            console.log('Popular:', popular);

            console.log('Filtered results:', results);
            setSearchResults(results);
        } catch (error) {
            setError('Error searching anime');
            console.error('Error searching anime:', error);
        } finally {
            setLoading(false);
        }
    };

    return { animeList, searchResults, loading, error, handleSearch };
};

export default useFetchAnimeList;
