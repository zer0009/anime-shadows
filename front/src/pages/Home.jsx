import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchAnime, searchAnime, fetchAnimeById } from '../api/modules/anime';
import AnimeCard from '../components/AnimeCard.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { Grid } from '@mui/joy';
import { Container } from '@mui/material';
import './Home.css'; // Import the CSS file for additional styling
import { saveAnimeToHistory } from '../api/modules/user';

const Home = () => {
    const [animeList, setAnimeList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchAnimeList = async () => {
            try {
                const response = await fetchAnime();
                setAnimeList(response.data);
            } catch (error) {
                console.error('Error fetching anime list:', error);
            }
        };

        fetchAnimeList();
    }, []);

    const handleSearch = async (query) => {
        try {
            const response = await searchAnime(query);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching anime:', error);
        }
    };

    const handleAnimeClick = async (animeId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await saveAnimeToHistory(animeId);
            }
            const response = await fetchAnimeById(animeId); // Use fetchAnimeById to get the anime details
            console.log(`Navigating to anime with ID: ${response.data}`); // Log the actual ID
            navigate(`/anime/${animeId}`); // Ensure navigation is added to history
            console.log(`URL after navigate: ${window.location.href}`); // Log the current URL
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    };

    return (
        <div className="home">
            <Container>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {(searchResults.length > 0 ? searchResults : animeList).map(anime => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={anime._id}>
                            <AnimeCard anime={anime} onClick={() => handleAnimeClick(anime._id)} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Footer />
        </div>
    );
};

export default Home;