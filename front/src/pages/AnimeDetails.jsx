import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnimeById } from '../api/modules/anime';
import { saveAnimeToHistory } from '../api/modules/user';
import styles from './AnimeDetails.module.css';

const AnimeDetails = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);

    useEffect(() => {
        const getAnimeDetails = async () => {
            try {
                const response = await fetchAnimeById(id);
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
        <div className={styles.animeDetailsPage}>
            <div className={styles.animeHeader}>
                <h1 className={styles.animeTitle}>{anime.title}</h1>
                <p className={styles.animeSubtitle}>{anime.subtitle}</p>
                <div className={styles.animeRating}>
                    <div className={styles.ratingStars}>
                        {/* Render stars based on rating */}
                        {[...Array(5)].map((star, index) => (
                            <i key={index} className={`fas fa-star ${index < anime.rating ? 'filled' : ''}`}></i>
                        ))}
                    </div>
                    <div className={styles.ratingScore}>{anime.rating}</div>
                    <div className={styles.ratingUsers}>{anime.ratingUsers} مستخدم</div>
                </div>
            </div>
            <div className={styles.animeContent}>
                <div className={styles.animeEpisodes}>
                    <h2>قائمة الحلقات</h2>
                    <ul>
                        {anime.episodes.map(episode => (
                            <li key={episode._id} className={styles.episodeItem} onClick={() => openModal(episode)}>
                                <div className={styles.episodePlayIcon}>▶</div>
                                <div className={styles.episodeInfo}>
                                    <h3>{episode.title}</h3>
                                    <p>{anime.title}</p>
                                </div>
                                <img src={`http://localhost:5000${anime.pictureUrl}`} alt={episode.title} className={styles.episodeThumbnail} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.animeSidebar}>
                    <img src={`http://localhost:5000${anime.pictureUrl}`} alt={anime.title} className={styles.animeImage} />
                    <div className={styles.animeMeta}>
                        <button className={styles.watchNowButton}>يعرض الآن</button>
                        <button className={styles.malButton}>MAL صفحة</button>
                        <button className={styles.trailerButton}>العرض التشويقي</button>
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
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                {selectedEpisode && (
                    <div className="modal-content">
                        <h2>{selectedEpisode.title}</h2>
                        <p>Server Details: {selectedEpisode.serverDetails}</p>
                        <p>URL: <a href={selectedEpisode.url} target="_blank" rel="noopener noreferrer">{selectedEpisode.url}</a></p>
                        <button onClick={closeModal} className={styles.closeModalButton}>Close</button>
                    </div>
                )}
            </Modal> */}
        </div>
    );
};

export default AnimeDetails;
