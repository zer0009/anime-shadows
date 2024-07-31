import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from './components/common/Header.jsx';
import Home from './pages/Home.jsx';
import AnimeList from './pages/AnimeList.jsx';
import MovieList from './pages/MovieList.jsx';
import SeasonAnime from './pages/SeasonAnime.jsx';
import Login from './pages/Login.jsx';
import AnimeDetails from './pages/AnimeDetails.jsx';
import Register from './pages/Register.jsx';
import SearchPage from './pages/SearchPage.jsx';
import Profile from './pages/Profile.jsx';
import History from './pages/History.jsx';
import Favorites from './pages/Favorites.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import EpisodePage from './pages/EpisodePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import EditAnime from './components/admin/EditAnime.jsx';
import EditEpisodes from './components/admin/EditEpisodes.jsx';
import ManageAnime from './components/admin/ManageAnime.jsx';
import FilteredListPage from './pages/FilteredListPage.jsx';
import AddEpisode from './components/admin/AddEpisode.jsx';
import PopularAnime from './pages/PopularAnime.jsx';
import RecentEpisodes from './pages/RecentEpisodes.jsx';
import AdminRegister from './pages/AdminRegister.jsx';
import Footer from './components/common/Footer.jsx';
import usePageTracking from './hooks/usePageTracking';
import { initGA, logPageView, setConsent } from './analytics';
import CookieConsent from 'react-cookie-consent';
import { HelmetProvider } from 'react-helmet-async';

const setDirection = (language) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
};

i18n.on('languageChanged', (language) => {
  setDirection(language);
});

setDirection(i18n.language); // Set initial direction

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return (
    <div className="app-container">
      <Header />
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime-list" element={<AnimeList />} />
          <Route path="/movie-list" element={<MovieList />} />
          <Route path="/season-anime" element={<SeasonAnime />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/filter/:filterType/:filterValue" element={<FilteredListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/popular-anime" element={<PopularAnime />} />
          <Route path="/recent-episodes" element={<RecentEpisodes />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/episode/:episodeId" element={<EpisodePage />} />
          <Route path="/admin/manage-anime" element={<AdminRoute><ManageAnime /></AdminRoute>} />
          <Route path="/admin/edit-anime/:animeId" element={<AdminRoute><EditAnime /></AdminRoute>} />
          <Route path="/admin/edit-episodes/:animeId" element={<AdminRoute><EditEpisodes /></AdminRoute>} />
          <Route path="/admin/add-episode/:animeId" element={<AdminRoute><AddEpisode /></AdminRoute>} />
        </Routes>
      </div>
      <Footer />
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="ga_consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        onAccept={() => {
          setConsent(true);
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </div>
  );
}

function App() {
  useEffect(() => {
    initGA(import.meta.env.VITE_REACT_APP_GA_MEASUREMENT_ID);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <HelmetProvider>
          <AppContent />
        </HelmetProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;