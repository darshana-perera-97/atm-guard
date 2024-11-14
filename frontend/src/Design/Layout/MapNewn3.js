import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon not appearing correctly
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const MapNew2 = (prop) => {
  const [locations, setLocations] = useState([]);
  const [zoom, setZoom] = useState(16); // New state for the zoom level
  const [showCurrentOnly, setShowCurrentOnly] = useState(false); // State for toggling view

  const fetchData = async () => {
    try {
      const response = await fetch(prop.link);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let result = await response.json();
      let last200Elements = [];
      //   console.log("Fetched data:", result);

      if (Array.isArray(result)) {
        last200Elements = result.slice(-200);
        console.log(last200Elements);
      }
      result = last200Elements;
      // Extracting locations from the fetched data
      const newLocations = result
        .map((item) => ({
          name: item.timestamp,
          latitude: item.data.device1.Latitude,
          longitude: item.data.device1.Longitude,
        }))
        .filter(
          (location) =>
            location.latitude !== 0.0 &&
            location.longitude !== 0.0 &&
            location.latitude >= 5.9 &&
            location.latitude <= 9.9 &&
            location.longitude >= 79.8 &&
            location.longitude <= 81.9
        );

      // Append new locations to the existing ones
      setLocations((prevLocations) => [...prevLocations, ...newLocations]);
    } catch (error) {
      console.error("Reload page to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      console.log("Fetching data again...");
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [prop.timeFilter]);

  const CenterMapButton = () => {
    const map = useMap();

    const centerMap = () => {
      if (locations.length > 0) {
        const latestLocation = locations[locations.length - 1];
        map.setView([latestLocation.latitude, latestLocation.longitude], 16);
      }
    };

    return (
      <button
        onClick={centerMap}
        style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
      >
        Center on Latest
      </button>
    );
  };

  const ToggleViewButton = () => {
    return (
      <button
        onClick={() => setShowCurrentOnly((prev) => !prev)}
        style={{ position: "absolute", top: 50, right: 10, zIndex: 1000 }}
      >
        {showCurrentOnly ? "View Path" : "Show Current Location"}
      </button>
    );
  };

  return (
    <div>
      <MapContainer
        center={[6.9, 79.8]} // Set a default center or adjust as needed
        zoom={zoom} // Use the zoom state here
        style={{ height: "80vh", width: "100%" }}
      >
        <CenterMapButton />
        <ToggleViewButton />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {showCurrentOnly && locations.length > 0 ? (
          <Marker
            position={[
              locations[locations.length - 1].latitude,
              locations[locations.length - 1].longitude,
            ]}
            icon={L.icon({ iconUrl: markerIconPng })}
          >
            <Popup>{locations[locations.length - 1].name}</Popup>
            <Tooltip>{locations[locations.length - 1].name}</Tooltip>
          </Marker>
        ) : (
          <>
            {locations.map((location, idx) => (
              <Marker
                key={idx}
                position={[location.latitude, location.longitude]}
                icon={L.icon({ iconUrl: markerIconPng })}
              >
                <Popup>{location.name}</Popup>
                <Tooltip>{location.name}</Tooltip>
              </Marker>
            ))}
            <Polyline
              positions={locations.map((location) => [
                location.latitude,
                location.longitude,
              ])}
              color="blue"
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapNew2;
