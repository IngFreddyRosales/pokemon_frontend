import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
    const location = useLocation();

    return (
        <div className="bg-light vh-100 p-3 border-end" style={{ minWidth: 220 }}>
            <h5 className="mb-4">Panel Admin</h5>
            <Nav
                variant="pills"
                className="flex-column"
                activeKey={location.pathname}
            >
                <Nav.Link
                    as={Link}
                    to="/admin"
                    eventKey="/admin"
                    className="title-side-bar"
                >
                    Usuarios
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin/moveManagement"
                    eventKey="/admin/moveManagement"
                    className="title-side-bar"
                >
                    Movimientos
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin/pokemonManagement"
                    eventKey="/admin/pokemonManagement"
                    className="title-side-bar"
                >
                    Pokemons
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin/itemManagement"
                    eventKey="/admin/itemManagement"
                    className="title-side-bar"
                >
                    Items
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin/typeManagement"
                    eventKey="/admin/typeManagement"
                    className="title-side-bar"
                >
                    Tipos
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/admin/teamsManagement"
                    eventKey="/admin/teamsManagement"
                    className="title-side-bar"
                >
                    Equipos
                </Nav.Link>



            </Nav>
        </div>
    );
}