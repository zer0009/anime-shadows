const express = require('express');
// const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')

const animeRoutes = require('./routes/animeRoutes');
const typeRoutes = require('./routes/typeRoutes');
const genreRoutes = require('./routes/genreRoutes');
const seasonRoutes = require('./routes/seasonRoutes');


const cors = require('cors');

require('./db/mongoose')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json())



app.use('/uploads', express.static('uploads'));

// app.use(express.static('uploads'));
// app.use('/images', express.static('uploads'));

app.use('/api/anime', animeRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/seasons', seasonRoutes);


app.use('/api/user',userRoutes)
// app.use('/animes', animeRoutes);
// app.use('/categories', categoryRoutes);
app.use(adminRoutes);


module.exports = app