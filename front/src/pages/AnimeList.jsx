import React from 'react';
import useFetchAnimes from '../hooks/useFetchAnimes';
import ListDisplay from '../components/ListDisplay/ListDisplay';

const AnimeList = () => {
    const { animeList, loading, error } = useFetchAnimes();

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