const puppeteer = require('puppeteer-extra');
const { getRandomUserAgent } = require('./userAgents');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createBrowserPool = async (size) => {
  const browsers = [];
  for (let i = 0; i < size; i++) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });
    browsers.push(browser);
  }
  return browsers;
};

const closeBrowserPool = async (browserPool) => {
  for (const browser of browserPool) {
    await browser.close();
  }
};

const getFinalUrlWithPuppeteer = async (url, referer, retries = 3) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  });
  const page = await browser.newPage();
  try {
    await page.setUserAgent(getRandomUserAgent());
    await page.setExtraHTTPHeaders({ 'Referer': referer });
    await page.setRequestInterception(true);
    
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Replace page.waitForTimeout with a custom delay function
    await delay(2000); // Reduce delay to 2 seconds

    const downloadButton = await page.$('#download-button');
    if (downloadButton) {
      await downloadButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    }

    return page.url();
  } catch (error) {
    console.error('Error during Puppeteer navigation:', error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await page.close();
      await delay(1000); // Reduce delay to 1 second
      return getFinalUrlWithPuppeteer(url, referer, retries - 1);
    } else {
      throw error;
    }
  } finally {
    await page.close();
    await browser.close();
  }
};

module.exports = {
  createBrowserPool,
  closeBrowserPool,
  getFinalUrlWithPuppeteer,
  delay // Export delay function
};