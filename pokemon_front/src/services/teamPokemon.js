import api from "./api";

export const getTeamPokemons = async (teamId) => {
    try {
        const response = await api.get(`teamPokemon/${teamId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export const getPokemonFromTeam = async (pokemonId) => {
    try {
        const response = await api.get(`teamPokemon/pokemon/${pokemonId}`);
        return response.data;
    }catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export const addPokemonToTeam = async (teamId, pokemon) => {
    try {
        const response = await api.post(`teamPokemon/createTeamPokemon/${teamId}`, pokemon);
        return response.data;
    }catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export const deletePokemonFromTeam = async (pokemonId) => {
    try {
        const response = await api.delete(`teamPokemon/deleteTeamPokemon/${pokemonId}`);
        return response.data;
    }catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export const updatePokemonFromTeam = async (pokemonId, formData) => {
    try {
        const response = await api.patch(`teamPokemon/updateTeamPokemon/${pokemonId}`, formData);
        console.log("Respuesta del servidor:", response.data);

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}