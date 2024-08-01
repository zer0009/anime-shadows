const Anime = require('../models/anime');
const Genre = require('../models/genre');
const Type = require('../models/type');

exports.getSitemapData = async (req, res) => {
    try {
        const animes = await Anime.find({}, '_id updatedAt')
            .sort({ updatedAt: -1 })
            .limit(1000)
            .lean();

        const genres = await Genre.find({}, 'name').sort({ name: 1 }).lean();
        const types = await Type.find({}, 'name').sort({ name: 1 }).lean();

        res.json({
            animes: animes.map(anime => ({
                id: anime._id,
                updatedAt: anime.updatedAt ? anime.updatedAt.toISOString() : new Date().toISOString()
            })),
            genres: genres.map(genre => ({ 
                slug: encodeURIComponent(genre.name.toLowerCase().replace(/\s+/g, '-')),
                name: genre.name 
            })),
            types: types.map(type => ({ 
                slug: encodeURIComponent(type.name.toLowerCase().replace(/\s+/g, '-')),
                name: type.name
            }))
        });
    } catch (error) {
        console.error('Sitemap data error:', error);
        res.status(500).json({ message: 'Error fetching sitemap data', error: error.message });
    }
};