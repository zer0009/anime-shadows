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
        const response = await axios.get(`${API_URL}/anime/sitemap-data`, { 
            timeout: 30000,
            headers: {
                'User-Agent': 'AnimeShadows Sitemap Generator'
            }
        });
        console.log('Sitemap data fetched successfully');
        return response.data;
    } catch (error) {
        console.error('Error fetching sitemap data:', error.message);
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
        } else if (error.request) {
            console.error('No response received:', error.request);
        }
        return null;
    }
}

function formatDate(date) {
    return new Date(date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

function generateUrlTag(loc, lastmod, changefreq, priority) {
    return `
    <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

async function generateSitemap() {
    const sitemapData = await fetchSitemapData();
    
    if (!sitemapData) {
        console.error('Failed to fetch sitemap data');
        return;
    }

    console.log('Sitemap data received:', JSON.stringify(sitemapData, null, 2));

    const { animes = [], genres = [], types = [], recentEpisodes = [], popularAnime = [] } = sitemapData;

    console.log('Animes count:', animes.length);
    console.log('Genres count:', genres.length);
    console.log('Types count:', types.length);
    console.log('Recent episodes count:', recentEpisodes.length);
    console.log('Popular anime count:', popularAnime.length);

    const staticPages = [
        { url: '', changefreq: 'daily', priority: '1.0' },
        { url: '/anime-list', changefreq: 'daily', priority: '0.8' },
        { url: '/movie-list', changefreq: 'daily', priority: '0.8' },
        { url: '/season-anime', changefreq: 'daily', priority: '0.7' },
        { url: '/search', changefreq: 'weekly', priority: '0.6' },
        { url: '/recent-episodes', changefreq: 'hourly', priority: '0.9' },
        { url: '/popular-anime', changefreq: 'daily', priority: '0.8' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.map(page => generateUrlTag(
        `${BASE_URL}${page.url}`,
        formatDate(new Date()),
        page.changefreq,
        page.priority
    )).join('')}
    ${animes.map(anime => generateUrlTag(
        `${BASE_URL}/anime/${anime.slug}`,
        formatDate(anime.updatedAt),
        'weekly',
        '0.6'
    )).join('')}
    ${recentEpisodes.map(episode => {
        if (episode.animeSlug) {
            return generateUrlTag(
                `${BASE_URL}/episode/${episode.animeSlug}-الحلقة-${episode.number}`,
                formatDate(episode.createdAt),
                'daily',
                '0.8'
            );
        }
        console.warn('Skipping episode due to missing animeSlug:', episode);
        return '';
    }).join('')}
    ${popularAnime.map(anime => generateUrlTag(
        `${BASE_URL}/anime/${anime.slug}`,
        formatDate(anime.updatedAt),
        'daily',
        '0.7'
    )).join('')}
    ${genres.map(genre => generateUrlTag(
        `${BASE_URL}/filter/genre/${genre.slug}`,
        formatDate(new Date()),
        'weekly',
        '0.5'
    )).join('')}
    ${types.map(type => generateUrlTag(
        `${BASE_URL}/filter/type/${type.slug}`,
        formatDate(new Date()),
        'monthly',
        '0.5'
    )).join('')}
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

Sitemap: ${BASE_URL}/sitemap.xml
`;

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
        process.exit(1); // Exit with error code
    }
}

main();