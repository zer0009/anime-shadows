# Anime Shadows

A modern, full-stack anime streaming platform built with React and Express.js, featuring a comprehensive anime database, user authentication, and administrative tools.

## 🎯 Project Overview

Anime Shadows is a complete anime streaming platform that provides users with:

- **Extensive Anime Library**: Browse and discover anime series and movies
- **User Authentication**: Secure registration and login system
- **Personal Features**: Favorites, watch history, and user profiles
- **Search & Filter**: Advanced search and filtering capabilities
- **Admin Dashboard**: Content management and moderation tools
- **Responsive Design**: Optimized for desktop and mobile devices
- **Multi-language Support**: Internationalization with i18next
- **SEO Optimized**: Server-side rendering and sitemap generation

## 🏗️ Architecture

- **Frontend**: React 18 with Vite, React Router, Material-UI
- **Backend**: Express.js with MongoDB
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Netlify (Frontend) + Heroku (Backend)
- **Security**: Helmet, CORS, Rate limiting, XSS protection

## 📋 Prerequisites

- Node.js (v20.x or higher)
- npm or yarn
- MongoDB database
- Cloudinary account (for image storage)

## 🚀 Installation Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd anime-shadows
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Frontend Setup

```bash
cd front
npm install
```

### 4. Backend Setup

```bash
cd ../backend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/anime-shadows
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anime-shadows

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `front` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google Analytics (optional)
VITE_REACT_APP_GA_MEASUREMENT_ID=your-ga-measurement-id
```

### Database Setup

1. **Local MongoDB**: Install MongoDB locally or use MongoDB Atlas
2. **Database Initialization**: The application will automatically create collections on first run
3. **Admin User**: Use the admin registration endpoint to create the first admin user

## 🎮 Usage Guide

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd front
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Mode

#### Build Frontend

```bash
cd front
npm run build
```

#### Start Production Server

```bash
cd backend
npm start
```

### Available Scripts

#### Root Directory
- `npm start`: Start the backend server

#### Frontend (`/front`)
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run generate-sitemap`: Generate sitemap

#### Backend (`/backend`)
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run update-slugs`: Update anime slugs

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### User Registration
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### User Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Anime Endpoints

#### Get All Anime
```http
GET /api/anime
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- search: string
- genre: string
- type: string
- status: string
```

#### Get Anime by Slug
```http
GET /api/anime/:slug
```

#### Get Popular Anime
```http
GET /api/anime/popular
```

### Episode Endpoints

#### Get Episodes for Anime
```http
GET /api/episodes/anime/:animeId
```

#### Get Episode by Slug
```http
GET /api/episodes/:episodeSlug
```

### Genre & Type Endpoints

#### Get All Genres
```http
GET /api/genres
```

#### Get All Types
```http
GET /api/types
```

### Season Endpoints

#### Get Seasonal Anime
```http
GET /api/seasons/:year/:season
```

### Admin Endpoints (Requires Authentication)

#### Create Anime
```http
POST /api/admin/anime
Authorization: Bearer <token>
Content-Type: application/json
```

#### Update Anime
```http
PUT /api/admin/anime/:id
Authorization: Bearer <token>
```

#### Delete Anime
```http
DELETE /api/admin/anime/:id
Authorization: Bearer <token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## 🤝 Contribution Guidelines

### Getting Started

1. **Fork the Repository**: Create a fork of the project
2. **Create a Branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**: Implement your feature or bug fix
4. **Test**: Ensure all tests pass and add new tests if needed
5. **Commit**: Use conventional commit messages
   ```bash
   git commit -m "feat: add new anime search feature"
   ```
6. **Push**: Push your changes to your fork
7. **Pull Request**: Create a pull request with a clear description

### Code Style

- **Frontend**: Follow React best practices and use ESLint configuration
- **Backend**: Follow Node.js conventions and use consistent formatting
- **Commits**: Use conventional commit format (feat, fix, docs, style, refactor, test, chore)

### Development Guidelines

- Write clear, self-documenting code
- Add comments for complex logic
- Ensure responsive design for frontend changes
- Test API endpoints thoroughly
- Update documentation for new features
- Follow security best practices

### Reporting Issues

- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include environment information
- Add screenshots for UI issues

### Feature Requests

- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Discuss implementation approach

## 📄 License Information

This project is licensed under the **ISC License**.

### ISC License

Copyright (c) 2025 Anime Shadows

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

#### CORS Errors
- Update `CORS_ORIGIN` in backend `.env`
- Check frontend API URL configuration

#### Build Errors
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify environment variables

#### Authentication Issues
- Check JWT secret configuration
- Verify token expiration settings
- Clear browser localStorage/cookies

### Performance Optimization

- Enable compression in production
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use image optimization

## 📞 Support

For support and questions:

- **Issues**: GitHub Issues
- **Documentation**: Check this README and inline code comments
- **Community**: Join our community discussions

## 🚀 Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm install --prefix front && npm run build --prefix front`
3. Set publish directory: `front/dist`
4. Configure environment variables in Netlify dashboard

### Backend (Heroku)

1. Create a new Heroku app
2. Set buildpacks for Node.js
3. Configure environment variables
4. Deploy from GitHub or using Heroku CLI

---

**Built with ❤️ by the Anime Shadows Team**