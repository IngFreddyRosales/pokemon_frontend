import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { getAllUser, updateUser } from "../../services/user";
import { Button, Modal, Form } from "react-bootstrap";
import AdminSidebar from "../../components/adminSideBar";
import { getMe } from "../../services/auth";


export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState(null);

    const fetchUsers = async () => {
        try {
            const users = await getAllUser();
            setUsers(users);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching users.');
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
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            is_admin: user.is_admin || false,
        });
        setModalError(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
        setFormData({});
        setModalError(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setModalError(null);
        try {
            const filteredData = {};
            Object.entries(formData).forEach(([key, value]) => {
                if (
                    value !== '' &&
                    value !== null &&
                    !(typeof value === 'boolean' && value === selectedUser[key]) &&
                    !(typeof value !== 'boolean' && value === selectedUser[key])
                ) {
                    filteredData[key] = value;
                }
            });

            if (Object.keys(filteredData).length > 0) {
                await updateUser(selectedUser.id, filteredData);
                setShowModal(false);

                const users = await getAllUser();
                setUsers(users)
            } else {
                setModalError('No se detectaron cambios para guardar.');
            }
        } catch (err) {
            setModalError(err.message || 'Error al actualizar el usuario.');
        } finally {
            setSaving(false);
        }
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
                        <h1 className="mb-4">Gestion de Usuarios</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.is_admin ? 'Admin' : 'User'}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => handleEditClick(user)}>
                                                Editar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        {modalError && <div className="alert alert-danger">{modalError}</div>}
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="contraseña"
                                name="password"
                                value={formData.password || ''}
                                onChange={handleFormChange}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="isAdminCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Es administrador"
                                name="is_admin"
                                checked={formData.is_admin}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}

                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}