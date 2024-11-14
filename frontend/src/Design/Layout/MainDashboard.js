// src/components/MainDashboard.js
import React from "react";
import logo from "../Assets/ProductLogo.svg";
import boc from "../Assets/boc.jpg";
import {
  Container,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import Dashboard from "./Dashboard";
import AlertsSet from "./AlertsSet";

const MainDashboard = () => {
  const handleLogout = () => {
    window.location.reload();
  };

  const [dashboard, setDashboard] = React.useState(true);

  const [item, setItem] = React.useState("all");

  return (
    <div>
      {dashboard && (
        <Container className="p-0 content-body">
          <Row noGutters>
            <Col md={12} className="main-content">
              <header className="d-flex justify-content-between align-items-center p-3">
                <div className="d-flex custom-navbar">
                  <img
                    src={logo}
                    alt="Product Logo"
                    className="product-logo2 mr-5 "
                  />
                  <h1 className="selected-persona mt-0">| Overview</h1>
                </div>
                <div className="user-info d-flex align-items-center">
                  <span className="me-2 logout-button" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              </header>
            </Col>
            <Col md={12} className="main-content">
              <main className="p-4 pt-0">
                <h2 className="my-4">All Alerts</h2>

                <Row>
                  <Col md={12} className="mb-8 mt-4 fluid">
                    {/* <p>{item}</p> */}
                    <AlertsSet item={item} />
                  </Col>
                </Row>
              </main>
            </Col>
            <Col md={12} className="main-content">
              <main className="p-4 pt-0">
                <h2 className="my-4">Connected Devices</h2>
                <Row>
                  <Col md={3} className="mb-4">
                    <Card className="text-center persona-card">
                      <Card.Body>
                        <img
                          src={boc}
                          alt="Logo"
                          className="mb-2"
                          width="100"
                          height="90"
                        />
                        <Card.Title>Nattandiya ATM - 01</Card.Title>
                        <Card.Text>Bank of Ceylon</Card.Text>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setDashboard(false);
                          }}
                        >
                          View
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-4">
                    <Card className="text-center create-persona-card">
                      <Card.Body>
                        <Button variant="outline-primary">Add Device</Button>
                        <Card.Text className="mt-2">
                          How to add more devices
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </main>
            </Col>
          </Row>
        </Container>
      )}
      {!dashboard && <Dashboard setDashboard={setDashboard} />}
    </div>
  );
};

export default MainDashboard;
