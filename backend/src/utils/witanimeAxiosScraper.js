const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { createBrowserPool, closeBrowserPool } = require('./puppeteerUtils');
const { getRandomUserAgent } = require('./userAgents');
const { processDownloadUrls } = require('./processDownload');

puppeteer.use(StealthPlugin());

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

    // Extract download servers
    const customUrlsScript = $('script:contains("var customUrls")').html();
    if (customUrlsScript) {
      const customUrlsMatch = customUrlsScript.match(/var customUrls = ({.*});/);
      if (customUrlsMatch) {
        const customUrls = JSON.parse(customUrlsMatch[1]);
        const browserPool = await createBrowserPool(20); // Increase browser pool size to 20

        const downloadServers = await processDownloadUrls(browserPool, customUrls, $, url);
        servers.push(...downloadServers);

        await closeBrowserPool(browserPool); // Close all browser instances in the pool
      }
    }

    // Use Puppeteer to get the actual download URLs
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(getRandomUserAgent());
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the download links to be available
    await page.waitForSelector('a.download-link');

    const downloadLinks = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a.download-link');
      return Array.from(linkElements).map(element => ({
        linkText: element.textContent.trim(),
        downloadUrl: element.getAttribute('href')
      }));
    });

    servers.push(...downloadLinks);

    await browser.close();

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping Witanime with Axios:', error);
    throw error;
  }
};

module.exports = { scrapeWitanimeWithAxios };