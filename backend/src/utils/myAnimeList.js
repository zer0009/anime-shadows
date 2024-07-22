const axios = require('axios');
const cheerio = require('cheerio');

const fetchMyAnimeListRating = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const rating = $('span[itemprop="ratingValue"]').text().trim();
    const userCount = $('span[itemprop="ratingCount"]').text().trim().replace(/,/g, ''); // Remove commas for parsing

    return {
      rating: parseFloat(rating),
      userCount: parseInt(userCount, 10) // Parse user count as integer
    };
  } catch (error) {
    console.error('Error fetching MyAnimeList rating:', error);
    throw error;
  }
};

module.exports = { fetchMyAnimeListRating };