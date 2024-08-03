import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import { Box, Container, Typography } from '@mui/material';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import styles from './HeroSection.module.css';

const HeroSection = ({ heroImages, t }) => {
    return (
        <Box className={styles.heroSection}>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className={styles.heroSwiper}
                style={{ height: '100%', width: '100%' }}
            >
                {heroImages.map((image, index) => (
                    <SwiperSlide key={index} className={styles.heroSlide}>
                        <OptimizedImage
                            webp={image.webp}
                            jpg={image.jpg}
                            alt={image.alt}
                            className={styles.heroImage}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Box className={styles.heroContent}>
                <Container maxWidth="lg">
                    <Typography variant="h1" className={styles.mainHeading}>
                        {t('home.mainHeading', 'أنمي شادوز')}
                    </Typography>
                    <Typography variant="h2" className={styles.subHeading}>
                        {t('home.subHeading', 'موقعك الأول لمشاهدة الأنمي')}
                    </Typography>
                    <Typography variant="body1" className={styles.introText}>
                        {t('home.introText', 'مرحبًا بك في أنمي شادوز، وجهتك الأولى لمشاهدة أحدث وأفضل الأنميات. استمتع بمجموعة واسعة من الأنميات المترجمة بجودة عالية.')}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default HeroSection;