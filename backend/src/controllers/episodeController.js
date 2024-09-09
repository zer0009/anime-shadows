const Episode = require('../models/episode');
const Anime = require('../models/anime');

const createEpisode = async (req, res) => {
    const { animeId, title, number, streamingServers, downloadServers } = req.body;

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

        // Ensure subtitle field exists for all servers
        episode.streamingServers = episode.streamingServers.map(server => ({
            ...server.toObject(),
            subtitle: server.subtitle || 'AR'
        }));
        episode.downloadServers = episode.downloadServers.map(server => ({
            ...server.toObject(),
            subtitle: server.subtitle || 'AR'
        }));

        res.status(200).json(episode);
    } catch (error) {
        console.error('Error fetching episode:', error);
        res.status(500).json({ message: 'Error fetching episode' });
    }
};

const getEpisodeBySlugAndNumber = async (req, res) => {
    const { slug, episodeNumber } = req.query;
    try {
        const anime = await Anime.findOne({ slug });
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const episode = await Episode.findOne({ anime: anime._id, number: episodeNumber }).populate('anime');
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
        const updatedEpisode = await Episode.findByIdAndUpdate(
            id,
            { 
                anime: animeId, 
                number, 
                title, 
                streamingServers: streamingServers.map(server => ({
                    ...server,
                    subtitle: server.subtitle || 'AR'
                })),
                downloadServers: downloadServers.map(server => ({
                    ...server,
                    subtitle: server.subtitle || 'AR'
                }))
            },
            { new: true, runValidators: true }
        );
        if (!updatedEpisode) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        res.status(200).json(updatedEpisode);
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
        const episodes = await Episode.find({ anime: animeId })
            .sort({ number: 1 })
            .select('number title streamingServers downloadServers anime')
            .populate('anime', 'title slug');
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
            { $sort: { updatedAt: -1, _id: -1 } },
            { $group: { _id: "$anime", latestEpisode: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$latestEpisode" } },
            { $sort: { updatedAt: -1, _id: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
            { $project: { 
                _id: 1, 
                anime: 1, 
                number: 1, 
                title: 1, 
                streamingServers: 1,
                downloadServers: 1,
                viewCount: 1, 
                updatedAt: 1 
            }}
        ]);

        const populatedEpisodes = await Episode.populate(recentEpisodes, {
            path: 'anime',
            select: 'title slug pictureUrl'
        });

        const filteredEpisodes = populatedEpisodes.filter(episode => episode.anime !== null);

        const episodesWithSlug = filteredEpisodes.map(episode => {
            const subtitles = new Set();
            episode.streamingServers.concat(episode.downloadServers).forEach(server => {
                if (server.subtitle) subtitles.add(server.subtitle);
            });
            return {
                ...episode,
                animeSlug: episode.anime.slug,
                availableSubtitles: Array.from(subtitles).sort()
            };
        });

        const totalAnimes = await Episode.distinct('anime').then(animes => animes.length);

        res.status(200).json({
            episodes: episodesWithSlug,
            totalPages: Math.ceil(totalAnimes / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching recently updated episodes:', error);
        res.status(500).json({ message: 'Error fetching recently updated episodes' });
    }
};

const updateViewCount = async (req, res) => {
    const { episodeId } = req.params;
    try {
        const episode = await Episode.findByIdAndUpdate(
            episodeId,
            { $inc: { viewCount: 1 }, $push: { views: Date.now() } },
            { new: true, select: 'viewCount views', timestamps: false }
        );
        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        res.status(200).json(episode);
    } catch (error) {
        console.error('Error updating view count:', error);
        res.status(500).json({ message: 'Error updating view count' });
    }
};

module.exports = {
    createEpisode,
    getEpisodeById,
    updateEpisode,
    deleteEpisode,
    getEpisodesByAnimeId,
    getRecentlyUpdatedEpisodes,
    updateViewCount,
    getEpisodeBySlugAndNumber
};