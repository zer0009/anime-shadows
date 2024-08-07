const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const atob = require('atob');

const scrapeAnimeLuxe = async (pageUrl) => {
  let browser;
  let page;
  try {
    console.log(`Fetching URL: ${pageUrl}`);
    browser = await puppeteer.launch({
      headless: true, // Ensure headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't work in Windows
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
      timeout: 60000, // Reduce timeout to 60 seconds
    });

    // Wait for the episode servers list or download links to appear
    await page.waitForSelector('.server-list li a, table.table tbody tr', { timeout: 60000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const servers = [];

    // Extract streaming servers
    $('.server-list li a').each((i, element) => {
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
        const encodedUrl = $(element).find('a.download-link').attr('data-url');
        const decodedUrl = atob(encodedUrl);
        const serverName = new URL($(element).find('span.favicon').attr('data-src')).hostname.replace('www.', '');
        const quality = $(element).find('span.badge').text().trim();
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

module.exports = { scrapeAnimeLuxe };