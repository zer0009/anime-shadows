const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectionURL = process.env.MONGODB_URI;

if (!connectionURL) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

mongoose.connect(connectionURL, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});