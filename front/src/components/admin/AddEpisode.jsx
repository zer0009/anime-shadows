import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { addEpisode, updateEpisode } from '../../api/modules/admin';
import { fetchAnime, fetchEpisodesByAnimeId } from '../../api/modules/anime';
import AnimeSelector from './AnimeSelector';
import EpisodeSelector from './EpisodeSelector';
import ServerManager from './ServerManager';
import styles from './AddEpisode.module.css';

const AddEpisode = () => {
  const [animeId, setAnimeId] = useState('');
  const [episodeId, setEpisodeId] = useState('');
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [allAnimes, setAllAnimes] = useState([]);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [streamingServers, setStreamingServers] = useState([]);
  const [downloadServers, setDownloadServers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const animesData = await fetchAnime();
      setAllAnimes(animesData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (animeId) {
      const fetchEpisodes = async () => {
        const episodesData = await fetchEpisodesByAnimeId(animeId);
        setAllEpisodes(episodesData);
      };
      fetchEpisodes();
    }
  }, [animeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (episodeId) {
        await updateEpisode(episodeId, { animeId, title, number, streamingServers, downloadServers });
        alert('Episode updated successfully');
      } else {
        await addEpisode({ animeId, title, number, streamingServers, downloadServers });
        alert('Episode added successfully');
      }
    } catch (error) {
      console.error('Error saving episode:', error);
    }
  };

  return (
    <div className={styles.addEpisode}>
      <Typography variant="h6">Add or Edit Episode</Typography>
      <form onSubmit={handleSubmit}>
        <AnimeSelector
          animeId={animeId}
          setAnimeId={setAnimeId}
          allAnimes={allAnimes}
        />
        <EpisodeSelector
          episodeId={episodeId}
          setEpisodeId={setEpisodeId}
          title={title}
          setTitle={setTitle}
          number={number}
          setNumber={setNumber}
          allEpisodes={allEpisodes}
        />
        <ServerManager
          streamingServers={streamingServers}
          setStreamingServers={setStreamingServers}
          downloadServers={downloadServers}
          setDownloadServers={setDownloadServers}
        />
        <Button type="submit" variant="contained" color="primary">Save Episode</Button>
      </form>
    </div>
  );
};

export default AddEpisode;
