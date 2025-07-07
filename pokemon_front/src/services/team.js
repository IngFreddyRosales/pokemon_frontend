import api from "./api";

export const getTeams = async () => {
    try {
        const response = await api.get("team/");
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

export const createTeam = async (team) => {
    try {
        const response = await api.post("team/createTeam", team)
        return response.data;
    }catch (error) {
        // Manejo de errores
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export const updateTeam = async (teamId, team) => {
    try{
        const response = await api.put(`team/updateTeam/${teamId}`, team);
        return response.data;
    }catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}

export const deleteTeam = async (teamId) => {
    try {
        const response = await api.delete(`team/deleteTeam/${teamId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error desconocido" };
    }
}