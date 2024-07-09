import API from '../client'; // Ensure you have the correct path to your API setup

export const loginUser = async (credentials) => {
    try {
        const response = await API.post('/user/login', credentials);
        console.log('Login response:', response); // Add detailed logging
        return {
            token: response.data.token,
            user: {
                username: response.data.username,
                role: response.data.role,
            },
        };
    } catch (error) {
        console.error('Error in loginUser:', error); // Add error logging
        throw error; // Re-throw the error to be handled by the caller
    }
};

export const logoutUser = () => {
    const token = localStorage.getItem('token');
    return API.post('/user/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
