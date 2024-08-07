const express = require('express');
const { scrapeWitanime } = require('../utils/witanimeScraper');

const router = express.Router();

router.get('/scrape-witanime', async (req, res) => {
  const { url } = req.query;

  try {
    const servers = await scrapeWitanime(url);
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape Witanime' });
  }
});

module.exports = router;