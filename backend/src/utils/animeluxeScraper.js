const axios = require('axios');
const cheerio = require('cheerio');
const atob = require('atob');
const url = require('url');

const scrapeAnimeLuxe = async (pageUrl) => {
  try {
    console.log(`Fetching URL: ${pageUrl}`);
    const { data } = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    console.log('Fetched data successfully');
    const $ = cheerio.load(data);

    const servers = [];

    // Extract streaming servers
    $('ul.server-list li a').each((i, element) => {
      const serverName = $(element).text().trim();
      const encodedUrl = $(element).attr('data-url');
      const decodedUrl = atob(encodedUrl);
      const quality = serverName.includes('-') ? serverName.split('-').pop().trim() : 'HD';
      console.log(`Found streaming server: ${serverName}, ${decodedUrl}, ${quality}`);
      servers.push({ serverName, quality, url: decodedUrl, type: 'streaming' });
    });

    // Extract download servers
    $('table.table tbody tr').each((i, element) => {
      const faviconUrl = $(element).find('td div.server span.favicon').attr('data-src');
      const serverName = faviconUrl ? url.parse(faviconUrl).hostname.replace('www.', '') : 'Unknown';
      const encodedUrl = $(element).find('a.download-link').attr('data-url');
      const decodedUrl = atob(encodedUrl);
      const quality = $(element).find('td span.badge').text().trim();
      console.log(`Found download server: ${serverName}, ${decodedUrl}, ${quality}`);
      servers.push({ serverName, quality, url: decodedUrl, type: 'download' });
    });

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping AnimeLuxe:', error);
    throw error;
  }
};

module.exports = { scrapeAnimeLuxe };