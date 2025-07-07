import React, { useEffect, useState, useCallback } from "react";
import { Navbar, Container, Nav, Spinner, Dropdown } from "react-bootstrap";
import { getMe } from "../services/auth";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await getMe();
            setUser(userData);
        } catch (err) {
            setUser(null);
            setError('Error al cargar datos del usuario');
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleLogout = useCallback(() => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Error during logout:', err);
        }
    }, [navigate]);

    return (
        <Navbar bg="danger" variant="dark" expand="lg" fixed="top" className="shadow">
            <Container>
                <Navbar.Brand href="/" className="fw-bold">
                    OdioPokemon.com 
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {loading ? (
                            <div className="d-flex align-items-center">
                                <Spinner animation="border" size="sm" className="me-2" />
                                <span>Cargando...</span>
                            </div>
                        ) : error ? (
                            <Navbar.Text className="text-danger">
                                {error}
                            </Navbar.Text>
                        ) : user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                                    <i className="fas fa-user-circle me-2"></i>
                                    {user.name} {user.lastName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Cerrar Sesión
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <div className="d-flex gap-2">
                                <Nav.Link href="/login" className="btn btn-outline-light px-3">
                                    Iniciar Sesión
                                </Nav.Link>
                                <Nav.Link href="/register" className="btn btn-light px-3">
                                    Registrarse
                                </Nav.Link>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}