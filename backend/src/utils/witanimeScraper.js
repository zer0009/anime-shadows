const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const atob = require('atob');
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const scrapeWitanime = async (pageUrl) => {
  let browser;
  let page;
  try {
    console.log(`Fetching URL: ${pageUrl}`);
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.goto(pageUrl, {
      waitUntil: 'networkidle2',
      timeout: 90000, // Increase timeout to 90 seconds
    });

    // Wait for the episode servers list or download links to appear
    await page.waitForSelector('#episode-servers, .quality-list', { timeout: 90000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const servers = [];

    // Extract streaming servers
    $('#episode-servers li a').each((i, element) => {
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
    $('.quality-list li a.download-link').each((i, element) => {
      try {
        const serverName = $(element).find('span.notice').text().trim();
        const encodedUrl = $(element).attr('data-url');
        const decodedUrl = atob(encodedUrl);
        const quality = $(element).closest('ul.quality-list').find('li').first().text().trim();
        console.log(`Found download server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: 'download' });
      } catch (err) {
        console.error('Error extracting download server:', err);
      }
    });

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping Witanime:', error.message);
    console.error('Error details:', error);

    // Save a screenshot and HTML content for debugging
    if (page) {
      await page.screenshot({ path: 'error_screenshot.png' });
      const htmlContent = await page.content();
      fs.writeFileSync('error_page.html', htmlContent);
    }

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { scrapeWitanime };