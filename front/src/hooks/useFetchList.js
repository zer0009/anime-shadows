import { useState, useEffect } from 'react';

const useFetchList = (fetchFunction, page = 1, limit = 10) => {
    const [list, setList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await fetchFunction(page, limit);
                const data = Array.isArray(response.items) ? response.items : [];
                setList(data);
                setSearchResults(data); // Initialize search results with the full list
                setTotalPages(response.totalPages);
            } catch (error) {
                setError('Error fetching list');
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [page, limit, fetchFunction]);

    const handleSearch = async (query = '', tags = [], type = '', season = '', sort = '', popular = '', state = '', broadMatches = false) => {
        try {
            setLoading(true);
            let results = list;

            if (query) {
                results = results.filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase())
                );
            }

            if (tags.length > 0) {
                results = results.filter(item => {
                    if (!item.genres) {
                        return false;
                    }
                    const itemTagNames = item.genres.map(tag => tag.name.toLowerCase());
                    return broadMatches
                        ? tags.some(tag => itemTagNames.includes(tag.toLowerCase()))
                        : tags.every(tag => itemTagNames.includes(tag.toLowerCase()));
                });
            }

            if (type) {
                results = results.filter(item => item.type && item.type.name.toLowerCase() === type.toLowerCase());
            }

            if (season) {
                results = results.filter(item => item.season && item.season.name.toLowerCase() === season.toLowerCase());
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
                const response = await fetchFunction(popular);
                results = Array.isArray(response) ? response : [];
            }

            if (state) {
                results = results.filter(item => item.status && item.status.toLowerCase() === state.toLowerCase());
            }

            setSearchResults(results);
        } catch (error) {
            setError('Error searching list');
        } finally {
            setLoading(false);
        }
    };

    return { list, searchResults, loading, error, handleSearch, totalPages };
};

export default useFetchList;