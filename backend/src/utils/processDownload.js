const axios = require('axios');
const { getFinalUrlWithPuppeteer, delay } = require('./puppeteerUtils'); // Import delay function
const { getRandomUserAgent } = require('./userAgents');

const processDownloadUrls = async (browserPool, customUrls, $, referer) => {
  const downloadServers = [];
  const queue = Object.entries(customUrls);
  const concurrency = 20; // Increase concurrency to 20

  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const promises = batch.map(async ([key, value]) => {
      const serverName = $(`a[data-key="${key}"] .notice`).text().trim();
      const quality = key.startsWith('dsd') ? 'SD' : key.startsWith('dhd') ? 'HD' : key.startsWith('dfhd') ? 'FHD' : 'HD';
      try {
        const finalUrl = await getFinalUrlWithRedirect(value, referer);
        console.log(`Found download server: ${serverName}, ${finalUrl}, ${quality}`);
        return { serverName, quality, url: finalUrl, type: 'download' };
      } catch (error) {
        console.error(`Error processing download URL for ${serverName} with Axios:`, error);
        try {
          const finalUrl = await getFinalUrlWithPuppeteer(value, referer);
          console.log(`Found download server with Puppeteer: ${serverName}, ${finalUrl}, ${quality}`);
          return { serverName, quality, url: finalUrl, type: 'download' };
        } catch (puppeteerError) {
          console.error(`Error processing download URL for ${serverName} with Puppeteer:`, puppeteerError);
          return null;
        }
      }
    });

    const results = await Promise.all(promises);
    downloadServers.push(...results.filter(Boolean));

    await delay(Math.random() * 200 + 300); // Reduce delay between 0.3-0.5 seconds
  }

  return downloadServers;
};

const getFinalUrlWithRedirect = async (url, referer, retries = 3) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Referer': referer,
      },
      maxRedirects: 5,
    });
    return response.request.res.responseUrl;
  } catch (error) {
    console.error('Error following redirect:', error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await delay(500); // Reduce delay to 0.5 seconds
      return getFinalUrlWithRedirect(url, referer, retries - 1);
    } else {
      return getFinalUrlWithPuppeteer(url, referer, retries);
    }
  }
};

module.exports = { processDownloadUrls };