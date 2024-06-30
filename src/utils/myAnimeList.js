const axios = require('axios');
const cheerio = require('cheerio');

const fetchMyAnimeListRating = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const rating = $('span[itemprop="ratingValue"]').text().trim();
    return parseFloat(rating);
  } catch (error) {
    console.error('Error fetching MyAnimeList rating:', error);
    throw error;
  }
};

module.exports = { fetchMyAnimeListRating };