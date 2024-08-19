import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://animeshadows.xyz'; // Replace with your actual domain
const API_URL = 'https://app.animeshadows.xyz/api'; // Replace with your actual API URL

async function fetchSitemapData() {
    try {
        const response = await axios.get(`${API_URL}/anime/sitemap-data`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sitemap data:', error);
        return null;
    }
}

async function generateSitemap() {
    const sitemapData = await fetchSitemapData();
    
    if (!sitemapData) {
        console.error('Failed to fetch sitemap data');
        return;
    }

    const { animes, genres, types } = sitemapData;

    const staticPages = [
        { url: '', changefreq: 'weekly', priority: '0.8' },
        { url: '/anime-list', changefreq: 'weekly', priority: '0.8' },
        { url: '/movie-list', changefreq: 'weekly', priority: '0.8' },
        { url: '/season-anime', changefreq: 'weekly', priority: '0.7' },
        { url: '/search', changefreq: 'weekly', priority: '0.6' },
        { url: '/404', changefreq: 'weekly', priority: '0.8' },
        { url: '/offline', changefreq: 'weekly', priority: '0.8' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    ${staticPages.map(page => `
    <url>
        <loc>${BASE_URL}${page.url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('')}
    ${animes.map(anime => `
    <url>
        <loc>${BASE_URL}/anime/${anime.id}</loc>
        <lastmod>${new Date(anime.updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
    ${genres.map(genre => `
    <url>
        <loc>${BASE_URL}/filter/genre/${genre.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`).join('')}
    ${types.map(type => `
    <url>
        <loc>${BASE_URL}/filter/type/${type.slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>`).join('')}
</urlset>`;

    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Sitemap generated successfully at', sitemapPath);
}

function generateRobotsTxt() {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

Disallow: /admin/
Disallow: /private/
Disallow: /api/`;

    const robotsTxtPath = path.join(__dirname, 'public', 'robots.txt');
    fs.writeFileSync(robotsTxtPath, robotsTxt);
    console.log('robots.txt generated successfully at', robotsTxtPath);
}

async function main() {
    await generateSitemap();
    generateRobotsTxt();
}

main().catch(console.error);