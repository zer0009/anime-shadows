const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { getRandomUserAgent } = require('./userAgents');

const scrapeGogoanime = async (url) => {
  try {
    // Fetch the initial HTML content using Axios with a random user agent
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
      }
    });

    // Load the HTML content into Cheerio
    const $ = cheerio.load(data);

    // Try to extract the video URL
    let videoUrl = $('div.play-video iframe').attr('src');
    console.log('videoUrl 0', videoUrl);


    // If videoUrl is not found, use Puppeteer to handle dynamic content
    if (!videoUrl) {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(getRandomUserAgent());
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Get the page content
      const content = await page.content();
      const $ = cheerio.load(content);

      // Extract the video URL again
      videoUrl = $('div.play-video iframe').attr('src');
      console.log('videoUrl 1', videoUrl);
      await browser.close();
    }

    if (!videoUrl) {
      throw new Error('Video URL not found');
    }

    // Return an array with a single server object to match the expected format
    return [{
      serverName: 'Gogoanime',
      quality: '720p',
      url: videoUrl,
      type: 'streaming',
      subtitle: 'EN'
    }];
  } catch (error) {
    console.error('Error scraping Gogoanime:', error);
    throw error;
  }
};

module.exports = { scrapeGogoanime };