import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function UserSidebar() {
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
                    to="/userDashboard"
                    eventKey="/userDashboard"
                    className="title-side-bar"
                >
                    Mis equipos
                </Nav.Link>

                

            </Nav>
        </div>
    );
}