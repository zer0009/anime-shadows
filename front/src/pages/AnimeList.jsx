import React, { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard.jsx';
import axios from 'axios';

const AnimeList = () => {
    const [animeList, setAnimeList] = useState([]);

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/anime');
                setAnimeList(response.data);
            } catch (error) {
                console.error('Error fetching animes:', error);
            }
        };

        fetchAnimes();
    }, []);

    return (
        <div className="anime-list">
            {animeList.map(anime => (
                <AnimeCard key={anime._id} anime={anime} />
            ))}
        </div>
    );
};

export default AnimeList;
