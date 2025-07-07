import api from './api';

export const getAllUser = async () => {
    try {
        const response = await api.get('users/')
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`users/${userId}/`, userData);
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}