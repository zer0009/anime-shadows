import React, { Suspense } from 'react';
import { Box, Button, Grid, Skeleton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import styles from './AnimeSection.module.css';

const AnimeCard = React.lazy(() => import('../AnimeCard/AnimeCard'));

const LoadingSkeleton = () => (
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
);

const AnimeSwiper = ({ items, navigate, isMobile }) => (
  <Swiper
    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
    spaceBetween={10}
    slidesPerView={2}
    breakpoints={{
      320: { slidesPerView: 2, spaceBetween: 8 },
      480: { slidesPerView: 2, spaceBetween: 10 },
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
      1280: { slidesPerView: 6 },
      1536: { slidesPerView: 7 },
    }}
    navigation={!isMobile}
    pagination={{ clickable: true }}
    scrollbar={{ draggable: true }}
  >
    {items.map((item) => (
      <SwiperSlide key={item._id}>
        <Suspense fallback={<div>Loading...</div>}>
          <AnimeCard
            anime={item}
            onClick={() => navigate(`/anime/${item.slug}`)}
          />
        </Suspense>
      </SwiperSlide>
    ))}
  </Swiper>
);

const AnimeSection = ({ title, items, loading, navigate, t, isMobile, moreLink }) => {
  return (
    <section aria-labelledby={`${title}-heading`} className={styles.swiperSection}>
      <div className={styles.sectionHeader}>
        <h2 id={`${title}-heading`} className={styles.sectionTitle}>{t(`home.${title}`)}</h2>
        <Button 
          variant="contained"
          onClick={() => navigate(moreLink)} 
          aria-label={t(`home.more${title}`)}
          className={styles.moreButton}
        >
          {t('home.more')}
        </Button>
      </div>
      {loading ? <LoadingSkeleton /> : <AnimeSwiper items={items} navigate={navigate} isMobile={isMobile} />}
    </section>
  );
};

export default AnimeSection;