const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Cluster } = require('puppeteer-cluster');
const { getRandomUserAgent } = require('./userAgents');
const { qualityMap } = require('./scraperUtils');

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    // Extract streaming servers
    const customEmbedUrlsScript = $('script:contains("var customEmbedUrls")').html();
    if (customEmbedUrlsScript) {
      const customEmbedUrlsMatch = customEmbedUrlsScript.match(/var customEmbedUrls = ({.*});/);
      if (customEmbedUrlsMatch) {
        const customEmbedUrls = JSON.parse(customEmbedUrlsMatch[1]);
        const cluster = await createCluster(10); // Increase cluster size to 10

        const streamingServers = await processStreamingUrls(cluster, customEmbedUrls, $, url);
        servers.push(...streamingServers);

        await cluster.idle();
        await cluster.close();
      }
    }

    // Extract download servers
    const customUrlsScript = $('script:contains("var customUrls")').html();
    if (customUrlsScript) {
      const customUrlsMatch = customUrlsScript.match(/var customUrls = ({.*});/);
      if (customUrlsMatch) {
        const customUrls = JSON.parse(customUrlsMatch[1]);
        const browserPool = await createBrowserPool(10); // Increase browser pool size to 10

        const downloadServers = await processDownloadUrls(browserPool, customUrls, $, url);
        servers.push(...downloadServers);

        await closeBrowserPool(browserPool); // Close all browser instances in the pool
      }
    }

    console.log('Scraped servers:', servers);
    return servers;
  } catch (error) {
    console.error('Error scraping Witanime with Axios:', error);
    throw error;
  }
};

const processStreamingUrls = async (cluster, customEmbedUrls, $, referer) => {
  const streamingServers = [];
  const queue = Object.entries(customEmbedUrls);

  await Promise.all(queue.map(([key, value]) => {
    return cluster.execute({ key, value, referer, $ }, async ({ page, data }) => {
      const { key, value, referer, $ } = data;
      const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
      const quality = serverName.includes('-') ? qualityMap[serverName.split('-').pop().trim()] || 'HD' : 'HD';
      try {
        const finalUrl = await getFinalStreamingUrlWithPuppeteer(page, value, referer);
        console.log(`Found streaming server: ${serverName}, ${finalUrl}, ${quality}`);
        streamingServers.push({ serverName, quality, url: finalUrl, type: 'streaming' });
      } catch (error) {
        console.error(`Error processing streaming URL for ${serverName}:`, error);
      }
    });
  }));

  return streamingServers;
};

const getFinalStreamingUrlWithPuppeteer = async (page, url, referer, retries = 3) => {
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

    const iframe = await page.$('iframe');
    if (iframe) {
      const iframeUrl = await iframe.evaluate(iframe => iframe.src);
      return iframeUrl;
    }

    return page.url();
  } catch (error) {
    console.error('Error during Puppeteer navigation:', error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await delay(1000); // Reduce delay to 1 second
      return getFinalStreamingUrlWithPuppeteer(page, url, referer, retries - 1);
    } else {
      throw error;
    }
  }
};

const processDownloadUrls = async (browserPool, customUrls, $, referer) => {
  const downloadServers = [];
  const queue = Object.entries(customUrls);
  const concurrency = 10; // Increase concurrency to 10

  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const promises = batch.map(async ([key, value]) => {
      const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
      const quality = key.startsWith('dsd') ? 'SD' : key.startsWith('dhd') ? 'HD' : key.startsWith('dfhd') ? 'FHD' : 'HD';
      try {
        const browser = await getBrowserFromPool(browserPool);
        const finalUrl = await getFinalUrlWithPuppeteer(browser, value, referer);
        console.log(`Found download server: ${serverName}, ${finalUrl}, ${quality}`);
        return { serverName, quality, url: finalUrl, type: 'download' };
      } catch (error) {
        console.error(`Error processing download URL for ${serverName}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    downloadServers.push(...results.filter(Boolean));

    await delay(Math.random() * 500 + 500); // Reduce delay between 0.5-1 seconds
  }

  return downloadServers;
};

const getFinalUrlWithPuppeteer = async (browser, url, referer, retries = 3) => {
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
    await new Promise(resolve => setTimeout(resolve, 2000)); // Reduce delay to 2 seconds

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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Reduce delay to 1 second
      return getFinalUrlWithPuppeteer(browser, url, referer, retries - 1);
    } else {
      throw error;
    }
  } finally {
    await page.close();
  }
};

const createCluster = async (size) => {
  return Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: size,
    puppeteerOptions: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    }
  });
};

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

const getBrowserFromPool = async (browserPool) => {
  return browserPool[Math.floor(Math.random() * browserPool.length)];
};

const closeBrowserPool = async (browserPool) => {
  for (const browser of browserPool) {
    await browser.close();
  }
};

module.exports = { scrapeWitanimeWithAxios };