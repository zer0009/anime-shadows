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
import UserProfile from './components/UserProfile/UserProfile.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
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
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
