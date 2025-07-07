import api from './api';

export const getAllNatures = async () => {
    try{
        const response = await api.get('nature/');
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}