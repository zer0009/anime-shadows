const express = require('express');
const animeRoutes = require('./routes/anime');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const cors = require('cors');

require('./db/mongoose')

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json())
app.use('/uploads', express.static('uploads'));

// app.use(express.static('uploads'));
// app.use('/images', express.static('uploads'));


app.use(userRoutes)
app.use('/animes', animeRoutes);
app.use('/categories', categoryRoutes);
app.use(adminRoutes);


module.exports = app