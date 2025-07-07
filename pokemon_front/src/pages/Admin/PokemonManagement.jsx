import AdminSidebar from "../../components/adminSideBar";
import Header from "../../components/header";
import React, { useEffect, useState } from "react";
import { getAllPokemons, createPokemon, updatePokemon, deletePokemon } from "../../services/pokemon";
import { Table, Spinner, Alert, Image, Button, Modal, Form } from "react-bootstrap";
import { getAllTypes } from "../../services/type";
import { getAllMoves } from "../../services/move";
import { getMe } from '../../services/auth';


export default function PokemonManagement() {
    const [pokemons, setPokemons] = useState([]);
    const [types, setTypes] = useState([]);
    const [moves, setMoves] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        type1Id: '',
        type2Id: '',
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
        moveIds: [],
    });

    const fetchPokemons = async () => {
        try {
            const pokemonsData = await getAllPokemons();
            setPokemons(pokemonsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTypes = async () => {
        try {
            const typesData = await getAllTypes();
            setTypes(typesData);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchMoves = async () => {
        try {
            const movesData = await getAllMoves();
            setMoves(movesData);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const user = await getMe();
                if (!user.is_admin) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } catch (err) {
                console.error('Error checking admin status:', err);
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        };
        checkAdmin();
        fetchPokemons();
        fetchTypes();
        fetchMoves();
    }, []);

    const handleMoveChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
        setFormData((prev) => ({
            ...prev,
            moveIds: selectedOptions,
        }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDeleteClick = async (pokemon) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el Pokémon ${pokemon.name}?`)) {
            try {
                await deletePokemon(pokemon.id, { deleted: true });
                await fetchPokemons();
            } catch (err) {
                setError(err.message);
            }
        }
    }

    const handleImageChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0] || null,
        }));
    };

    const handleEditClick = (pokemon) => {
        setSelectedPokemon(pokemon);
        setFormData({
            name: pokemon.name || '',
            image: null,
            type1Id: pokemon.types[0]?.id || '',
            type2Id: pokemon.types[1]?.id || '',
            hp: pokemon.stats.hp || 0,
            attack: pokemon.stats.attack || 0,
            defense: pokemon.stats.defense || 0,
            specialAttack: pokemon.stats.specialAttack || 0,
            specialDefense: pokemon.stats.specialDefense || 0,
            speed: pokemon.stats.speed || 0,
            moveIds: pokemon.moves.map((move) => move.id) || [],
        });
        setShowModal(true);
    };

    const handleAddClick = () => {
        setSelectedPokemon(null);
        setFormData({
            name: '',
            image: null,
            type1Id: '',
            type2Id: '',
            hp: 0,
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
            moveIds: [],
        });
        setShowModal(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('type1Id', formData.type1Id);
            formDataToSend.append('type2Id', formData.type2Id);
            formDataToSend.append('hp', Number(formData.hp));
            formDataToSend.append('attack', Number(formData.attack));
            formDataToSend.append('defense', Number(formData.defense));
            formDataToSend.append('specialAttack', Number(formData.specialAttack));
            formDataToSend.append('specialDefense', Number(formData.specialDefense));
            formDataToSend.append('speed', Number(formData.speed));
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            formDataToSend.append('moveIds', JSON.stringify(formData.moveIds));

            console.log("Datos a enviar (campos):", {
                name: formData.name,
                typeId1: formData.type1Id,
                typeId2: formData.type2Id,
                hp: formData.hp,
                attack: formData.attack,
                defense: formData.defense,
                specialAttack: formData.specialAttack,
                specialDefense: formData.specialDefense,
                speed: formData.speed,
                image: formData.image,
                moveIds: formData.moveIds,
            });

            // Mostrar el contenido real del FormData
            for (let pair of formDataToSend.entries()) {
                console.log(`FormData -> ${pair[0]}:`, pair[1]);
            }


            await createPokemon(formDataToSend);
            await fetchPokemons();
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('type1Id', formData.type1Id);
            formDataToSend.append('type2Id', formData.type2Id);
            formDataToSend.append('hp', Number(formData.hp));
            formDataToSend.append('attack', Number(formData.attack));
            formDataToSend.append('defense', Number(formData.defense));
            formDataToSend.append('specialAttack', Number(formData.specialAttack));
            formDataToSend.append('specialDefense', Number(formData.specialDefense));
            formDataToSend.append('speed', Number(formData.speed));
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            formDataToSend.append('moveIds', JSON.stringify(formData.moveIds));

            await updatePokemon(selectedPokemon.id, formDataToSend);
            await fetchPokemons();
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPokemon(null);
        setFormData({
            name: '',
            image: null,
            type1Id: '',
            type2Id: '',
            hp: 0,
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
            moveIds: [],
        });
    };

    return (
        <>
            <Header />
            <div className="container-fluid mt-5 pt-5">
                <div className="row">
                    <div className="col-12 col-md-3 col-lg-2 p-0">
                        <AdminSidebar />
                    </div>
                    <div className="col-12 col-md-9 col-lg-10">
                        <h2 className="mb-4">Gestión de Pokémon</h2>

                        {/* Botón Añadir Pokémon */}
                        <Button
                            variant="primary"
                            className="mb-3"
                            onClick={handleAddClick}
                        >
                            Añadir Pokémon
                        </Button>

                        {loading && (
                            <div className="d-flex align-items-center">
                                <Spinner animation="border" role="status" />
                                <span className="ms-2">Cargando...</span>
                            </div>
                        )}

                        {error && <Alert variant="danger">{error}</Alert>}

                        {!loading && !error && (
                            <Table responsive hover className="table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Imagen</th>
                                        <th>Tipo 1</th>
                                        <th>Tipo 2</th>
                                        <th>HP</th>
                                        <th>Ataque</th>
                                        <th>Defensa</th>
                                        <th>Ataque Especial</th>
                                        <th>Defensa Especial</th>
                                        <th>Velocidad</th>
                                        <th>Movimientos</th>
                                        <th colSpan={2} className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pokemons.map((pokemon) => (
                                        <tr key={pokemon.id}>
                                            <td>{pokemon.id}</td>
                                            <td>{pokemon.name}</td>
                                            <td>
                                                <Image
                                                    src={pokemon.image}
                                                    alt={pokemon.name}
                                                    thumbnail
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>{pokemon.types[0]?.name || "N/A"}</td>
                                            <td>{pokemon.types[1]?.name || "N/A"}</td>
                                            <td>{pokemon.stats.hp}</td>
                                            <td>{pokemon.stats.attack}</td>
                                            <td>{pokemon.stats.defense}</td>
                                            <td>{pokemon.stats.specialAttack}</td>
                                            <td>{pokemon.stats.specialDefense}</td>
                                            <td>{pokemon.stats.speed}</td>
                                            <td>
                                                {pokemon.moves.length > 0 ? (
                                                    <ul>
                                                        {pokemon.moves.map((move) => (
                                                            <li key={move.id}>
                                                                {move.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => handleEditClick(pokemon)}
                                                >
                                                    Editar
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleDeleteClick(pokemon)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        <Modal show={showModal} onHide={handleModalClose} backdrop="static">
                            <Form onSubmit={selectedPokemon ? handleEditSubmit : handleCreateSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {selectedPokemon ? 'Editar Pokémon' : 'Añadir Pokémon'}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group controlId="pokemonName">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            placeholder="Nombre del Pokémon"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="pokemonImage" className="mt-3">
                                        <Form.Label>Imagen</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="pokemonType1" className="mt-3">
                                        <Form.Label>Tipo 1</Form.Label>
                                        <Form.Select
                                            name="type1Id"
                                            value={formData.type1Id}
                                            onChange={handleFormChange}
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            {types.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="pokemonType2" className="mt-3">
                                        <Form.Label>Tipo 2</Form.Label>
                                        <Form.Select
                                            name="type2Id"
                                            value={formData.type2Id}
                                            onChange={handleFormChange}
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            {types.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="pokemonMoves" className="mt-3">
                                        <Form.Label>Movimientos</Form.Label>
                                        <Form.Select
                                            name="moveIds"
                                            value={formData.moveIds}
                                            onChange={handleMoveChange}
                                            multiple
                                        >
                                            {moves.map((move) => (
                                                <option key={move.id} value={move.id}>
                                                    {move.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="pokemonStats" className="mt-3">
                                        <Form.Label>Estadísticas</Form.Label>
                                        <div className="row">
                                            <div className="col">
                                                <Form.Control
                                                    type="number"
                                                    name="hp"
                                                    value={formData.hp}
                                                    onChange={handleFormChange}
                                                    placeholder="HP"
                                                />
                                                Vida
                                            </div>
                                            <div className="col">
                                                <Form.Control
                                                    type="number"
                                                    name="attack"
                                                    value={formData.attack}
                                                    onChange={handleFormChange}
                                                    placeholder="Ataque"
                                                />
                                                Ataque
                                            </div>
                                            <div className="col">
                                                <Form.Control
                                                    type="number"
                                                    name="defense"
                                                    value={formData.defense}
                                                    onChange={handleFormChange}
                                                    placeholder="Defensa"
                                                />
                                                Defensa
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col">
                                                <Form.Control
                                                    type="number"
                                                    name="specialAttack"
                                                    value={formData.specialAttack}
                                                    onChange={handleFormChange}
                                                    placeholder="Ataque Especial"
                                                />
                                                Ataque Especial
                                            </div>
                                            <div className="col">
                                                <Form.Control
                                                    type="number"
                                                    name="specialDefense"
                                                    value={formData.specialDefense}
                                                    onChange={handleFormChange}
                                                    placeholder="Defensa Especial"
                                                />
                                                Defensa Especial
                                            </div>
                                            <div className="col">
                                                <Form.Control
                                                    type="number"
                                                    name="speed"
                                                    value={formData.speed}
                                                    onChange={handleFormChange}
                                                    placeholder="Velocidad"
                                                />
                                                Velocidad
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleModalClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={submitting}>
                                        {submitting ? 'Guardando...' : 'Guardar'}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}