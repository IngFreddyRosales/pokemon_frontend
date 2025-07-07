import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/header";
import UserSidebar from "../../components/userSideBar";
import { getTeamPokemons, deletePokemonFromTeam } from "../../services/teamPokemon";
import { useParams } from "react-router-dom";

export default function TeamPokemonManagement() {
    const { teamId } = useParams();
    const [teamPokemons, setTeamPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTeamPokemons = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const pokemons = await getTeamPokemons(teamId);
            setTeamPokemons(pokemons);
        } catch (err) {
            setError(err.response?.data?.message || "Error al cargar tus Pokémon");
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchTeamPokemons();
    }, [fetchTeamPokemons]);

    const handleDeletePokemon = async (pokemonId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este Pokémon?")) return;
        try {
            await deletePokemonFromTeam(pokemonId);
            fetchTeamPokemons();
        } catch (err) {
            setError(err.response?.data?.message || "Error al eliminar el Pokémon");
        }
    };

    return (
        <>
            <Header />
            <div className="d-flex">
                <div className="container mt-4">
                    <h2 className="mb-4">Mis Pokémon</h2>

                    {loading && (
                        <div className="text-center my-5">
                            <div className="spinner-border" role="status" />
                        </div>
                    )}

                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && teamPokemons.length === 0 && (
                        <div className="alert alert-info">No tienes Pokémon en tu equipo.</div>
                    )}

                    {!loading && !error && (
                        <div className="row g-4">
                            {teamPokemons.map((p) => (
                                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div
                                        className="card h-100 shadow position-relative"
                                        style={{ transition: 'transform .2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        <div
                                            className="position-relative"
                                            style={{ height: 180, background: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <img
                                                src={
                                                    p.image?.startsWith('http')
                                                        ? p.image
                                                        : `${window.location.origin}${p.image}`
                                                }
                                                alt={p.nickname || p.name}
                                                style={{ objectFit: 'contain', height: 140, maxWidth: '100%' }}
                                            />
                                            {p.itemImage && (
                                                <img
                                                    src={
                                                        p.itemImage.startsWith('http')
                                                            ? p.itemImage
                                                            : `${window.location.origin}${p.itemImage}`
                                                    }
                                                    alt="Item"
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        position: 'absolute',
                                                        bottom: 8,
                                                        right: 16,
                                                        border: '2px solid #fff',
                                                        borderRadius: '50%',
                                                        background: '#fff',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title text-center fw-bold mb-1">
                                                {p.nickname || p.name}
                                            </h5>
                                            <h6 className="card-subtitle text-muted text-center mb-3">
                                                ID: {p.id}
                                            </h6>

                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <div>Habilidad: <strong>{p.ability || '—'}</strong></div>
                                                <div>Naturaleza: <strong>{p.nature || '—'}</strong></div>
                                                <div>Item: <strong>{p.item || '—'}</strong></div>
                                            </div>

                                            <div className="mb-2">
                                                <strong>EVs:</strong>
                                                <div className="small mt-1">
                                                    HP {p.evHp} • Atk {p.evAtk} • Def {p.evDef}
                                                </div>
                                                <div className="small">
                                                    SpA {p.evSpa} • SpD {p.evSpd} • Spe {p.evSpe}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <strong>IVs:</strong>
                                                <div className="small mt-1">
                                                    HP {p.ivHp} • Atk {p.ivAtk} • Def {p.ivDef}
                                                </div>
                                                <div className="small">
                                                    SpA {p.ivSpa} • SpD {p.ivSpd} • Spe {p.ivSpe}
                                                </div>
                                            </div>

                                            <div className="mt-auto d-flex justify-content-between">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => window.location.href = `/teamPokemonManagement/modifyPokemon/${p.id}`}
                                                >
                                                    Modificar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDeletePokemon(p.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
