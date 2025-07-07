import { useEffect, useState } from 'react';
import { getAllItems, createItem, updateItem, deleteItem } from '../../services/item';
import Header from '../../components/header';
import AdminSidebar from '../../components/adminSideBar';
import { Table, Spinner, Button, Image, Alert, Modal, Form } from 'react-bootstrap';
import { getMe } from '../../services/auth';


export default function ItemManagement() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', image: null });
    const [modalError, setModalError] = useState(null);
    const [submitting, setSubmitting] = useState(false);




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
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const itemsData = await getAllItems();
            setItems(itemsData);
        } catch (err) {
            setError(err.message || 'Ocurrió un error al obtener los items.');
        } finally {
            setLoading(false);
        }
    };
    const handleModalClose = () => {
        setShowModal(false);
        setSelectedItem(null);
        setFormData({ name: '', description: '', image: null });
        setModalError(null);
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setModalError(null);

        try {
            const newItem = await createItem(formData);
            setItems((prev) => [...prev, newItem]); // Agrega el nuevo item al estado
            setShowModal(false);
            fetchItems();
        } catch (err) {
            setModalError(err.message || 'Ocurrió un error al guardar el ítem.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setModalError(null);

        try {
            // Combina los datos existentes con los datos del formulario
            const updatedData = {
                ...selectedItem,
                ...formData,
            };

            const formDataToSend = new FormData();
            formDataToSend.append('name', updatedData.name);
            formDataToSend.append('description', updatedData.description);
            if (updatedData.image) {

                formDataToSend.append('image', updatedData.image);
            }

            await updateItem(selectedItem.id, formDataToSend);
            fetchItems(); // Refresca la lista de ítems

            setItems((prev) =>
                prev.map((item) =>
                    item.id === selectedItem.id ? { ...item, ...updatedData } : item
                )
            );

            setShowModal(false);

        } catch (err) {
            setModalError(err.message || 'Ocurrió un error al guardar el ítem.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (item) => {

        setSelectedItem(item);
        setFormData({
            name: item.name || '',
            description: item.description || '',
            image: null, // No cargamos la imagen existente
        });
        setModalError(null);
        setShowModal(true);
    };

    const handleDeleteClick = async (item) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el ítem "${item.name}"?`)) {
            try {

                await deleteItem(item.id);
                setItems((prev) => prev.filter((i) => i.id !== item.id));
            } catch (err) {
                setError(err.message || 'Ocurrió un error al eliminar el ítem.');
            }
        }

    }

    return (
        <>
            <Header />
            <div className="d-flex" style={{ minHeight: '100vh' }}>
                <AdminSidebar className="bg-light border-end" style={{ minWidth: '220px' }} />
                <div className="flex-grow-1 p-4">
                    <h2 className="mb-4">Gestión de Ítems</h2>
                    <div>
                        <Button
                            variant="primary"
                            className="mb-3"
                            onClick={() => {
                                setSelectedItem(null);
                                setFormData({ name: '', description: '', image: null });
                                setShowModal(true);
                            }}
                        >
                            Añadir Ítem
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
                                    <th>Descripción</th>
                                    <th>Imagen</th>
                                    <th colSpan={2} className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <Image
                                                src={`http://localhost:3000${item.image}`}
                                                alt={item.name}
                                                thumbnail
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                Editar
                                            </Button>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(item)}
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
                        <Form onSubmit={selectedItem ? handleEditSubmit : handleCreateSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedItem ? 'Editar Ítem' : 'Añadir Ítem'}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modalError && <Alert variant="danger">{modalError}</Alert>}
                                <Form.Group controlId="itemName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="Nombre del ítem"
                                    />
                                </Form.Group>

                                <Form.Group controlId="itemDescription" className="mt-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                        placeholder="Descripción del ítem"
                                    />
                                </Form.Group>

                                <Form.Group controlId="itemImage" className="mt-3">
                                    <Form.Label>Imagen</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFormChange}
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleModalClose} disabled={submitting}>
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
        </>
    );
}