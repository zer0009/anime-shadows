const axios = require('axios');
const cheerio = require('cheerio');
const atob = require('atob');

const scrapeWitanime = async (url) => {
  try {
    console.log(`Fetching URL: ${url}`);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    console.log('Fetched data successfully');
    const $ = cheerio.load(data);

    const servers = [];

    // Extract streaming servers
    const serverUrls = JSON.parse($('script:contains("var serverUrls_")').html().match(/var serverUrls_\w+ = ({.*});/)[1]);
    for (const [key, value] of Object.entries(serverUrls)) {
      try {
        const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
        const decodedUrl = atob(value).split('|')[0]; // Split and take the first part
        const quality = serverName.includes('-') ? serverName.split('-').pop().trim() : 'HD';
        console.log(`Found streaming server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: 'streaming' });
      } catch (err) {
        console.error('Error extracting streaming server:', err);
      }
    }

    // Extract download servers
    const downloadUrls = JSON.parse($('script:contains("var downloadUrls_")').html().match(/var downloadUrls_\w+ = ({.*});/)[1]);
    for (const [key, value] of Object.entries(downloadUrls)) {
      try {
        const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
        const decodedUrl = atob(value).split('|')[0]; // Split and take the first part
        let quality = 'HD'; // Default quality
        if (serverName.includes('-')) {
          quality = serverName.split('-').pop().trim();
        } else if (serverName.toLowerCase().includes('google drive')) {
          quality = 'HD'; // Specific handling for Google Drive
        }
        console.log(`Found download server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: 'download' });
      } catch (err) {
        console.error('Error extracting download server:', err);
      }
    }

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping Witanime:', error);
    throw error;
  }
};

module.exports = { scrapeWitanime };