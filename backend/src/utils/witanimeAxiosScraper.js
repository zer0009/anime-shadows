const axios = require('axios');
const cheerio = require('cheerio');
const atob = require('atob');
const { getRandomUserAgent } = require('./userAgents');
const { qualityMap } = require('./scraperUtils');

const scrapeWitanimeWithAxios = async (url) => {
  try {
    console.log(`Fetching URL: ${url}`);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    console.log('Fetched data successfully');
    const $ = cheerio.load(data);

    const servers = [];

    // Extract streaming servers
    const serverUrls = JSON.parse($('script:contains("var serverUrls_")').html().match(/var serverUrls_\w+ = ({.*});/)[1]);
    for (const [key, value] of Object.entries(serverUrls)) {
      const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
      const decodedUrl = atob(value).split('|')[0]; // Split and take the first part
      const quality = serverName.includes('-') ? qualityMap[serverName.split('-').pop().trim()] || 'HD' : 'HD';
      console.log(`Found streaming server: ${serverName}, ${decodedUrl}, ${quality}`);
      servers.push({ serverName, quality, url: decodedUrl, type: 'streaming' });
    }

    // Extract download servers
    const downloadUrls = JSON.parse($('script:contains("var downloadUrls_")').html().match(/var downloadUrls_\w+ = ({.*});/)[1]);
    console.log('Download URLs:', downloadUrls);
    for (const [key, value] of Object.entries(downloadUrls)) {
      const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
      const decodedUrl = atob(value).split('|')[0]; // Split and take the first part
      let quality = 'HD'; // Default quality

      // Determine quality based on key prefix
      if (key.startsWith('dsd')) {
        quality = 'SD';
      } else if (key.startsWith('dhd')) {
        quality = 'HD';
      } else if (key.startsWith('dfhd')) {
        quality = 'FHD';
      }

      console.log(`Found download server: ${serverName}, ${decodedUrl}, ${quality}`);
      servers.push({ serverName, quality, url: decodedUrl, type: 'download' });
    }

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping Witanime with Axios:', error);
    throw error;
  }
};

module.exports = { scrapeWitanimeWithAxios };