import React, { useState, useEffect } from 'react';
import useFetchAnimeList from '../hooks/useFetchAnimeList';
import ListDisplay from '../components/ListDisplay/ListDisplay';
import PaginationComponent from '../components/Pagination/PaginationComponent';
import { getCurrentSeason } from '../utils/getCurrentSeason';

const SeasonAnime = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { animeList, loading, error, totalPages, handleSearch } = useFetchAnimeList();
  const currentSeason = getCurrentSeason();

  useEffect(() => {
    handleSearch('', [], '', currentSeason, '', '', '', false, currentPage);
  }, [currentPage, currentSeason]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter the anime list to include only items from the current season
  const seasonAnimeList = animeList.filter(anime => anime.season && anime.season.name.toLowerCase() === currentSeason.toLowerCase());

  return (
    <div>
      <ListDisplay
        title={`${currentSeason} Anime`}
        list={seasonAnimeList}
        loading={loading}
        error={error}
        fields={['title', 'genre', 'rating']}
      />
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SeasonAnime;