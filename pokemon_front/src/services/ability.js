import api from './api';

export const getAllAbilitiesFromPokemon = async (pokemonId) => {
    try{
        const response = await api.get(`ability/${pokemonId}`);
        return response.data;
    }catch (error) {
        throw error.response.data;
    }

}