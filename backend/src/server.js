const app = require('./app')

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});