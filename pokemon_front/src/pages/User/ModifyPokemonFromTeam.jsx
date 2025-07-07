import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Header from "../../components/header";
import { getAllItems } from "../../services/item";
import { getAllAbilitiesFromPokemon } from "../../services/ability";
import { getAllNatures } from "../../services/nature";
import { getPokemonFromTeam, updatePokemonFromTeam } from "../../services/teamPokemon";
import { useParams, useNavigate } from "react-router-dom";

export default function ModifyPokemonFromTeam() {
    const { pokemonId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nickname: "",
        itemId: "",
        abilityId: "",
        natureId: "",
        evHp: 0, evAtk: 0, evDef: 0, evSpa: 0, evSpd: 0, evSpe: 0,
        ivHp: 0, ivAtk: 0, ivDef: 0, ivSpa: 0, ivSpd: 0, ivSpe: 0,
    });
    const [items, setItems] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [natures, setNatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pokemon = await getPokemonFromTeam(pokemonId);
                setFormData({
                    nickname: pokemon.nickname || "",
                    itemId: pokemon.itemId || "",
                    abilityId: pokemon.abilityId || "",
                    natureId: pokemon.natureId || "",
                    evHp: pokemon.evHp || 0,
                    evAtk: pokemon.evAtk || 0,
                    evDef: pokemon.evDef || 0,
                    evSpa: pokemon.evSpa || 0,
                    evSpd: pokemon.evSpd || 0,
                    evSpe: pokemon.evSpe || 0,
                    ivHp: pokemon.ivHp || 0,
                    ivAtk: pokemon.ivAtk || 0,
                    ivDef: pokemon.ivDef || 0,
                    ivSpa: pokemon.ivSpa || 0,
                    ivSpd: pokemon.ivSpd || 0,
                    ivSpe: pokemon.ivSpe || 0,
                });
                setItems(await getAllItems());
                setAbilities(await getAllAbilitiesFromPokemon(pokemon.pokemonId));
                setNatures(await getAllNatures());
            } catch (error) {
                console.error("Error al cargar los datos del Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [pokemonId]);

    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "range" || type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            itemId: formData.itemId === "" ? null : formData.itemId,
            abilityId: formData.abilityId === "" ? null : formData.abilityId,
            natureId: formData.natureId === "" ? null : formData.natureId
        }
        updatePokemonFromTeam(pokemonId, dataToSend)
        navigate(-1)
            
        alert("Cambios guardados (simulado)");
    };

    if (loading) return <div className="container mt-4">Cargando Pokémon...</div>;

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2>Modificar Pokémon del Equipo</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Apodo</Form.Label>
                        <Form.Control
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleFormChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Item</Form.Label>
                        <Form.Select name="itemId" value={formData.itemId} onChange={handleFormChange}>
                            <option value="">Sin item</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Select>
                        {formData.itemId && (
                            <div className="mt-2">
                                <img
                                    src={
                                        items.find(i => String(i.id) === String(formData.itemId))?.image?.startsWith("http")
                                            ? items.find(i => String(i.id) === String(formData.itemId))?.image
                                            : `http://localhost:3000${items.find(i => String(i.id) === String(formData.itemId))?.image}`
                                    }
                                    alt="Item"
                                    style={{ width: 48, height: 48 }}
                                />
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Habilidad</Form.Label>
                        <Form.Select name="abilityId" value={formData.abilityId} onChange={handleFormChange}>
                            <option value="">Sin habilidad</option>
                            {abilities.map(ability => (
                                <option key={ability.id} value={ability.id}>{ability.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Naturaleza</Form.Label>
                        <Form.Select name="natureId" value={formData.natureId} onChange={handleFormChange}>
                            <option value="">Sin naturaleza</option>
                            {natures.map(nature => (
                                <option key={nature.id} value={nature.id}>{nature.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Row>
                        <Col>
                            <h6>EVs</h6>
                            {["evHp", "evAtk", "evDef", "evSpa", "evSpd", "evSpe"].map(stat => (
                                <Form.Group key={stat} className="mb-2">
                                    <Form.Label>{stat.replace("ev", "")}</Form.Label>
                                    <Form.Range
                                        min={0}
                                        max={250}
                                        name={stat}
                                        value={formData[stat]}
                                        onChange={handleFormChange}
                                    />
                                    <span>{formData[stat]}</span>
                                </Form.Group>
                            ))}
                        </Col>
                        <Col>
                            <h6>IVs</h6>
                            {["ivHp", "ivAtk", "ivDef", "ivSpa", "ivSpd", "ivSpe"].map(stat => (
                                <Form.Group key={stat} className="mb-2">
                                    <Form.Label>{stat.replace("iv", "")}</Form.Label>
                                    <Form.Range
                                        min={0}
                                        max={250}
                                        name={stat}
                                        value={formData[stat]}
                                        onChange={handleFormChange}
                                    />
                                    <span>{formData[stat]}</span>
                                </Form.Group>
                            ))}
                        </Col>
                    </Row>

                    <div className="mt-3 d-flex justify-content-end">
                        <Button variant="primary" type="submit">Guardar Cambios</Button>
                    </div>
                </Form>
            </div>
        </>
    );
}