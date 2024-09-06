const Anime = require('../models/anime');
const Genre = require('../models/genre');
const Type = require('../models/type');
const Episode = require('../models/episode'); // Make sure to import the Episode model

exports.getSitemapData = async (req, res) => {
    try {
        const animes = await Anime.find({}, 'slug updatedAt')
            .sort({ updatedAt: -1 })
            .limit(1000)
            .lean();

        const genres = await Genre.find({}, 'name').sort({ name: 1 }).lean();
        const types = await Type.find({}, 'name').sort({ name: 1 }).lean();

        // Fetch recent episodes
        const recentEpisodes = await Episode.find({}, 'number createdAt')
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('anime', 'slug')
            .lean();

        // Fetch popular anime (assuming you have a viewCount field)
        const popularAnime = await Anime.find({}, 'slug updatedAt')
            .sort({ viewCount: -1 })
            .limit(50)
            .lean();

        res.json({
            animes: animes.map(anime => ({
                slug: anime.slug,
                updatedAt: anime.updatedAt ? anime.updatedAt.toISOString() : new Date().toISOString()
            })),
            genres: genres.map(genre => ({ 
                slug: encodeURIComponent(genre.name.toLowerCase().replace(/\s+/g, '-')),
                name: genre.name 
            })),
            types: types.map(type => ({ 
                slug: encodeURIComponent(type.name.toLowerCase().replace(/\s+/g, '-')),
                name: type.name
            })),
            recentEpisodes: recentEpisodes.map(episode => ({
                animeSlug: episode.anime.slug,
                number: episode.number,
                createdAt: episode.createdAt.toISOString()
            })),
            popularAnime: popularAnime.map(anime => ({
                slug: anime.slug,
                updatedAt: anime.updatedAt ? anime.updatedAt.toISOString() : new Date().toISOString()
            }))
        });
    } catch (error) {
        console.error('Sitemap data error:', error);
        res.status(500).json({ message: 'Error fetching sitemap data', error: error.message });
    }
};