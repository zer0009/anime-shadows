const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const atob = require('atob');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs'); // Import the fs module

puppeteer.use(StealthPlugin());

const scrapeAnimeLuxeWithPuppeteer = async (pageUrl) => {
  let browser;
  let page;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ],
    });
    page = await browser.newPage();

    // Block images, CSS, and other unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(pageUrl, {
      waitUntil: 'networkidle2',
      timeout: 120000, // Increase timeout to 120 seconds
    });

    await page.waitForSelector('ul.server-list li a, table.table tbody tr', { timeout: 120000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const servers = [];

    // Extract streaming servers
    $('ul.server-list li a').each((i, element) => {
      try {
        const serverText = $(element).text().trim();
        const encodedUrl = $(element).attr('data-url');
        const decodedUrl = atob(encodedUrl);
        const quality = serverText.includes('-') ? serverText.split('-')[0].trim() : 'HD';
        let serverName = serverText.includes('-') ? serverText.split('-').pop().trim() : serverText.trim();

        // Fallback to extracting server name from the URL if necessary
        if (serverName === 'Unknown' || serverName === 's2.googleusercontent.com') {
          const parsedUrl = new URL(decodedUrl);
          serverName = parsedUrl.hostname ? parsedUrl.hostname.replace('www.', '') : 'Unknown';
        }

        servers.push({ serverName, quality, url: decodedUrl, type: 'streaming', subtitle: 'AR' });
      } catch (err) {
        console.error('Error extracting streaming server:', err);
      }
    });

    // Extract download servers
    $('table.table tbody tr').each((i, element) => {
      try {
        const faviconUrl = $(element).find('td div.server span.favicon').attr('data-src');
        let serverName = faviconUrl ? new URL(faviconUrl).hostname.replace('www.', '') : 'Unknown';
        const encodedUrl = $(element).find('a.download-link').attr('data-url');
        const decodedUrl = atob(encodedUrl);
        const quality = $(element).find('td span.badge').text().trim() || 'Unknown'; // Extract quality from the badge

        // Fallback to extracting server name from the URL if favicon URL is not helpful
        if (serverName === 'Unknown' || serverName === 's2.googleusercontent.com') {
          const parsedUrl = new URL(decodedUrl);
          serverName = parsedUrl.hostname ? parsedUrl.hostname.replace('www.', '') : 'Unknown';
        }

        servers.push({ serverName, quality, url: decodedUrl, type: 'download', subtitle: 'AR' });
      } catch (err) {
        console.error('Error extracting download server:', err);
      }
    });

    return servers;
  } catch (error) {
    console.error('Error scraping AnimeLuxe with Puppeteer:', error.message);
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

module.exports = { scrapeAnimeLuxeWithPuppeteer };