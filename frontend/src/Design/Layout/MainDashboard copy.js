// src/components/MainDashboard.js
import React from "react";
import logo from "../Assets/ProductLogo.svg";
import boc from "../Assets/boc.jpg";
import config from "../config"; 

import {
  Container,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import Dashboard from "./Dashboard";

const MainDashboard = () => {
  const handleLogout = () => {
    window.location.reload();
  };
  const [dashboard, setDashboard] = React.useState(true);
  const [motion, setMotion] = React.useState(false);
  const [time, setTime] = React.useState("yyyy-mm-dd hh-mm-ss");
  const [gas, setGas] = React.useState(true);
  const [door, setDoor] = React.useState(true);
  const [speed, setSpeed] = React.useState(0);
  const [data, setData] = React.useState({
    data: {
      DsDHT11: {
        Humidity: 0,
        Temperature: 0,
      },
      device1: {
        Latitude: 0,
        Longitude: 0,
        angleX: 0,
        angleY: 0,
        angleZ: 0,
        doorStatus: 0,
        gasStatus: 0,
        gridStatus: 0,
        temperatureCelsius: 0.0,
        time: "22:49:17",
        voltage: 0,
      },
    },
    state: false,
    timestamp: "2024-05-21T22:49:12+05:30",
  });
  const [item, setItem] = React.useState("all");
  const alerts = [];
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // "http://localhost:3002/data2"
          `${config.backendUrl}/data2`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);

        function formatDateTime(dateTimeString) {
          const date = new Date(dateTimeString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");

          return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
        }

        setTime(formatDateTime(jsonData.timestamp));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    // console.log(data);
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);
  React.useEffect(() => {
    const newSpeed = data.data.device1.speed;
    if (Math.abs(newSpeed - speed) > 5.0) {
      setSpeed(newSpeed);
    }

    setMotion(data.data.device1.moction);
    setGas(data.data.device1.gasStatus);
    setDoor(data.data.device1.doorStatus);
  }, [data]);
  React.useEffect(() => {
    if (time !== "yyyy-mm-dd hh-mm-ss") {
      let tmp = {
        sensor: "door",
        state: door,
        time: time,
      };
      alerts.push(tmp);
      console.log(alerts);
    }
  }, [door]);

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
                  <h1 className="selected-persona mt-0">| OverView</h1>
                </div>
                <div className="user-info d-flex align-items-center">
                  <span className="me-2 logout-button" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              </header>
            </Col>
            <Col md={6} className="main-content">
              <main className="p-4 pt-0">
                <h2 className="my-4">Connected Devices</h2>
                <Row>
                  <Col md={6} className="mb-4">
                    <Card className="text-center create-persona-card">
                      <Card.Body>
                        <Button variant="outline-primary">Add Device</Button>
                        <Card.Text className="mt-2">
                          How to add more devices
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Card className="text-center persona-card">
                      <Card.Body>
                        <img
                          src={boc}
                          alt="Logo"
                          className="mb-2"
                          width="100"
                          height="90"
                        />
                        <Card.Title>Mahawewa ATM - 01</Card.Title>
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
                </Row>
              </main>
            </Col>
            <Col md={6} className="main-content">
              <main className="p-4 pt-0">
                <h2 className="my-4">All Alerts</h2>
                <Row>
                  <Col md={4} className="mb-8 ">
                    <Dropdown className="ml-2">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="dropdown-basic"
                      >
                        Device 001
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
                          Device 002
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2">
                          Device 003
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          Device 004
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col md={6} className="mb-8 ">
                    <ButtonGroup>
                      <Button
                        variant={item === "all" ? "primary" : "outline-primary"}
                        onClick={() => setItem("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={
                          item === "temp" ? "primary" : "outline-primary"
                        }
                        onClick={() => setItem("temp")}
                      >
                        Temperature
                      </Button>
                      <Button
                        variant={
                          item === "grid" ? "primary" : "outline-primary"
                        }
                        onClick={() => setItem("grid")}
                      >
                        Grid
                      </Button>
                      <Button
                        variant={
                          item === "motion" ? "primary" : "outline-primary"
                        }
                        onClick={() => setItem("motion")}
                      >
                        Motion
                      </Button>
                      <Button
                        variant={
                          item === "door" ? "primary" : "outline-primary"
                        }
                        onClick={() => setItem("door")}
                      >
                        door
                      </Button>
                      <Button
                        variant={item === "gas" ? "primary" : "outline-primary"}
                        onClick={() => setItem("gas")}
                      >
                        Gas
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  {/* {motion && (
                <Col md={12} className="mb-12">
                  <Card className="text-center create-persona-card">
                    <Card.Body>
                      <Card.Text className="mt-2">
                        <p>Motion detected in Nattandiya ATM</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )} */}
                  {item}
                  {motion && (
                    <Col md={12} className="mb-8 mt-3">
                      <Card className="text-center persona-card mb-4">
                        <Card.Body>
                          <Card.Title>Mahawewa ATM - 01</Card.Title>
                          <Card.Text>
                            Motion has been detected <br />
                            {time}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {!gas && (
                    <Col md={12} className="mt-8 ">
                      <Card className="text-center persona-card mb-4">
                        <Card.Body>
                          <Card.Title>Mahawewa ATM - 01</Card.Title>
                          <Card.Text>
                            Gas Emission has been detected <br />
                            {time}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {door && (
                    <Col md={12} className="mt-8 ">
                      <Card className="text-center persona-card mb-4">
                        <Card.Body>
                          <Card.Title>Mahawewa ATM - 01</Card.Title>
                          <Card.Text>
                            Door Opened <br />
                            {time}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </main>
            </Col>
          </Row>
        </Container>
      )}
      {!dashboard && <Dashboard />}
    </div>
  );
};

export default MainDashboard;
