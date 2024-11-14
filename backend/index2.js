const express = require("express");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set } = require("firebase/database");
const moment = require("moment-timezone");
const cors = require("cors");
const fs = require("fs");

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
app.use(cors()); // Enable CORS

// Function to fetch data from Firebase and store it in a local JSON file
let previousDeviceTime = null; // Store the previous device time
let state = false; // Store the previous device time
const LastData1 = []; // Array to store the last 10 documents
const LastData2 = []; // Array to store the last 30 documents
const LastData3 = []; // Array to store the last 60 documents
const LastData4 = []; // Array to store the last 120 documents

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
    console.log(data.device1.state);
    if (currentDeviceTime === previousDeviceTime) {
      state = false;
      console.log("device offline");
      return;
    }

    const mockPath = "alarm";
    var mockData = {
      alarm: false,
    };
    if (
      data.device1.temperatureCelsius > 35.0 ||
      data.device1.doorStatus === true
    ) {
      mockData = {
        alarm: true,
      };
    }
    await set(ref(database, mockPath), mockData);

    previousDeviceTime = currentDeviceTime;
    const currentDateTime = moment().tz("Asia/Colombo").format();
    state = true;

    const document = {
      data,
      state,
      timestamp: currentDateTime,
    };
    console.log(LastData1);

    // Append data to JSON file
    fs.readFile("data.json", "utf8", (err, jsonData) => {
      const parsedData = err ? [] : JSON.parse(jsonData);
      parsedData.push(document);

      // Write updated data back to JSON file
      fs.writeFile("data.json", JSON.stringify(parsedData), (writeErr) => {
        if (writeErr) console.error("Error writing to data.json:", writeErr);
        else console.log("Data appended to data.json successfully.");
      });
    });

    // Push the document into LastData arrays
    LastData1.push(document);
    LastData2.push(document);
    LastData3.push(document);
    LastData4.push(document);

    if (LastData1.length > 10) LastData1.shift();
    if (LastData2.length > 30) LastData2.shift();
    if (LastData3.length > 60) LastData3.shift();
    if (LastData4.length > 120) LastData4.shift();
  } catch (error) {
    console.error("Error fetching data or storing to JSON:", error);
  }
}

// Schedule fetchDataAndUpdateJSON to run every 30 seconds
setInterval(fetchDataAndUpdateJSON, 30000);

// Routes
app.get("/data", async (req, res) => {
  try {
    await fetchDataAndUpdateJSON();
    res.status(200).json({ message: "Data fetched and stored successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/data3", async (req, res) => {
  console.log("object");
  res.send("Data3 route");
});

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

app.get("/history1", (req, res) => {
  res.json(LastData1);
  console.log(LastData1.length);
});

app.get("/history2", (req, res) => {
  res.json(LastData2);
  console.log(LastData2.length);
});

app.get("/history3", (req, res) => {
  res.json(LastData3);
  console.log(LastData3.length);
});

app.get("/history4", (req, res) => {
  res.json(LastData4);
  console.log(LastData4.length);
});

// New route to retrieve the latest 20 entries from local JSON file
app.get("/last", (req, res) => {
  fs.readFile("data.json", "utf8", (err, jsonData) => {
    if (err) {
      res.status(500).json({ error: "Error reading data file" });
      return;
    }
    const parsedData = JSON.parse(jsonData);
    const latestEntries = parsedData.slice(-20).reverse();
    res.json(latestEntries);
  });
});

// Start the server
const PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
