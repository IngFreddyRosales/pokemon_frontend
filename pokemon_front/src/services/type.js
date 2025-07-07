import api from './api';

export const getAllTypes = async () => {
    try {
        const response = await api.get('type/');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const createType = async (typeData) => {
    try {
        const response = await api.post('type/createType', typeData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const updateType = async (typeId, typeData) => {
    try {
        const response = await api.put(`type/updateType/${typeId}`, typeData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const deleteType = async (typeId) => {
    try {
        const response = await api.delete(`type/deleteType/${typeId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
