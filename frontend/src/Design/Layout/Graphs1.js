import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Graph1 = (prop) => {
  const [chartDataTem, setChartDataTem] = useState({});
  const [chartDataGrid, setChartDataGrid] = useState({});
  const [chartDataDoor, setChartDataDoor] = useState({});
  const [chartDataVoltage, setChartDataVoltage] = useState({});
  const [chartDataAngles, setChartDataAngles] = useState({}); // Combined state for angle data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [link, setLink] = useState(
    "https://basic-node-js-backend.onrender.com/history4"
  );
  // console.log(link);
  const fetchData = async () => {
    try {
      setLink(prop.link);
      const response = await fetch(prop.link);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      // console.log("Fetched data:", result[0].timestamp);

      processChartData(result);
      setLoading(false);
      //   console.log(link);
      // console.log(prop.link);
    } catch (error) {
      // console.error("Reload page to fetch data");
      setError(error.message);
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
  };

  const processChartData = (data) => {
    const labels = data.map((entry) => formatDateTime(entry.timestamp));
    const valuesTem = data.map(
      (entry) => entry.data.device1.temperatureCelsius
    );
    const valuesGrid = data.map((entry) => entry.data.device1.gridStatus);
    const valuesDoor = data.map((entry) => entry.data.device1.doorStatus);
    const valuesVoltage = data.map((entry) => entry.data.device1.voltage);
    const valuesAngleX = data.map((entry) => entry.data.device1.angleX);
    const valuesAngleY = data.map((entry) => entry.data.device1.angleY);
    const valuesAngleZ = data.map((entry) => entry.data.device1.angleZ);

    setChartDataTem({
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: valuesTem,
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    });

    setChartDataGrid({
      labels,
      datasets: [
        {
          label: "Grid",
          data: valuesGrid,
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    });

    // setChartDataDoor({
    //   labels,
    //   datasets: [
    //     {
    //       label: "Door Status",
    //       data: valuesDoor,
    //       fill: false,
    //       backgroundColor: "rgba(192, 75, 192, 0.2)",
    //       borderColor: "rgba(192, 75, 192, 1)",
    //     },
    //   ],
    // });

    setChartDataVoltage({
      labels,
      datasets: [
        {
          label: "Voltage",
          data: valuesVoltage,
          fill: false,
          backgroundColor: "rgba(192, 192, 75, 0.2)",
          borderColor: "rgba(192, 192, 75, 1)",
        },
      ],
    });

    setChartDataAngles({
      labels,
      datasets: [
        {
          label: "Angle X",
          data: valuesAngleX,
          fill: false,
          backgroundColor: "rgba(192, 75, 75, 0.2)",
          borderColor: "rgba(192, 75, 75, 1)",
        },
        {
          label: "Angle Y",
          data: valuesAngleY,
          fill: false,
          backgroundColor: "rgba(75, 192, 75, 0.2)",
          borderColor: "rgba(75, 192, 75, 1)",
        },
        {
          label: "Angle Z",
          data: valuesAngleZ,
          fill: false,
          backgroundColor: "rgba(75, 75, 192, 0.2)",
          borderColor: "rgba(75, 75, 192, 1)",
        },
      ],
    });
    setChartDataDoor({
      labels,
      datasets: [
        {
          label: "Door Status",
          data: valuesDoor,
          fill: false,
          backgroundColor: "rgba(192, 75, 192, 0.2)",
          borderColor: "rgba(192, 75, 192, 1)",
        },
        {
          label: "Voltage",
          data: valuesVoltage,
          fill: false,
          backgroundColor: "rgba(192, 192, 75, 0.2)",
          borderColor: "rgba(192, 192, 75, 1)",
        },
        {
          label: "Grid",
          data: valuesGrid,
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    });
  };

  useEffect(() => {
    console.log("Component mounted or timeFilter changed:", prop.timeFilter); // Log when component mounts or timeFilter changes
    fetchData();
    const intervalId = setInterval(() => {
      console.log("Fetching data again..."); // Log when data is fetched again
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [prop.timeFilter]); // Include prop.timeFilter in the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const options = {
    scales: {
      y: {
        min: 0,
      },
    },
  };

  return (
    <div>
      <h4>Device Angles (X, Y, Z)</h4>
      <Line data={chartDataAngles} />
      <h4 className="mt-4">Door Temperature</h4>
      <Line data={chartDataTem} options={options} />
      {/* <h4>Grid</h4>
      <Line data={chartDataGrid} options={options} />
      <h4>Door Status</h4>
      <Line data={chartDataDoor} options={options} />
      */}
      {/* <h4>Voltage</h4>
      <Line data={chartDataVoltage} options={options} /> */}
      <h4 className="mt-4">Door State | Grid State | Battery Voltage</h4>
      <Line data={chartDataDoor} options={options} />
    </div>
  );
};

export default Graph1;
