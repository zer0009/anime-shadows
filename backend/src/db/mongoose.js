const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectionURL = process.env.MONGODB_URI;

if (!connectionURL) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

const connectWithRetry = () => {
    mongoose.connect(connectionURL, {
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    });
};

// Initial connection
connectWithRetry();

// Handle connection errors after initial connection
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    if (error.name === 'MongoNetworkError') {
        console.log('Attempting to reconnect to MongoDB...');
        setTimeout(connectWithRetry, 5000);
    }
});

// Handle successful reconnection
mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to MongoDB');
});

// Handle disconnection
mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// Close the Mongoose connection if the Node process ends
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed due to application termination');
        process.exit(0);
    } catch (error) {
        console.error('Error closing Mongoose connection:', error);
        process.exit(1);
    }
});

module.exports = mongoose;