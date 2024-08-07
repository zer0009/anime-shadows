const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const atob = require('atob');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const qualityMap = {
  'multi': 'multi',
  'HD': '720p',
  'SD': '480p',
  'FHD': '1080p',
  'الجودة المتوسطة SD': '480p',
  'الجودة العالية HD': '720p',
  'الجودة الخارقة FHD': '1080p'
};

const scrapeWithPuppeteer = async (pageUrl, streamingSelector, downloadSelector, streamingType = 'streaming', downloadType = 'download') => {
  let browser;
  let page;
  try {
    console.log(`Fetching URL: ${pageUrl}`);
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
      timeout: 90000,
    });

    await page.waitForSelector(streamingSelector, { timeout: 90000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const servers = [];

    // Extract streaming servers
    $(streamingSelector).each((i, element) => {
      try {
        let serverName = $(element).text().trim();
        const encodedUrl = $(element).attr('data-url');
        const decodedUrl = atob(encodedUrl);
        let quality = 'HD';

        if (serverName.includes('-')) {
          const parts = serverName.split('-');
          serverName = parts[0].trim();
          quality = parts[1].trim();
        }

        quality = qualityMap[quality] || quality;

        console.log(`Found ${streamingType} server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: streamingType });
      } catch (err) {
        console.error(`Error extracting ${streamingType} server:`, err);
      }
    });

    // Extract download servers
    $(downloadSelector).each((i, element) => {
      try {
        const serverName = $(element).find('span.notice').text().trim();
        const encodedUrl = $(element).attr('data-url');
        const decodedUrl = atob(encodedUrl);
        let quality = $(element).closest('ul.quality-list').find('li').first().text().trim();

        quality = qualityMap[quality] || quality;

        console.log(`Found ${downloadType} server: ${serverName}, ${decodedUrl}, ${quality}`);
        servers.push({ serverName, quality, url: decodedUrl, type: downloadType });
      } catch (err) {
        console.error(`Error extracting ${downloadType} server:`, err);
      }
    });

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping with Puppeteer:', error.message);
    console.error('Error details:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { scrapeWithPuppeteer };