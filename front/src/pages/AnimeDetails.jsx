import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnimeDetails } from '../api/modules/anime'; // Correctly import fetchAnimeDetails
import { saveAnimeToHistory } from '../api/modules/user';
import './AnimeDetails.css';

const AnimeDetails = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        const getAnimeDetails = async () => {
            try {
                const response = await fetchAnimeDetails(id);
                setAnime(response.data);
                // Save the anime to the user's history if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    await saveAnimeToHistory(id);
                }
            } catch (error) {
                console.error('Error fetching anime details or saving to history:', error);
            }
        };

        getAnimeDetails();
    }, [id]);

    if (!anime) {
        return <div>Loading...</div>;
    }

    return (
        <div className="anime-details-page">
            <div className="anime-header">
                <h1 className="anime-title">{anime.title}</h1>
                <p className="anime-subtitle">{anime.subtitle}</p>
                <div className="anime-rating">
                    <div className="rating-stars">
                        {/* Render stars based on rating */}
                        {[...Array(5)].map((star, index) => (
                            <i key={index} className={`fas fa-star ${index < anime.rating ? 'filled' : ''}`}></i>
                        ))}
                    </div>
                    <div className="rating-score">{anime.rating}</div>
                    <div className="rating-users">{anime.ratingUsers} مستخدم</div>
                </div>
            </div>
            <div className="anime-content">
                <div className="anime-episodes">
                    <h2>قائمة الحلقات</h2>
                    <ul>
                        {anime.episodes.map(episode => (
                            <li key={episode._id} className="episode-item" onClick={() => openModal(episode)}>
                                <div className="episode-play-icon">▶</div>
                                <div className="episode-info">
                                    <h3>{episode.title}</h3>
                                    <p>{anime.title}</p>
                                </div>
                                <img src={`http://localhost:5000${anime.pictureUrl}`} alt={episode.title} className="episode-thumbnail" />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="anime-sidebar">
                    <img src={`http://localhost:5000${anime.pictureUrl}`} alt={anime.title} className="anime-image" />
                    <div className="anime-meta">
                        <button className="watch-now-button">يعرض الآن</button>
                        <button className="mal-button">MAL صفحة</button>
                        <button className="trailer-button">العرض التشويقي</button>
                        <p><strong>النوع:</strong> {anime.type ? anime.type.name : 'N/A'}</p>
                        <p><strong>سنة العرض:</strong> {anime.startDate ? anime.startDate : 'N/A'}</p>
                        <p><strong>الموسم:</strong> {anime.season ? anime.season.name : 'N/A'}</p>
                        <p><strong>المصدر:</strong> {anime.source ? anime.source : 'N/A'}</p>
                        <p><strong>الأستوديو:</strong> {anime.studio ? anime.studio : 'N/A'}</p>
                        <p><strong>مدة الحلقة:</strong> {anime.episodeDuration ? `${anime.episodeDuration} دقيقة` : 'N/A'}</p>
                        <p><strong>التصنيف:</strong> {anime.rating ? anime.rating : 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Modal for episode details */}
            {/* <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Episode Details"
                className="modal"
                overlayClassName="overlay"
            >
                {selectedEpisode && (
                    <div className="modal-content">
                        <h2>{selectedEpisode.title}</h2>
                        <p>Server Details: {selectedEpisode.serverDetails}</p>
                        <p>URL: <a href={selectedEpisode.url} target="_blank" rel="noopener noreferrer">{selectedEpisode.url}</a></p>
                        <button onClick={closeModal} className="close-modal-button">Close</button>
                    </div>
                )}
            </Modal> */}
        </div>
    );
};

export default AnimeDetails;
