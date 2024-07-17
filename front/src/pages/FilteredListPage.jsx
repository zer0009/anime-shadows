import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import { fetchGenre, fetchTypes, fetchSeasons } from '../api/modules/anime'; // Import functions to fetch relevant data

const FilteredListPage = () => {
    const { filterType, filterValue } = useParams();
    const { animeList, loading, error } = useFetchAnimeList();
    const [filteredList, setFilteredList] = useState([]);
    const [filterName, setFilterName] = useState('');

    const fetchData = useCallback(async () => {
        let name = filterValue;

        switch (filterType) {
            case 'type':
                const types = await fetchTypes();
                const type = types.find(t => t._id === filterValue);
                name = type ? type.name : filterValue;
                break;
            case 'genre':
                const genres = await fetchGenre();
                const genre = genres.find(g => g._id === filterValue);
                name = genre ? genre.name : filterValue;
                break;
            case 'season':
                const seasons = await fetchSeasons();
                const season = seasons.find(s => s._id === filterValue);
                name = season ? season.name : filterValue;
                break;
            case 'state':
                const states = [
                    { _id: 'ongoing', name: 'Ongoing' },
                    { _id: 'completed', name: 'Completed' },
                    { _id: 'upcoming', name: 'Upcoming' },
                ];
                const state = states.find(s => s._id === filterValue);
                name = state ? state.name : filterValue;
                break;
            default:
                name = filterValue;
        }

        setFilterName(name);
    }, [filterType, filterValue]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let filtered = animeList;

        switch (filterType) {
            case 'type':
                filtered = animeList.filter(anime => anime.type && anime.type._id === filterValue);
                break;
            case 'genre':
                filtered = animeList.filter(anime => anime.genres && anime.genres.some(genre => genre._id === filterValue));
                break;
            case 'season':
                filtered = animeList.filter(anime => anime.season && anime.season._id === filterValue);
                break;
            case 'state':
                filtered = animeList.filter(anime => anime.status && anime.status.toLowerCase() === filterValue.toLowerCase());
                break;
            default:
                filtered = animeList;
        }

        setFilteredList(filtered);
    }, [filterType, filterValue, animeList]);

    return (
        <ListDisplay
            title={`${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${filterName}`}
            list={filteredList}
            loading={loading}
            error={error}
            fields={['title', 'genre', 'rating']}
        />
    );
};

export default FilteredListPage;