const { scrapeWitanimeWithPuppeteer } = require('./witanimePuppeteerScraper');
const { scrapeWitanimeWithAxios } = require('./witanimeAxiosScraper');

const scrapeWitanime = async (pageUrl) => {
  try {
    console.log('Trying Axios...');
    return await scrapeWitanimeWithAxios(pageUrl);
  } catch (error) {
    console.error('Axios method failed:', error.message);
    // console.log('Trying Puppeteer as fallback...');
    // try {
    //   return await scrapeWitanimeWithPuppeteer(pageUrl);
    // } catch (fallbackError) {
    //   console.error('Puppeteer method also failed:', fallbackError.message);
    //   throw fallbackError;
    // }
  }
};

module.exports = { scrapeWitanime };