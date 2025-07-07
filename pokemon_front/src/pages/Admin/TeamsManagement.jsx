import AdminSideBar from '../../components/adminSideBar';
import Header from '../../components/header';
import { useEffect, useState } from 'react';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../services/team';
import { addPokemonToTeam } from '../../services/teamPokemon';
import { getPokemonToUser } from '../../services/pokemon';
import { Table, Spinner, Button, Alert, Modal, Form, Placeholder } from 'react-bootstrap';


export default function TeamsManagement() {

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [editingTeam, setEditingTeam] = useState(null);

    const [showPokemonModal, setShowPokemonModal] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [pokemons, setPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState('');
    const [nickname, setNickname] = useState('');
    const [pokemonModalLoading, setPokemonModalLoading] = useState(false);
    const [pokemonModalError, setPokemonModalError] = useState(null);

    // filtro  y actualización del estado pokemons
    const [pokemonSearch, setPokemonSearch] = useState('');
    const [filteredPokemons, setFilteredPokemons] = useState([]);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            setError(null);
            const teamsData = await getTeams();
            console.log('Fetched teams:', teamsData);
            setTeams(teamsData);
        } catch (err) {
            setError('Error al cargar los equipos');
            console.error('Error fetching teams:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPokemons = async () => {
        try {
            const pokemonsData = await getPokemonToUser();
            setPokemons(pokemonsData);
        } catch (err) {
            setPokemonModalError('Error al cargar los Pokémon');
            console.error('Error fetching pokemons:', err);
        }
    }

    useEffect(() => {
        fetchTeams();
        fetchPokemons();
    }, []);

    const handlePokemonSearch = (e) => {
        const value = e.target.value;
        setPokemonSearch(value);
        setSelectedPokemon('');
        if (value.length === 0) {
            setFilteredPokemons([])
            return;
        }

        const filtered = pokemons.filter(p =>
            p.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPokemons(filtered.slice(0, 10)); // Limitar a 10 resultados
    }

    const handleSelectSuggestion = (pokemon) => {
        setSelectedPokemon(pokemon.name);
        setPokemonSearch(pokemon.name);
        setFilteredPokemons([]);
    }

    // Abrir modal para crear o editar
    const handleShowModal = (team = null) => {
        setEditingTeam(team);
        setTeamName(team ? team.name : '');
        setModalError(null);
        setShowModal(true);
    };

    const handleShowPokemonModal = async (teamId) => {
        setSelectedTeamId(teamId);
        setPokemonModalError(null);
        setNickname('');
        setSelectedPokemon('');
        setShowPokemonModal(true);
        try {
            const pokemonsData = await getPokemonToUser();
            setPokemons(pokemonsData);
        } catch (err) {
            setPokemonModalError(err.message, 'Error al cargar los pokémon');
        }
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTeam(null);
        setTeamName('');
        setModalError(null);
    };

    const handleClosePokemonModal = () => {
        setShowPokemonModal(false);
        setSelectedTeamId(null);
        setPokemons([]);
        setSelectedPokemon('');
        setNickname('');
        setPokemonModalError(null);
    };

    // Crear o actualizar equipo
    const handleSaveTeam = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setModalError(null);
        try {
            if (editingTeam) {
                await updateTeam(editingTeam.id, { name: teamName });
            } else {
                await createTeam({ name: teamName });
            }
            await fetchTeams();
            handleCloseModal();
        } catch (err) {
            setModalError(err.message || 'Error al guardar el equipo');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('¿Estás seguro de eliminar este equipo?')) return;
        try {
            setLoading(true);
            await deleteTeam(teamId);
            await fetchTeams();
        } catch (err) {
            setError(err.message || 'Error al eliminar el equipo');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPokemonToTeam = async (e) => {
        e.preventDefault();
        setPokemonModalLoading(true);
        setPokemonModalError(null);
        try {
            const pokemonObj = pokemons.find(p => p.name === selectedPokemon);
            if (!pokemonObj) throw new Error('Selecciona un Pokémon válido');
            await addPokemonToTeam(selectedTeamId, {
                pokemon_id: pokemonObj.id,
                nickname
            });
            handleClosePokemonModal();
            fetchTeams();
        } catch (err) {
            setPokemonModalError(err.message || 'Error al agregar el Pokémon');
        } finally {
            setPokemonModalLoading(false);
        }
    };


    return (
        <>
            <Header />
            <div className="container-fluid mt-5 pt-5">
                <div className="row">
                    <div className="col-12 col-md-3 col-lg-2 p-0">
                        <AdminSideBar />
                    </div>
                    <div className="col-12 col-md-9 col-lg-10">
                        <h1>Pokedex</h1>
                        <p>Arma tu equipo Pokemon!</p>

                        <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
                            Crear equipo
                        </Button>

                        {loading ? (
                            <div className="d-flex align-items-center">
                                <Spinner animation="border" size="sm" className="me-2" />
                                Cargando equipos...
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <div>
                                <h2 className="mb-3">Tus equipos</h2>
                                {teams.length === 0 ? (
                                    <p>No tienes equipos creados.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nombre</th>
                                                    <th>Pokemon</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {teams.map(team => (
                                                    <tr key={team.id}>
                                                        <td>{team.id}</td>
                                                        <td>{team.name}</td>
                                                        <td>
                                                            {team.pokemons && team.pokemons.length > 0 ? (
                                                                team.pokemons.map((tp, idx) => (

                                                                    <img
                                                                        key={idx}
                                                                        src={

                                                                            tp.pokemon.image.startsWith('http')
                                                                                ? tp.pokemon.image
                                                                                : `${window.location.origin}${tp.pokemon.image}`
                                                                        }
                                                                        alt={tp.pokemon.name}
                                                                        title={tp.nickname || tp.pokemon.name}
                                                                        style={{ width: 62, height: 62, marginRight: 4 }}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <span>Sin Pokémon</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Button
                                                                variant="warning"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => handleShowModal(team)}
                                                            >
                                                                Cambiar nombre a equipo
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteTeam(team.id)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                            <Button
                                                                variant='success'
                                                                size="sm"
                                                                className="ms-2"
                                                                onClick={() => handleShowPokemonModal(team.id)}
                                                            >
                                                                Agregar pokemon
                                                            </Button>
                                                            <Button
                                                                variant="info"
                                                                size="sm"
                                                                className="ms-2"
                                                                // pasar el id del equipo a la página de ver equipo
                                                                onClick={() => window.location.href = `/userDashboard/teamPokemonManagement/${team.id}`}
                                                            >
                                                                Ver Equipo
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Modal para crear/editar equipo */}
                        <Modal show={showModal} onHide={handleCloseModal} centered>
                            <Form onSubmit={handleSaveTeam}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {editingTeam ? 'Editar nombre' : 'Crear equipo'}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group>
                                        <Form.Label>Nombre del equipo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teamName}
                                            onChange={e => setTeamName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </Form.Group>
                                    {modalError && (
                                        <Alert variant="danger" className="mt-2">
                                            {modalError}
                                        </Alert>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={modalLoading}>
                                        {modalLoading ? (
                                            <Spinner animation="border" size="sm" className="me-2" />
                                        ) : null}
                                        {editingTeam ? 'Guardar cambios' : 'Crear'}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>

                        <Modal show={showPokemonModal} onHide={handleClosePokemonModal} centered>
                            <Form onSubmit={handleAddPokemonToTeam}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Agregar Pokémon al equipo</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="mb-3" style={{ position: 'relative' }}>
                                        <Form.Label>Pokémon</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={pokemonSearch}
                                            onChange={handlePokemonSearch}
                                            placeholder="Busca un Pokémon"
                                            autoComplete="off"
                                            required
                                        />
                                        {filteredPokemons.length > 0 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    zIndex: 10,
                                                    background: 'white',
                                                    border: '1px solid #ccc',
                                                    width: '100%',
                                                    maxHeight: 200,
                                                    overflowY: 'auto'
                                                }}
                                            >
                                                {filteredPokemons.map(pokemon => (
                                                    <div
                                                        key={pokemon.id}
                                                        style={{ padding: 8, cursor: 'pointer' }}
                                                        onClick={() => handleSelectSuggestion(pokemon)}
                                                    >
                                                        {pokemon.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Apodo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={nickname}
                                            onChange={e => setNickname(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    {pokemonModalError && (
                                        <Alert variant="danger" className="mt-2">
                                            {pokemonModalError}
                                        </Alert>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClosePokemonModal}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={pokemonModalLoading}>
                                        {pokemonModalLoading ? (
                                            <Spinner animation="border" size="sm" className="me-2" />
                                        ) : null}
                                        Agregar
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div >
        </>
    );
}