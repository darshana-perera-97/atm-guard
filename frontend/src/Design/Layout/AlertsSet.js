import React from "react";
import {
  Container,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AlertsSet(prop) {
  const [alertsData, setAlertsData] = React.useState([
    {
      id: 1,
      item: "door",
      state: true,
      time: "2024-06-07T23:42:46+05:30",
      device: "BOC - Nattandiya",
    },
    {
      id: 2,
      item: "grid",
      state: 1,
      time: "2024-06-07T23:42:46+05:30",
      device: "BOC - Nattandiya",
    },
    {
      id: 3,
      item: "motion",
      state: 1,
      time: "2024-06-07T23:42:46+05:30",
      device: "BOC - Nattandiya",
    },
    {
      id: 4,
      item: "gas",
      state: false,
      time: "2024-06-07T23:42:46+05:30",
      device: "BOC - Nattandiya",
    },
  ]);

  const [selectedFilter, setSelectedFilter] = React.useState("All"); // Default filter state
  const [currentPage, setCurrentPage] = React.useState(1); // State for the current page
  const itemsPerPage = 5; // Number of items per page

  React.useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        const response = await fetch(
          "https://basic-node-js-backend.onrender.com/alerts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setAlertsData(jsonData.slice(-10).reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAlertsData();
    const intervalId = setInterval(fetchAlertsData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function getLevel(item, state) {
    if (item === "door" && state === true) return "Critical";
    if (item === "door" && state === false) return "Info";
    if (item === "grid" && state !== 1) return "Critical";
    if (item === "grid" && state === 1) return "Info";
    if (item === "motion" && state === 1) return "Warning";
    if (item === "gas" && state === false) return "Warning";
    if (item === "gas" && state !== false) return "Info";
    return "Warning";
  }

  function getEvent(item, state) {
    if (item === "door" && state === true) return "Door Opened";
    if (item === "door" && state === false) return "Door Closed";
    if (item === "motion" && state === 0) return "No Motion Detected";
    if (item === "motion" && state === 1) return "Motion Detected";
    if (item === "grid" && state === 1) return "Grid Power Restored";
    if (item === "grid" && state !== 1) return "Grid Power Lost";
    if (item === "gas" && state === false) return "Gas Detected";
    if (item === "gas" && state !== false) return "No Gas";
    return "Shock Detected";
  }

  function getSensor(item) {
    if (item === "motion") return "Shock";
    if (item === "door") return "Door";
    if (item === "grid") return "Grid";
    if (item === "gas") return "Gas";
    return "Shock";
  }

  const eventsData = alertsData.map((alert) => ({
    device: "BOC - Nattandiya",
    time: formatDateTime(alert.time),
    level: getLevel(alert.item, alert.state),
    sensor: getSensor(alert.item),
    event: getEvent(alert.item, alert.state),
  }));

  const filteredEvents = eventsData.filter((event) => {
    if (selectedFilter === "All") {
      return true;
    } else {
      return event.sensor.toLowerCase() === selectedFilter.toLowerCase();
    }
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  // Get the data to be displayed on the current page
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <Dropdown className="ml-2">
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                Device 001
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Device 002</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Device 003</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Device 004</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="btn-group mb-3">
              <button
                type="button"
                className={`btn btn-primary ${
                  selectedFilter === "All" && "active"
                }`}
                onClick={() => setSelectedFilter("All")}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-primary ${
                  selectedFilter === "Grid" && "active"
                }`}
                onClick={() => setSelectedFilter("Grid")}
              >
                Grid
              </button>
              <button
                type="button"
                className={`btn btn-primary ${
                  selectedFilter === "Shock" && "active"
                }`}
                onClick={() => setSelectedFilter("Shock")}
              >
                Shock
              </button>
              <button
                type="button"
                className={`btn btn-primary ${
                  selectedFilter === "Door" && "active"
                }`}
                onClick={() => setSelectedFilter("Door")}
              >
                Door
              </button>
              <button
                type="button"
                className={`btn btn-primary ${
                  selectedFilter === "Gas" && "active"
                }`}
                onClick={() => setSelectedFilter("Gas")}
              >
                Gas
              </button>
            </div>
          </div>
          <table className="table table-bordered w-100">
            <thead className="thead-dark">
              <tr>
                <th>Device Name</th>
                <th>Date Time</th>
                <th style={{ textAlign: "center" }}>Level</th>
                <th style={{ textAlign: "center" }}>Sensor</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {displayedEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.device}</td>
                  <td>{event.time}</td>
                  <td style={{ padding: "0px" }}>
                    {event.level === "Critical" && (
                      <p
                        style={{
                          padding: "5px",
                          background: "#FF0000",
                          marginBottom: "0px",
                          color: "#ffffff",
                          textAlign: "center",
                        }}
                      >
                        Critical
                      </p>
                    )}
                    {event.level === "Info" && (
                      <p
                        style={{
                          padding: "5px",
                          background: "#0000FF",
                          marginBottom: "0px",
                          color: "#ffffff",
                          textAlign: "center",
                        }}
                      >
                        Info
                      </p>
                    )}
                    {event.level === "Warning" && (
                      <p
                        style={{
                          padding: "5px",
                          background: "#FFFF00",
                          color: "#000000",
                          marginBottom: "0px",
                          textAlign: "center",
                        }}
                      >
                        Warning
                      </p>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>{event.sensor}</td>
                  <td>{event.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`btn btn-outline-primary mx-1 ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
