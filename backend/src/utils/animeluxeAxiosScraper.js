const axios = require('axios');
const cheerio = require('cheerio');
const atob = require('atob');
const url = require('url');
const { getRandomUserAgent } = require('./userAgents');

const scrapeAnimeLuxeWithAxios = async (pageUrl) => {
  try {
    const { data } = await axios.get(pageUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://animeluxe.org/', // Add referer header
        'DNT': '1', // Do Not Track header
        'Cache-Control': 'no-cache', // Cache control header
      }
    });
    const $ = cheerio.load(data);

    const servers = [];

    // Extract streaming servers
    $('ul.server-list li a').each((i, element) => {
      const text = $(element).text().trim();
      const [quality, serverName] = text.split('-').map(part => part.trim());
      const encodedUrl = $(element).attr('data-url');
      const decodedUrl = atob(encodedUrl);
      servers.push({ serverName, quality, url: decodedUrl, type: 'streaming', subtitle: 'AR' });
    });

    // Extract download servers
    $('table.table tbody tr').each((i, element) => {
      const faviconUrl = $(element).find('td div.server span.favicon').attr('data-src');
      let serverName = faviconUrl ? url.parse(faviconUrl).hostname.replace('www.', '') : 'Unknown';
      const encodedUrl = $(element).find('a.download-link').attr('data-url');
      const decodedUrl = atob(encodedUrl);
      const quality = $(element).find('td span.badge').text().trim() || 'Unknown'; // Extract quality from the badge

      // Fallback to extracting server name from the URL if favicon URL is not helpful
      if (serverName === 'Unknown' || serverName === 's2.googleusercontent.com') {
        const parsedUrl = url.parse(decodedUrl);
        serverName = parsedUrl.hostname ? parsedUrl.hostname.replace('www.', '') : 'Unknown';
      }

      servers.push({ serverName, quality, url: decodedUrl, type: 'download', subtitle: 'AR' });
    });

    return servers;
  } catch (error) {
    console.error('Error scraping AnimeLuxe with Axios:', error);
    throw error;
  }
};

module.exports = { scrapeAnimeLuxeWithAxios };