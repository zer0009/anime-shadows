import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://animeshadows.xyz'; // Replace with your actual domain
const API_URL = 'https://app.animeshadows.xyz/api'; 
const API_URL_LOCAL = 'http://localhost:5000/api'; 

async function fetchSitemapData() {
    try {
        const response = await axios.get(`${API_URL}/anime/sitemap-data`, { timeout: 10000 });
        return response.data;
    } catch (error) {
        console.error('Error fetching sitemap data:', error.message);
        return null;
    }
}

function formatDate(date) {
    return new Date(date).toISOString();
}

async function generateSitemap() {
    const sitemapData = await fetchSitemapData();
    
    if (!sitemapData) {
        console.error('Failed to fetch sitemap data');
        return;
    }

    const { animes, genres, types } = sitemapData;

    const staticPages = [
        { url: '', changefreq: 'daily', priority: '1.0' },
        { url: '/anime-list', changefreq: 'daily', priority: '0.8' },
        { url: '/movie-list', changefreq: 'daily', priority: '0.8' },
        { url: '/season-anime', changefreq: 'daily', priority: '0.7' },
        { url: '/search', changefreq: 'weekly', priority: '0.6' },
        // Remove 404 and offline pages from sitemap
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.map(page => `
    <url>
        <loc>${BASE_URL}${page.url}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('')}
    ${animes.map(anime => `
    <url>
        <loc>${BASE_URL}/anime/${anime.slug}</loc>
        <lastmod>${formatDate(anime.updatedAt)}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
    ${genres.map(genre => `
    <url>
        <loc>${BASE_URL}/filter/genre/${genre.slug}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`).join('')}
    ${types.map(type => `
    <url>
        <loc>${BASE_URL}/filter/type/${type.slug}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>`).join('')}
</urlset>`;

    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap);
    console.log('Sitemap generated successfully at', sitemapPath);
}

async function generateRobotsTxt() {
    const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`
;

    const robotsTxtPath = path.join(__dirname, 'public', 'robots.txt');
    await fs.writeFile(robotsTxtPath, robotsTxt);
    console.log('robots.txt generated successfully at', robotsTxtPath);
}

async function main() {
    try {
        await generateSitemap();
        await generateRobotsTxt();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();