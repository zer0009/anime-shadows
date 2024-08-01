const axios = require('axios');
const cheerio = require('cheerio');

const scrapeAnimeFromMAL = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    const $ = cheerio.load(data);

    const pageTitle = $('title').text().trim();
    console.log("Page title:", pageTitle);

    const title = $('h1.title-name strong').text().trim();
    console.log("Title:", title);

    const getSubtitle = () => {
      const titleMatch = pageTitle.match(/^(.*?)\s*\((.*?)\)\s*-/);
      if (titleMatch && titleMatch[2] && titleMatch[2] !== title) {
        return titleMatch[2].trim();
      }
      return null;
    };
    const subTitle = getSubtitle();
    console.log("Subtitle:", subTitle);

    const synopsis = $('p[itemprop="description"]').text().trim();
    console.log("Synopsis length:", synopsis.length);

    const infoBlock = $('.leftside');
    console.log("Info block found:", infoBlock.length > 0);

    const getInfo = (label) => {
      const element = infoBlock.find(`span:contains("${label}:")`);
      console.log(`${label} element found:`, element.length > 0);
      let value = element.next().text().trim();
      if (!value) {
        value = element.parent().clone().children().remove().end().text().trim();
      }
      console.log(`${label}:`, value);
      return value;
    };

    const type = getInfo('Type');
    const episodes = getInfo('Episodes');
    const status = getInfo('Status');
    const aired = getInfo('Aired');
    const studios = infoBlock.find('span:contains("Studios:")').parent().find('a').map((_, el) => $(el).text().trim()).get();
    console.log("Studios:", studios);
    const source = getInfo('Source');
    const genres = infoBlock.find('span:contains("Genres:")').parent().find('a').map((_, el) => $(el).text().trim()).get();
    console.log("Genres:", genres);
    const duration = getInfo('Duration');

    const pictureUrl = $('img[itemprop="image"]').attr('data-src') || $('img[itemprop="image"]').attr('src');
    console.log("Picture URL:", pictureUrl);

    const parseAiredDate = (airedString) => {
      const dates = airedString.split(' to ').map(date => date.trim());
      return {
        start: dates[0] && dates[0] !== 'Not available' ? new Date(dates[0]) : null,
        end: dates[1] && dates[1] !== '?' ? new Date(dates[1]) : null
      };
    };

    const result = {
      title,
      subTitle,
      synopsis,
      type,
      numberOfEpisodes: episodes !== 'Unknown' ? parseInt(episodes, 10) : null,
      status,
      airingDate: parseAiredDate(aired),
      studio: studios.length > 0 ? studios.join(', ') : null,
      source,
      genres,
      duration,
      myAnimeListUrl: url,
      pictureUrl
    };

    console.log("Scraped data:", result);

    return result;
  } catch (error) {
    console.error('Error scraping MyAnimeList:', error);
    throw error;
  }
};

const fetchMyAnimeListRating = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const rating = $('span[itemprop="ratingValue"]').text().trim();
    const userCount = $('span[itemprop="ratingCount"]').text().trim().replace(/,/g, '');

    return {
      rating: parseFloat(rating) || null,
      userCount: parseInt(userCount, 10) || null
    };
  } catch (error) {
    console.error('Error fetching MyAnimeList rating:', error);
    throw error;
  }
};

module.exports = { scrapeAnimeFromMAL, fetchMyAnimeListRating };