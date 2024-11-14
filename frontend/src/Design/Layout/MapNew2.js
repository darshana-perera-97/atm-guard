// import React, { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Tooltip,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";

// // Fix for default marker icon not appearing correctly
// import markerIconPng from "leaflet/dist/images/marker-icon.png";

// const ChangeView = ({ center, zoom }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, zoom);
//   }, [map, center, zoom]);
//   return null;
// };

// const MapNew = (prop) => {
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [zoom, setZoom] = useState(16); // New state for the zoom level

//   const fetchData = async () => {
//     try {
//       const response = await fetch(prop.link);
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const result = await response.json();
//       //   console.log("Fetched data:", result);

//       // Extracting locations from the fetched data
//       const newLocations = result
//         .map((item) => ({
//           name: item.timestamp,
//           latitude: item.data.device1.Latitude,
//           longitude: item.data.device1.Longitude,
//         }))
//         .filter(
//           (location) =>
//             location.latitude !== 0.0 &&
//             location.longitude !== 0.0 &&
//             location.latitude >= 5.9 &&
//             location.latitude <= 9.9 &&
//             location.longitude >= 79.8 &&
//             location.longitude <= 81.9
//         );

//       // Append new locations to the existing ones
//       setLocations([...locations, ...newLocations]);

//       setLoading(false);
//     } catch (error) {
//       console.error("Reload page to fetch data");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const intervalId = setInterval(() => {
//       console.log("Fetching data again...");
//       fetchData();
//       console.log(locations[9]);
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [prop.timeFilter]);

//   // Set center of map to the last location in the array
//   const lastLocation =
//     locations.length > 0 ? locations[locations.length - 1] : null;

//   if (!lastLocation) {
//     return null; // Don't render the map if there are no valid locations
//   }

//   return (
//     <div>
//       <div style={{ marginBottom: "10px" }}>
//         <label>Zoom:</label>
//         <input
//           type="range"
//           min="1"
//           max="25"
//           value={zoom}
//           onChange={(e) => setZoom(Number(e.target.value))}
//         />
//       </div>
//       <MapContainer
//         center={[lastLocation.latitude, lastLocation.longitude]}
//         zoom={zoom} // Use the zoom state here
//         style={{ height: "80vh", width: "100%" }}
//       >
//         <ChangeView
//           center={[lastLocation.latitude, lastLocation.longitude]}
//           zoom={zoom} // Use the zoom state here
//         />
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {locations.map((location, idx) => (
//           <div key={idx}>
//             {location.latitude !== 0 && (
//               <Marker
//                 position={[location.latitude, location.longitude]}
//                 icon={L.icon({ iconUrl: markerIconPng })}
//               >
//                 <Popup>{location.name}</Popup>
//                 <Tooltip>{location.name}</Tooltip>
//               </Marker>
//             )}
//           </div>
//         ))}
//         <Polyline
//           positions={locations.map((location) => [
//             location.latitude,
//             location.longitude,
//           ])}
//           color="blue"
//         />
//       </MapContainer>
//       {/* {locations.map((location, idx) => (
//         <div key={idx}>
//           {location.latitude !== 0.0 ? <p>sample</p> : <p>-df-</p>}
//         </div>
//       ))} */}
//     </div>
//   );
// };

// export default MapNew;


// remove auto zooming effect to last location


import React from 'react'

export default function MapNew2() {
  return (
    <div>MapNew2</div>
  )
}
