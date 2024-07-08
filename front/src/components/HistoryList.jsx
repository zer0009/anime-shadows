import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnimeById } from '../api/modules/anime'; // Ensure you have this function

const HistoryList = ({ history }) => {
    const navigate = useNavigate();
    const [selectedAnime, setSelectedAnime] = useState(null);

    const handleAnimeClick = async (animeId) => {
        try {
            const response = await fetchAnimeById(animeId);
            setSelectedAnime(response.data);
            navigate(`/anime/${animeId}`);
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    };

    useEffect(() => {
        if (selectedAnime) {
            console.log('Selected Anime:', selectedAnime);
        }
    }, [selectedAnime]);

    return (
        <div className="history-list">
            {history.map(item => (
                <div key={item._id} className="history-item" onClick={() => handleAnimeClick(item.anime)}>
                    <img src={item.pictureUrl} alt="Anime" className="history-item-image" />
                    <div className="history-item-details">
                        <h3>{item.title}</h3>
                        <p>{item.pictureUrl}</p>
                        <p>Last viewed: {new Date(item.views[item.views.length - 1]).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryList;