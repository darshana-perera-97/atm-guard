import React from "react";
import logo from "../Assets/ProductLogo.svg";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MapView from "./MapView";
import Graphs from "./Graphs";
import MapNew from "./MapNew";
import MapNew2 from "./MapNew2";
import CustomizedDialogs from "./CustomizedDialogs";
import CustomizedDialogs2 from "./CustomizedDialogs2";
import MapNew1 from "./MapNewn2";
import MapNew3 from "./MapNewn4";
import MapNewn1 from "./MapNewn2";
import Graphsn1 from "./Graphsn1";
import Graphsn2 from "./Graphsn2";
import Graphsn3 from "./Graphsn3";
import Map1New from "./Map1New";
import Map1 from "./Map1";
import config from "../config";

const Dashboard = (prop) => {
  const [motion, setMotion] = React.useState(false);
  const [grid, setGrid] = React.useState(false);
  const [gas, setGas] = React.useState(true);
  const [door, setDoor] = React.useState(true);
  const [temp, setTemp] = React.useState(0);
  const [bat, setBat] = React.useState(0);
  const [speed, setSpeed] = React.useState(0);
  const [lon, setLon] = React.useState(10);
  const [lati, setLati] = React.useState(10);
  const [time, setTime] = React.useState("yyyy-mm-dd hh-mm-ss");
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
  const [timeFilter, setTimeFilter] = React.useState("2_hours");

  const handleSelect = (eventKey) => {
    setTimeFilter(eventKey);
  };

  const [link, setLink] = React.useState(`${config.backendUrl}/history4`);

  // Calculate the distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/data2`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        console.log(jsonData);
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
    const intervalId = setInterval(fetchData, 500);

    return () => clearInterval(intervalId);
  }, []);
  const handleLogout = () => {
    // Logic for logout can go here

    // Refresh the page
    // window.location.reload();
    prop.setDashboard(true);
  };
  React.useEffect(() => {
    setTemp(data.data.device1.temperatureCelsius.toFixed(2));
    let voltage = data.data.device1.voltage;
    let roundedVoltage = voltage.toFixed(2);
    setBat(parseFloat(roundedVoltage));
    const newLat = data.data.device1.Latitude;
    const newLon = data.data.device1.Longitude;
    const distance = calculateDistance(lati, lon, newLat, newLon);

    if (distance > 10) {
      setData((prevData) => ({
        ...prevData,
        state: true,
      }));
    }

    setLati(newLat);
    const newSpeed = data.data.device1.speed;
    if (Math.abs(newSpeed - speed) > 5.0) {
      setSpeed(newSpeed);
    }
    setLon(newLon);
    setMotion(data.data.device1.moction);
    if (data.data.device1.gridStatus === 1) {
      setGrid(true);
    } else {
      setGrid(false);
    }
    setGas(data.data.device1.gasStatus);
    setDoor(data.data.device1.doorStatus);
  }, [data]);

  return (
    <div>
      <div className="dashboard-topbar">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="content d-flex align-items-center">
                <img
                  src={logo}
                  alt="Product Logo"
                  className="product-logo mt-4 mb-4 mr-5"
                />

                <Dropdown className="ml-2">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    Device 001
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Device 002</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Device 003</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Device 004</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex mt-2 justify-content-between">
                <p className="ml-2 mt-4 mb-4 px-2">Filter Time :</p>

                <div className="content d-flex align-items-center">
                  {/* Add button set here */}
                  <ButtonGroup>
                    <Button
                      variant={
                        timeFilter === "5_min" ? "primary" : "outline-primary"
                      }
                      onClick={() => setTimeFilter("5_min")}
                    >
                      5 min
                    </Button>
                    <Button
                      variant={
                        timeFilter === "30_min" ? "primary" : "outline-primary"
                      }
                      onClick={() => setTimeFilter("30_min")}
                    >
                      30 min
                    </Button>
                    <Button
                      variant={
                        timeFilter === "1_hour" ? "primary" : "outline-primary"
                      }
                      onClick={() => setTimeFilter("1_hour")}
                    >
                      1 hour
                    </Button>
                    <Button
                      variant={
                        timeFilter === "2_hours" ? "primary" : "outline-primary"
                      }
                      onClick={() => setTimeFilter("2_hours")}
                    >
                      2 hours
                    </Button>
                  </ButtonGroup>
                </div>
                {/* <button className="customButton" onClick={handleLogout}>
                  Logout
                </button> */}
                <p
                  className="ml-5 mt-4 mb-4 px-2 custom-btn"
                  onClick={handleLogout}
                >
                  Back
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-contents">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-3">
              <h1 className="fw-light fs-1">Device Name : Nattandiya ATM</h1>
            </div>
            <div className="col-md-6 col-12">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="mt-1 mb-4">Device State</h3>
                  <p className="mb-0 pb-0">Last Updated on : {time}</p>
                  <p className="mt-0 pt-0">
                    Last Device Online : {data.data.device1.time}
                  </p>
                </div>

                <div className="col-md-4 col-12">
                  {data.state && (
                    <div className="card p-4 data-card text-center shadow-sm pb-1 state">
                      <h4 className="fw-light fs-4">Device State</h4>
                      <p className="fw-bold fs-2">Active</p>
                    </div>
                  )}
                  {!data.state && (
                    <div className="card p-4 data-card text-center shadow-sm pb-1 warning">
                      <h4 className="fw-light fs-4">Device State</h4>
                      <p className="fw-bold fs-2">Offline</p>
                    </div>
                  )}
                </div>
                <div className="col-md-4 col-12">
                  {temp > 35.0 ? (
                    <div className="card p-4 data-card text-center shadow-sm pb-1 warning">
                      <h4 className="fw-light fs-4">Temperature</h4>
                      <p className="fw-bold fs-2">{temp}°C</p>
                    </div>
                  ) : (
                    <div className="card p-4 data-card text-center shadow-sm pb-1 temp">
                      <h4 className="fw-light fs-4">Temperature</h4>
                      <p className="fw-bold fs-2">{temp}°C</p>
                    </div>
                  )}
                </div>
                <div className="col-md-4 col-12">
                  <div className="card p-4 data-card text-center shadow-sm pb-1 battery">
                    <h4 className="fw-light fs-4">Battery Vol.</h4>
                    <p className="fw-bold fs-2">{bat}V</p>
                  </div>
                </div>
                <div className="col-md-3 col-12 mt-4 ">
                  {motion ? (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card-active">
                      <h4 className="fw-light fs-6 mb-0">Motion Detected</h4>
                    </div>
                  ) : (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card">
                      <h4 className="fw-light fs-6 mb-0">Motion Detected</h4>
                    </div>
                  )}
                </div>
                <div className="col-md-3 col-12 mt-4 ">
                  {!grid ? (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card-active">
                      <h4 className="fw-light fs-6 mb-0">Battery Power</h4>
                    </div>
                  ) : (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card warning-card-ok">
                      <h4 className="fw-light fs-6 mb-0">Grid Power</h4>
                    </div>
                  )}
                </div>
                <div className="col-md-3 col-12 mt-4 ">
                  {!gas ? (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card-active">
                      <h4 className="fw-light fs-6 mb-0">Gas Emission</h4>
                    </div>
                  ) : (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card">
                      <h4 className="fw-light fs-6 mb-0">Gas Emission</h4>
                    </div>
                  )}
                </div>
                <div className="col-md-3 col-12 mt-4 ">
                  {door ? (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card-active">
                      <h4 className="fw-light fs-6 mb-0">Door Opened</h4>
                    </div>
                  ) : (
                    <div className="card px-2 py-3 text-center shadow-sm warning-card">
                      <h4 className="fw-light fs-6 mb-0">Door Closed</h4>
                    </div>
                  )}
                </div>
                <div className="col-md-12 mt-3">
                  <h3 className="mt-4 mb-4">Location</h3>
                  <p>Moving Speed : {speed}kmph</p>
                  {/* <MapView latitude={lati} longitude={lon} /> */}

                  {/* <p>zoom in</p>
                  <MapNew2 link={link} /> */}
                  {timeFilter === "5_min" && <Map1 link={link} />}

                  {timeFilter === "30_min" && <MapNewn1 link={link} />}
                  {timeFilter === "1_hour" && <MapNew3 link={link} />}
                  {timeFilter === "2_hours" && <MapNew link={link} />}
                  {door && <CustomizedDialogs />}
                  {temp > 40.0 && <CustomizedDialogs2 />}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="mt-1 mb-4">Graph View</h3>
                </div>

                {timeFilter === "5_min" && <Graphsn1 />}
                {timeFilter === "30_min" && <Graphsn2 />}
                {timeFilter === "1_hour" && <Graphsn3 />}
                {timeFilter === "2_hours" && <Graphs link={link} />}

                {timeFilter === "5_min" && <p>Filter Time - 5_min</p>}
                {timeFilter === "30_min" && <p>Filter Time - 30_min</p>}
                {timeFilter === "1_hour" && <p>Filter Time - 1_hour</p>}
                {timeFilter === "2_hours" && <p>Filter Time - 2_hours</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
