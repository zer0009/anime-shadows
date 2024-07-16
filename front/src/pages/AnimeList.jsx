import React from 'react';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';

const AnimeList = () => {
    const { animeList, loading, error } = useFetchAnimeList();

    return (
        <ListDisplay
            title="Anime List"
            list={animeList}
            loading={loading}
            error={error}
            fields={['title', 'genre', 'rating']}
        />
    );
};

export default AnimeList;