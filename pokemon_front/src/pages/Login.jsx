import React, { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            if (user.is_admin) {
                navigate('/admin');
            } else {
                navigate('/userDashboard');
            }
        }
    }, [user, navigate]);

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }

        try {
            const { token } = await login(credentials);
            localStorage.setItem('token', token);
            window.location.reload();
        }catch (err) {
            setError(err.message || 'An error occurred during login.');
        }
    };


    return (
                <div className="bg-light min-vh-100 d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Card className="shadow-lg border-0">
                            <Card.Header as="h4" className="bg-primary text-white text-center py-3">
                                Iniciar Sesión
                            </Card.Header>
                            <Card.Body className="p-4">
                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        {error}
                                    </Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>name</Form.Label>
                                        <Form.Control
                                            type="name"
                                            name="name"
                                            value={credentials.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="pepito"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Contraseña segura"
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        size="lg"
                                    >
                                        Ingresar
                                    </Button>
                                </Form>
                                <div className="mt-3 text-center">
                                    ¿No tienes cuenta? <a href="/register">Regístrate</a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}