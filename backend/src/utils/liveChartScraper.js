const axios = require('axios');
const cheerio = require('cheerio');

const scrapeAnimeFromLiveChart = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1.main-title').text().trim();
    const englishTitle = $('div.anime-titles .english').text().trim();
    const japaneseTitle = $('div.anime-titles .japanese').text().trim();
    const status = $('div.anime-info .anime-status').text().trim();
    const premiereDate = $('div.anime-info time').attr('datetime');
    const season = $('div.anime-info .anime-season').text().trim();
    const format = $('div.anime-info .anime-type').text().trim();
    const source = $('div.anime-info .anime-source').text().trim();
    const episodes = $('div.anime-info .anime-episodes').text().trim();
    const runtime = $('div.anime-info .anime-runtime').text().trim();
    const studio = $('div.anime-info .anime-studios').text().trim();
    const genres = $('div.anime-tags .anime-genre').map((_, el) => $(el).text().trim()).get();
    const synopsis = $('div.anime-synopsis').text().trim();
    const rating = $('div.anime-rating .score').text().trim();
    const userCount = $('div.anime-rating .count').text().trim().replace(/,/g, '');
    const pictureUrl = $('div.anime-poster img').attr('src');

    return {
      title,
      englishTitle: englishTitle || null,
      japaneseTitle: japaneseTitle || null,
      status: mapStatus(status),
      airingDate: premiereDate ? new Date(premiereDate) : null,
      season,
      type: format,
      source,
      numberOfEpisodes: episodes.split(' ')[0] || null,
      duration: runtime,
      studio,
      genres,
      synopsis,
      liveChartUrl: url,
      pictureUrl,
      rating: rating ? parseFloat(rating) : null,
      userCount: userCount ? parseInt(userCount) : null
    };
  } catch (error) {
    console.error('Error scraping LiveChart:', error);
    throw error;
  }
};

const mapStatus = (status) => {
  if (status.includes('Releasing')) return 'ongoing';
  if (status.includes('Finished')) return 'completed';
  if (status.includes('Not yet released')) return 'upcoming';
  return null;
};

module.exports = { scrapeAnimeFromLiveChart };