const Episode = require('../models/episode');
const Anime = require('../models/anime');

const createEpisode = async (req, res) => {
    const { animeId, number, title, servers } = req.body;

    try {
        // Create a new episode
        const episode = new Episode({ anime: animeId, number, title, servers });
        await episode.save();

        // Find the anime by ID and update its episodes array
        const anime = await Anime.findById(animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }
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
    const { animeId, number, title, servers } = req.body;
    try {
        const episode = await Episode.findByIdAndUpdate(id, { anime: animeId, number, title, servers }, { new: true });
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

        // Remove the episode from the anime's episodes array
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
        const episodes = await Episode.find({ anime: animeId }).populate('anime');
        res.status(200).json(episodes);
    } catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ message: 'Error fetching episodes' });
    }
};

// Controller function to fetch recent episodes
const getRecentEpisodes = async (req, res) => {
    try {
        // Fetch the most recent episodes, limit to 10 for example
        const recentEpisodes = await Episode.find()
            .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
            .limit(10)
            .populate('anime'); // Populate the anime details

        res.status(200).json(recentEpisodes);
    } catch (error) {
        console.error('Error fetching recent episodes:', error);
        res.status(500).json({ message: 'Error fetching recent episodes' });
    }
};

const getRecentlyUpdatedEpisodes = async (req, res) => {
    try {
        const recentEpisodes = await Episode.aggregate([
            {
                $sort: { updatedAt: -1 } // Sort episodes by updatedAt in descending order
            },
            {
                $group: {
                    _id: "$anime", // Group by anime
                    latestEpisode: { $first: "$$ROOT" } // Get the most recent episode for each anime
                }
            },
            {
                $replaceRoot: { newRoot: "$latestEpisode" } // Replace the root with the latest episode
            },
            {
                $limit: 10 // Limit to 10 episodes
            }
        ]).exec();

        const populatedEpisodes = await Episode.populate(recentEpisodes, { path: 'anime' });

        res.status(200).json(populatedEpisodes);
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
    getRecentEpisodes,
    getRecentlyUpdatedEpisodes
};
