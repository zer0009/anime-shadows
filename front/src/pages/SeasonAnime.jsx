import React from 'react';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import { getCurrentSeason } from '../utils/getCurrentSeason';

const SeasonAnime = () => {
    const { animeList, loading, error } = useFetchAnimeList();
    const currentSeason = getCurrentSeason();

    // Filter the anime list to include only items from the current season
    const seasonAnimeList = animeList.filter(anime => anime.season && anime.season.name.toLowerCase() === currentSeason.toLowerCase());

    return (
        <ListDisplay
            title={`${currentSeason} Anime`}
            list={seasonAnimeList}
            loading={loading}
            error={error}
            fields={['title', 'genre', 'rating']}
        />
    );
};

export default SeasonAnime;
