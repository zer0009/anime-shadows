const express = require('express');
const animeRoutes = require('./routes/anime');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
require('./db/mongoose')

const app = express()

app.use(express.json())

app.use(userRoutes)
app.use('/animes', animeRoutes);
app.use('/categories', categoryRoutes);
app.use(adminRoutes);


module.exports = app