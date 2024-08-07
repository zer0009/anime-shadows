const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const atob = require('atob');
const url = require('url');

const scrapeAnimeLuxe = async (pageUrl) => {
  let browser;
  try {
    console.log(`Fetching URL: ${pageUrl}`);
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(pageUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000, // Increase timeout to 60 seconds
    });

    // Increase the timeout for waitForSelector
    await page.waitForSelector('ul.server-list li a', { timeout: 90000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const servers = [];

    // Extract streaming servers
    $('ul.server-list li a').each((i, element) => {
      try {
        const serverName = $(element).text().trim();
        const encodedUrl = $(element).attr('data-url');
        const decodedUrl = atob(encodedUrl);
        const quality = serverName.includes('-') ? serverName.split('-').pop().trim() : 'HD';
        console.log(`Found streaming server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: 'streaming' });
      } catch (err) {
        console.error('Error extracting streaming server:', err);
      }
    });

    // Extract download servers
    $('table.table tbody tr').each((i, element) => {
      try {
        const faviconUrl = $(element).find('td div.server span.favicon').attr('data-src');
        const serverName = faviconUrl ? new URL(faviconUrl).hostname.replace('www.', '') : 'Unknown';
        const encodedUrl = $(element).find('a.download-link').attr('data-url');
        const decodedUrl = atob(encodedUrl);
        const quality = $(element).find('td span.badge').text().trim();
        console.log(`Found download server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: 'download' });
      } catch (err) {
        console.error('Error extracting download server:', err);
      }
    });

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping AnimeLuxe:', error.message);
    console.error('Error details:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { scrapeAnimeLuxe };