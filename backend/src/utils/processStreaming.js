const { getFinalStreamingUrlWithPuppeteer } = require('./puppeteerUtils');
const { qualityMap } = require('./scraperUtils');

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

module.exports = { processStreamingUrls };