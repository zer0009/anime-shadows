const mongoose = require('mongoose');
const slugify = require('slugify');
const Anime = require('../models/anime');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectionURL = process.env.MONGODB_URI;

if (!connectionURL) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

const updateSlugs = async () => {
  try {
    await mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const animes = await Anime.find({ slug: { $exists: false } });

    for (const anime of animes) {
      anime.slug = slugify(anime.title, { lower: true, strict: true });
      await anime.save();
      console.log(`Updated slug for anime: ${anime.title}`);
    }

    console.log('All slugs updated successfully.');
  } catch (error) {
    console.error('Error updating slugs:', error);
  } finally {
    mongoose.disconnect().then(() => {
      console.log('Disconnected from MongoDB');
    }).catch((error) => {
      console.error('Error disconnecting from MongoDB:', error);
    });
  }
};

updateSlugs();