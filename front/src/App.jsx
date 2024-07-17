import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
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


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
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
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/episode/:episodeId" element={<EpisodePage />} />
          <Route path="/admin/manage-anime" element={<AdminRoute><ManageAnime /></AdminRoute>} />
          <Route path="/admin/edit-anime/:animeId" element={<AdminRoute><EditAnime /></AdminRoute>} />
          <Route path="/admin/edit-episodes/:animeId" element={<AdminRoute><EditEpisodes /></AdminRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
