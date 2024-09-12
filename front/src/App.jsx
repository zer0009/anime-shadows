import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import ModeratorRoute from './components/ModeratorRoute.jsx';
import { initGA, logPageView, setConsent } from './analytics';
import CookieConsent from 'react-cookie-consent';

import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './styles/global.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const AnimeList = lazy(() => import('./pages/AnimeList.jsx'));
const MovieList = lazy(() => import('./pages/MovieList.jsx'));
const SeasonAnime = lazy(() => import('./pages/SeasonAnime.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const AnimeDetails = lazy(() => import('./pages/AnimeDetails.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const History = lazy(() => import('./pages/History.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const EpisodePage = lazy(() => import('./pages/EpisodePage.jsx'));
const EditAnime = lazy(() => import('./components/admin/EditAnime.jsx'));
const EditEpisodes = lazy(() => import('./components/admin/EditEpisodes.jsx'));
const ManageAnime = lazy(() => import('./components/admin/ManageAnime.jsx'));
const FilteredListPage = lazy(() => import('./pages/FilteredListPage.jsx'));
const AddEpisode = lazy(() => import('./components/admin/AddEpisode.jsx'));
const PopularAnime = lazy(() => import('./pages/PopularAnime.jsx'));
const RecentEpisodes = lazy(() => import('./pages/RecentEpisodes.jsx'));
const AdminRegister = lazy(() => import('./pages/AdminRegister.jsx'));
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const GenrePage = lazy(() => import('./pages/GenrePage.jsx'));

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
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime-list/" element={<AnimeList />} />
            <Route path="/movie-list/" element={<MovieList />} />
            <Route path="/season-anime/" element={<SeasonAnime />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
            <Route path="/anime/:slug" element={<AnimeDetails />} />
            <Route path="/episode/:episodeSlug" element={<EpisodePage />} />
            <Route path="/filter/:filterType/:filterValue/" element={<FilteredListPage />} />
            <Route path="/search/" element={<SearchPage />} />
            <Route path="/admin-register/" element={<AdminRegister />} />
            <Route path="/popular-anime/" element={<PopularAnime />} />
            <Route path="/recent-episodes/" element={<RecentEpisodes />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/profile/" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/last-watching/" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/favorites/" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/admin-dashboard/" element={<AdminRoute allowedRoles={['admin', 'moderator']}><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/manage-anime/" element={<AdminRoute allowedRoles={['admin', 'moderator']}><ManageAnime /></AdminRoute>} />
            <Route path="/admin/edit-anime/:animeId/" element={<AdminRoute allowedRoles={['admin', 'moderator']}><EditAnime /></AdminRoute>} />
            <Route path="/admin/edit-episodes/:animeId/" element={<AdminRoute allowedRoles={['admin', 'moderator']}><EditEpisodes /></AdminRoute>} />
            <Route path="/admin/add-episode/:animeId/" element={<AdminRoute allowedRoles={['admin', 'moderator']}><AddEpisode /></AdminRoute>} />
            <Route path="/genres" element={<GenrePage />} />
            <Route path="/genre/:genreId" element={<FilteredListPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/*" element={<Navigate to={`${location.pathname}/`} replace />} />
          </Routes>
        </Suspense>
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
      <HelmetProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </HelmetProvider>
    </I18nextProvider>
  );
}

export default App;