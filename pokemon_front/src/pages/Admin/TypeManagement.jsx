import { useState, useEffect } from 'react';
import { getAllTypes, updateType, createType, deleteType } from '../../services/type';
import Header from '../../components/header';
import AdminSidebar from '../../components/adminSideBar';
import { Table, Spinner, Button, Alert, Modal, Form } from 'react-bootstrap';
import { getMe } from '../../services/auth';

export default function TypeManagement() {
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [selectedType, setSelectedType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState(null);

    const fetchTypes = async () => {
        try {
            setLoading(true);
            const typesData = await getAllTypes();
            setTypes(typesData);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching types.');
        } finally {
            setLoading(false);
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
        fetchTypes();
    }, []);

    const handleEditClick = (type) => {
        setSelectedType(type);
        setFormData({
            name: type.name || '',
        });
        setModalError(null);
        setShowModal(true);
    };

    const handleDeleteClick = async (type) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el tipo ${type.name}?`)) {
            try {
                await deleteType(type.id, { is_deleted: true });
                setTypes((prev) => prev.filter((t) => t.id !== type.id));
            } catch (err) {
                setError(err.message || 'An error occurred while deleting the type.');
            }
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedType(null);
        setFormData({});
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
            const newType = await createType(formData);
            setTypes((prev) => [...prev, newType]);
            handleModalClose();
            fetchTypes();
        } catch (err) {
            setModalError(err.message || 'An error occurred while creating the type.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setModalError(null);
        try {
            const filteredData = {};
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== selectedType[key]) {
                    filteredData[key] = formData[key];
                }
            });

            if (Object.keys(filteredData).length > 0) {
                await updateType(selectedType.id, filteredData);
                setTypes((prev) =>
                    prev.map((type) =>
                        type.id === selectedType.id ? { ...type, ...filteredData } : type
                    )
                );
            }
            handleModalClose();
        } catch (err) {
            setModalError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Header />
            <div className="d-flex" style={{ minHeight: '100vh' }}>
                <AdminSidebar className="bg-light border-end" style={{ minWidth: '220px' }} />
                <div className="flex-grow-1 p-4">
                    <h2 className="mb-4">Gestión de Tipos</h2>
                    <div>
                        <Button
                            variant="primary"
                            className="mb-3"
                            onClick={() => {
                                setSelectedType(null);
                                setFormData({ name: '' });
                                setModalError(null);
                                setShowModal(true);
                            }}
                        >
                            Añadir Tipo
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
                                    <th colSpan={2} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.map((type) => (
                                    <tr key={type.id}>
                                        <td>{type.id}</td>
                                        <td>{type.name}</td>
                                        <td className="text-center">
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                onClick={() => handleEditClick(type)}
                                            >
                                                Editar
                                            </Button>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(type)}
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
                        <Form onSubmit={selectedType ? handleEditSubmit : handleCreateSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedType ? 'Editar Tipo' : 'Añadir Tipo'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modalError && <Alert variant="danger">{modalError}</Alert>}
                                <Form.Group controlId="typeName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleFormChange}
                                        placeholder="Nombre del tipo"
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