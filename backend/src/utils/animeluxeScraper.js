const { scrapeAnimeLuxeWithPuppeteer } = require('./animeluxePuppeteerScraper');
const { scrapeAnimeLuxeWithAxios } = require('./animeluxeAxiosScraper');

const scrapeAnimeLuxe = async (pageUrl) => {
  try {
    console.log('Trying Axios...');
    return await scrapeAnimeLuxeWithAxios(pageUrl);
  } catch (error) {
    console.error('Axios method failed:', error.message);
    console.log('Trying Puppeteer as fallback...');
    try {
      return await scrapeAnimeLuxeWithPuppeteer(pageUrl);
    } catch (fallbackError) {
      console.error('Puppeteer method also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
};

module.exports = { scrapeAnimeLuxe };