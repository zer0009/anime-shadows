const { scrapeAnimeLuxe } = require('./animeluxeScraper');

const testUrl = 'https://animeluxe.org/episodes/hazurewaku-no-joutai-ijou-skill-de-saikyou-ni-natta-ore-ga-subete-wo-juurin-suru-made-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-1/';

scrapeAnimeLuxe(testUrl)
  .then(servers => {
    console.log('Scraped servers:', servers);
  })
  .catch(error => {
    console.error('Error:', error);
  });