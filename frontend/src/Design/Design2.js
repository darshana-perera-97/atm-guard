import React, { useEffect, useState } from "react";
import config from "./config";

export default function Design2() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${config.backendUrl}/data`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Design2</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
