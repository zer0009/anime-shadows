const Episode = require('../models/episode');
const Anime = require('../models/anime');

const createEpisode = async (req, res) => {
    const { animeId,title, number, streamingServers, downloadServers } = req.body;

    try {
        const anime = await Anime.findById(animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const episode = new Episode({ anime: animeId, number, title, streamingServers, downloadServers });
        await episode.save();

        anime.episodes.push(episode._id);
        await anime.save();

        res.status(201).json(episode);
    } catch (error) {
        console.error('Error creating episode:', error);
        res.status(500).json({ message: 'Error creating episode' });
    }
};

const getEpisodeById = async (req, res) => {
    const { id } = req.params;
    try {
        const episode = await Episode.findById(id).populate('anime');
        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        res.status(200).json(episode);
    } catch (error) {
        console.error('Error fetching episode:', error);
        res.status(500).json({ message: 'Error fetching episode' });
    }
};

const updateEpisode = async (req, res) => {
    const { id } = req.params;
    const { animeId, number, title, streamingServers, downloadServers } = req.body;
    try {
        const episode = await Episode.findByIdAndUpdate(id, { anime: animeId, number, title, streamingServers, downloadServers }, { new: true });
        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        res.status(200).json(episode);
    } catch (error) {
        console.error('Error updating episode:', error);
        res.status(500).json({ message: 'Error updating episode' });
    }
};

const deleteEpisode = async (req, res) => {
    const { id } = req.params;
    try {
        const episode = await Episode.findByIdAndDelete(id);
        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }

        const anime = await Anime.findById(episode.anime);
        if (anime) {
            anime.episodes.pull(episode._id);
            await anime.save();
        }

        res.status(204).json({ message: 'Episode deleted successfully' });
    } catch (error) {
        console.error('Error deleting episode:', error);
        res.status(500).json({ message: 'Error deleting episode' });
    }
};

const getEpisodesByAnimeId = async (req, res) => {
    const { animeId } = req.params;
    try {
        const episodes = await Episode.find({ anime: animeId }).sort({ number: 1 }).populate('anime');
        res.status(200).json(episodes);
    } catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ message: 'Error fetching episodes' });
    }
};

const getRecentlyUpdatedEpisodes = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const recentEpisodes = await Episode.aggregate([
            { $sort: { updatedAt: -1 } },
            { $group: { _id: "$anime", latestEpisode: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$latestEpisode" } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ]);

        const populatedEpisodes = await Episode.populate(recentEpisodes, { path: 'anime' });
        const filteredEpisodes = populatedEpisodes.filter(episode => episode.anime !== null);

        // Calculate the total number of unique animes
        const totalAnimes = await Episode.distinct('anime').then(animes => animes.length);

        res.status(200).json({
            episodes: filteredEpisodes,
            totalPages: Math.ceil(totalAnimes / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching recently updated episodes:', error);
        res.status(500).json({ message: 'Error fetching recently updated episodes' });
    }
};

module.exports = {
    createEpisode,
    getEpisodeById,
    updateEpisode,
    deleteEpisode,
    getEpisodesByAnimeId,
    getRecentlyUpdatedEpisodes
};