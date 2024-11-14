const express = require("express");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set } = require("firebase/database");
const moment = require("moment-timezone");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuU5qac9KqPpLt4_d6B5OEKPZWua5YqVk",
  authDomain: "atm--project.firebaseapp.com",
  databaseURL:
    "https://atm--project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "atm--project",
  storageBucket: "atm--project.appspot.com",
  messagingSenderId: "5612719051",
  appId: "1:5612719051:web:28b7904ad325f86b39c44e",
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const app = express();

let alerts = [];
let tdoor = "";
let ttemp = "";
let tgrid = "";
let tgas = "";
let tmotion = "";

app.use(cors()); // Enable CORS

// Path to local JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Load data from JSON file
function loadData() {
  if (fs.existsSync(dataFilePath)) {
    const fileContent = fs.readFileSync(dataFilePath);
    return JSON.parse(fileContent);
  }
  return [];
}

// Save data to JSON file
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Function to fetch data from Firebase and store it in the JSON file
let previousDeviceTime = null;
let state = false;
const LastData1 = [];
const LastData2 = [];
const LastData3 = [];
const LastData4 = [];

async function fetchDataAndUpdateJSON() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      console.error("No data available");
      return;
    }

    const data = snapshot.val();
    let currentDeviceTime = data.device1.state;
    if (currentDeviceTime === previousDeviceTime) {
      state = false;
      console.log("Device offline");
      return;
    } else {
      state = true;
      console.log("Device online");
    }

    const mockPath = "alarm";
    const mockData = { alarm: data.device1.temperatureCelsius > 40.0 };
    await set(ref(database, mockPath), mockData);

    previousDeviceTime = currentDeviceTime;

    const currentDateTime = moment().tz("Asia/Colombo").format();

    const document = {
      data,
      state,
      timestamp: currentDateTime,
    };

    if (tdoor !== data.device1.doorStatus) {
      tdoor = data.device1.doorStatus;
      alerts.push({ item: "door", state: tdoor, time: currentDateTime });
    }
    if (tmotion !== data.device1.moction) {
      tmotion = data.device1.moction;
      alerts.push({ item: "move", state: tmotion, time: currentDateTime });
    }
    if (tgas !== data.device1.gasStatus) {
      tgas = data.device1.gasStatus;
      alerts.push({ item: "gas", state: tgas, time: currentDateTime });
    }
    if (tgrid !== data.device1.gridStatus) {
      tgrid = data.device1.gridStatus;
      alerts.push({ item: "grid", state: tgrid, time: currentDateTime });
    }

    const existingData = loadData();
    existingData.push(document);
    saveData(existingData);

    LastData1.push(document);
    LastData2.push(document);
    LastData3.push(document);
    LastData4.push(document);

    if (LastData1.length > 10) LastData1.shift();
    if (LastData2.length > 30) LastData2.shift();
    if (LastData3.length > 60) LastData3.shift();
    if (LastData4.length > 120) LastData4.shift();

    console.log(`Document saved to local JSON file`);
  } catch (error) {
    console.error("Error fetching data or storing to JSON:", error);
  }
}

// Schedule fetchDataAndUpdateJSON to run every 30 seconds
setInterval(fetchDataAndUpdateJSON, 5000);

// Route to fetch data from Firebase and store it in the JSON file
app.get("/data", async (req, res) => {
  try {
    await fetchDataAndUpdateJSON();
    res.status(200).json({ message: "Data fetched and stored successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch data from Firebase without storing it in the JSON file
app.get("/data2", async (req, res) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      res.status(404).json({ error: "No data available" });
      return;
    }

    const data = snapshot.val();
    const currentDateTime = moment().tz("Asia/Colombo").format();

    const responseData = {
      data,
      state,
      timestamp: currentDateTime,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to retrieve data from the JSON file
app.get("/fetch-data", (req, res) => {
  try {
    const data = loadData();
    if (data.length === 0) {
      res.status(404).json({ error: "No data found in the JSON file" });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from JSON:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Routes to retrieve historical data
app.get("/history1", (req, res) => res.json(LastData1));
app.get("/history2", (req, res) => res.json(LastData2));
app.get("/history3", (req, res) => res.json(LastData3));
app.get("/history4", (req, res) => res.json(LastData4));
app.get("/alerts", (req, res) => res.json(alerts));

// Route to reset alerts
app.get("/resetAllert", (req, res) => {
  alerts = [];
  res.status(200).json({ message: "Alerts reset successfully" });
});

// Start the server
const PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
