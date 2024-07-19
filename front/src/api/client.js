import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const API = axios.create({
    baseURL: apiUrl || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


export default API;