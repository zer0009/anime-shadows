import React from 'react';
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import AnimeCard from '../AnimeCard/AnimeCard';
import styles from './AnimeSection.module.css';

const AnimeSection = ({ title, items, loading, navigate, handleAnimeClick, t }) => {
    return (
        <section aria-labelledby={`${title}-heading`} className={styles.swiperSection}>
            <div className={styles.sectionHeader}>
                <h2 id={`${title}-heading`} className={styles.sectionTitle}>{t(`home.${title}`)}</h2>
                <Button 
                    variant="contained"
                    onClick={() => navigate(`/anime-list`)} 
                    aria-label={t(`home.more${title}`)}
                    className={styles.moreButton}
                >
                    {t('home.more')}
                </Button>
            </div>
            {loading ? (
                <Grid container spacing={1}>
                    {[...Array(16)].map((_, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} xl={1.5} key={index}>
                            <Box sx={{ aspectRatio: '2/3', width: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Skeleton 
                                    variant="rectangular" 
                                    width="100%" 
                                    height="100%" 
                                    sx={{ flexGrow: 1, minHeight: 200 }}
                                />
                                <Skeleton width="80%" sx={{ mt: 1 }} />
                                <Skeleton width="60%" />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                >
                    {items.map((item) => (
                        <SwiperSlide key={item._id}>
                            <AnimeCard
                                anime={item}
                                onClick={() => handleAnimeClick(item._id)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
};

export default AnimeSection;