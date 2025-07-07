import { useEffect, useState } from "react";
import { getAllMoves, updateMove, createMove, deleteMove } from "../../services/move";
import { getAllTypes } from "../../services/type";
import { Button, Table, Modal, Form, Spinner, Alert } from "react-bootstrap";
import Header from '../../components/header';
import AdminSidebar from '../../components/adminSideBar';
import { getMe } from '../../services/auth';

export default function MoveManagement() {
    const [moves, setMoves] = useState([]);
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMove, setSelectedMove] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', typeId: '', category: '', power: '', description: '' });
    const [modalError, setModalError] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchMoves = async () => {
        try {
            setLoading(true);
            const movesData = await getAllMoves();
            setMoves(movesData);
        } catch (err) {
            setError(err.message || 'Ocurrió un error al obtener los movimientos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTypes = async () => {
        try {
            const movesData = await getAllTypes();
            setTypes(movesData);
        } catch (err) {
            setError(err.message || 'Ocurrió un error al obtener los tipos.');
        }
    }

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
        fetchTypes();
        fetchMoves();
    }, []);

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedMove(null);
        setFormData({ name: '', typeId: '', category: '', power: '', description: '' });
        setModalError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setModalError(null);

        try {
            const newMove = await createMove(formData);
            setMoves((prev) => [...prev, newMove]);
            setShowModal(false);
            fetchMoves();
        } catch (err) {
            setModalError(err.message || 'Ocurrió un error al guardar el movimiento.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setModalError(null);

        try {
            const updatedData = {
                ...selectedMove,
                ...formData,
            };

            await updateMove(selectedMove.id, updatedData);
            setMoves((prev) =>
                prev.map((move) =>
                    move.id === selectedMove.id ? { ...move, ...updatedData } : move
                )
            );
            setShowModal(false);
            fetchMoves();
        } catch (err) {
            setModalError(err.message || 'Ocurrió un error al guardar el movimiento.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (move) => {
        setSelectedMove(move);
        setFormData({
            name: move.name || '',
            typeId: move.typeId || '',
            category: move.category || '',
            power: move.power || '',
            description: move.description || '',
        });
        setModalError(null);
        setShowModal(true);
    };

    const handleDeleteClick = async (move) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el movimiento "${move.name}"?`)) {
            try {
                await deleteMove(move.id);
                setMoves((prev) => prev.filter((m) => m.id !== move.id));
            } catch (err) {
                setError(err.message || 'Ocurrió un error al eliminar el movimiento.');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="d-flex" style={{ minHeight: '100vh' }}>
                <AdminSidebar className="bg-light border-end" style={{ minWidth: '220px' }} />
                <div className="flex-grow-1 p-4">
                    <h2 className="mb-4">Gestión de Movimientos</h2>
                    <div>
                        <Button
                            variant="primary"
                            className="mb-3"
                            onClick={() => {
                                setSelectedMove(null);
                                setFormData({ name: '', typeId: '', category: '', power: '', description: '' });
                                setShowModal(true);
                            }}
                        >
                            Añadir Movimiento
                        </Button>
                    </div>

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
                                    <th>Tipo</th>
                                    <th>Categoría</th>
                                    <th>Poder</th>
                                    <th>Descripción</th>
                                    <th colSpan={2} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {moves.map((move) => (
                                    <tr key={move.id}>
                                        <td>{move.id}</td>
                                        <td>{move.name}</td>
                                        <td>{move.typeName}</td>
                                        <td>{move.category}</td>
                                        <td>{move.power}</td>
                                        <td>{move.description}</td>
                                        <td className="text-center">
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                onClick={() => handleEditClick(move)}
                                            >
                                                Editar
                                            </Button>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(move)}
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
                        <Form onSubmit={selectedMove ? handleEditSubmit : handleCreateSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedMove ? 'Editar Movimiento' : 'Añadir Movimiento'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modalError && <Alert variant="danger">{modalError}</Alert>}
                                <Form.Group controlId="moveName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="Nombre del movimiento"
                                    />
                                </Form.Group>

                                <Form.Group controlId="moveTypeId" className="mt-3">
                                    <Form.Label>Tipo ID</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="typeId"
                                        value={formData.typeId}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Selecciona un tipo</option>
                                        {types.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="moveCategory" className="mt-3">
                                    <Form.Label>Categoría</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        <option value="physical">Físico</option>
                                        <option value="special">Especial</option>
                                        <option value="status">Estado</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="movePower" className="mt-3">
                                    <Form.Label>Poder</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="power"
                                        value={formData.power}
                                        onChange={handleFormChange}
                                        placeholder="Poder del movimiento"
                                    />
                                </Form.Group>

                                <Form.Group controlId="moveDescription" className="mt-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                        placeholder="Descripción del movimiento"
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleModalClose} disabled={saving}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit" disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
}