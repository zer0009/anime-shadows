import axios from 'axios';
import cheerio from 'cheerio';

const scrapeWebsite = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const servers = [];

    // Extract streaming servers
    $('.streaming-server').each((index, element) => {
      const serverName = $(element).find('.server-name').text().trim();
      const quality = $(element).find('.server-quality').text().trim();
      const link = $(element).find('a').attr('href');
      if (link) {
        servers.push({ serverName, quality, url: link, type: 'streaming' });
      }
    });

    // Extract download servers
    $('.download-server').each((index, element) => {
      const serverName = $(element).find('.server-name').text().trim();
      const quality = $(element).find('.server-quality').text().trim();
      const link = $(element).find('a').attr('href');
      if (link) {
        servers.push({ serverName, quality, url: link, type: 'download' });
      }
    });

    return servers;
  } catch (error) {
    console.error('Error scraping website:', error);
    return [];
  }
};

const detectServerInfo = (url) => {
  let name = '';
  let type = 'streaming';
  let quality = '';

  try {
    // Check if the input is a valid URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    // Detect server name
    if (hostname.includes('youtube') || hostname.includes('youtu.be')) {
      name = 'YouTube';
    } else if (hostname.includes('vimeo')) {
      name = 'Vimeo';
    } else if (hostname.includes('dailymotion')) {
      name = 'Dailymotion';
    } else if (hostname.includes('streamable')) {
      name = 'Streamable';
    } else if (hostname.includes('twitch')) {
      name = 'Twitch';
    } else if (hostname.includes('ok.ru')) {
      name = 'OK.ru';
    } else if (hostname.includes('videa')) {
      name = 'Videa';
    } else if (commonDownloadDomains.some(domain => hostname.includes(domain))) {
      name = hostname.split('.').slice(-2, -1)[0];
      type = 'download';
    } else {
      // Extract name from subdomain or first part of domain
      const parts = hostname.split('.');
      name = parts.length > 2 ? parts[0] : parts[parts.length - 2];
    }

    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Detect quality
    const qualityMatch = url.match(/(\d{3,4}p)/i) || pathname.match(/(\d{3,4}p)/i);
    if (qualityMatch) {
      quality = qualityMatch[1].toLowerCase();
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
    // Return default values if URL parsing fails
    return { name, type, quality };
  }

  return { name, type, quality };
};

export { scrapeWebsite, detectServerInfo };