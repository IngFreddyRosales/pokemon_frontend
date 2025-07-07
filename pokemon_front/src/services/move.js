import api from './api';

export const getAllMoves = async () => {
    try{
        const response = await api.get('move/');
        return response.data;

    }catch (error) {
        throw error.response.data;
    }
}

export const createMove = async (moveData) => {
    try {
        const response = await api.post('move/createMove', moveData); // Ajusta la URL según tu backend
        return response.data; // Asegúrate de que el backend devuelva el nuevo movimiento
    } catch (error) {
        throw error.response.data;
    }
};

export const updateMove = async (moveId, moveData) => {
    try{
        const response = await api.put(`move/updateMove/${moveId}`, moveData);
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

export const deleteMove = async (moveId) => {
    try{
        const response = await api.delete(`move/deleteMove/${moveId}`);
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}