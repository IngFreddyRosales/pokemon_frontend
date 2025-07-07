import api from './api';


export const getAllItems = async () => {
    try {
        const response = await api.get('item/');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const createItem = async (data) => {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        if (data.image) {
            formData.append('image', data.image);
        }
        
        const response = await api.post('item/createItem', formData, {  
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

export const updateItem = async (itemId, formData) => {
    try {
        const response = await api.put(`item/updateItem/${itemId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteItem = async (itemId) => {
    try {
        const response = await api.delete(`item/deleteItem/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}