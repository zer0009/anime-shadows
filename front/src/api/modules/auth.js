import API from '../client';

export const loginUser = async (credentials) => {
    try {
        const response = await API.post('/user/login', credentials);
        return {
            token: response.data.token,
            user: {
                username: response.data.username,
                role: response.data.role,
            },
        };
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await API.post('/user/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (credentials) => {
    try {
        const response = await API.post('/user/register', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};
