import React from 'react';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';

const MovieList = () => {
    const { animeList, loading, error } = useFetchAnimeList();

    // Filter the anime list to include only movies
    const movieList = animeList.filter(anime => anime.type && anime.type.name.toLowerCase() === 'movie');

    return (
        <ListDisplay
            title="Movie List"
            list={movieList}
            loading={loading}
            error={error}
            fields={['title', 'genre', 'rating']}
        />
    );
};

export default MovieList;