import api from "./api";

export const getAllPokemons = async () => {
  try {
    const response = await api.get("pokemon/");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPokemonToUser = async () => {
  try {
    const response = await api.get("pokemon/pokemons");
    return response.data;
  }catch (error) {
    throw error.response.data;
  }
}

export const createPokemon = async (pokemon) => {
  try {


    const response = await api.post("pokemon/createPokemon", pokemon, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    // Manejo de errores
    throw error.response?.data || { message: "Error desconocido" };
  }
};

export const updatePokemon = async (pokemonId, pokemon) => {
  try {
    const response = await api.put(
      `pokemon/updatePokemon/${pokemonId}`,
      pokemon,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePokemon = async (pokemonId) => {
  try {
    const response = await api.delete(`pokemon/deletePokemon/${pokemonId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
