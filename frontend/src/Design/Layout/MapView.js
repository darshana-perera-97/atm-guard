// src/MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon not appearing correctly
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

const MapView = ({ latitude, longitude }) => {
  const position = [latitude, longitude];

  return (
    <MapContainer center={position} zoom={13} style={{ height: "40vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={L.icon({ iconUrl: markerIconPng })}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
