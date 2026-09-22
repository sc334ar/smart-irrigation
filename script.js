// 🌱 SmartFarm Multi-System Dashboard
// Version 1: Two simulated irrigation systems

const systems = {
  system1: {
    name: "Greenhouse",
    moisture: 42,
    temperature: 25,
    humidity: 68,
    waterUsed: 0,
    pump: false,
    events: 0,
    history: [],
    lastWatering: "Never",
    threshold: 35,
    duration: 20,
    mode: "auto",
    crop: "Beans"
  },

  system2: {
    name: "Vegetable Garden",
    moisture: 31,
    temperature: 27,
    humidity: 61,
    waterUsed: 0,
    pump: false,
    events: 0,
    history: [],
    lastWatering: "Never",
    threshold: 35,
    duration: 20,
    mode: "auto",
    crop: "Vegetables"
  }
};

let selectedSystem = "system1";

// Get HTML elements
const moisture = document.getElementById("moisture");
const moistureBar = document.getElementById("moistureBar");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const waterUsed = document.getElementById("waterUsed");

const pumpStatus = document.getElementById("pumpStatus");
const arduinoStatus = document.getElementById("arduinoStatus");
const lastWatering = document.getElementById("lastWatering");
const cropStatus = document.getElementById("cropStatus");

const mode = document.getElementById("mode");
const threshold = document.getElementById("threshold");
const duration = document.getElementById("duration");

const startTime = document.getElementById("startTime");
const interval = document.getElementById("interval");

const autoControls = document.getElementById("autoControls");
const scheduleControls = document.getElementById("scheduleControls");

const saveButton = document.getElementById("save");
const waterButton = document.getElementById("waterNow");
const message = document.getElementById("message");

const crop = document.getElementById("crop");
const historyTable = document.getElementById("historyTable");

const events = document.getElementById("events");
const totalWater = document.getElementById("totalWater");
const averageMoisture = document.getElementById("averageMoisture");

const connection = document.getElementById("connection");

// ----------------------------------------------------
// CREATE FARM SYSTEM SELECTOR
// ----------------------------------------------------

function createSystemSelector() {

  const main = document.querySelector("main");
  const cards = document.querySelector(".cards");

  if (!main || !cards) return;

  const section = document.createElement("section");

  section.className = "panel system-selector";

  section.innerHTML = `
    <h2>🌱 Farm Systems</h2>

    <label>Select irrigation system</label>

    <select id="systemSelect">
      <option value="system1">🟢 System 1 — Greenhouse</option>
      <option value="system2">🟢 System 2 — Vegetable Garden</option>
    </select>

    <p id="selectedSystemText">
      Currently viewing: Greenhouse
    </p>
  `;

  main.insertBefore(section, cards);

  document
    .getElementById("systemSelect")
    .addEventListener("change", function () {

      selectedSystem = this.value;

      loadSystem();

    });
}

// ----------------------------------------------------
// GET CURRENT SYSTEM
// ----------------------------------------------------

function getSystem() {
  return systems[selectedSystem];
}

// ----------------------------------------------------
// LOAD SELECTED SYSTEM
// ----------------------------------------------------

function loadSystem() {

  const system = getSystem();

  document.getElementById("selectedSystemText").textContent =
    "Currently viewing: " + system.name;

  moisture.textContent =
    Math.round(system.moisture) + "%";

  moistureBar.style.width =
    Math.max(0, Math.min(100, system.moisture)) + "%";

  temperature.textContent =
    system.temperature.toFixed(1) + " °C";

  humidity.textContent =
    Math.round(system.humidity) + "%";

  waterUsed.textContent =
    system.waterUsed.toFixed(2);

  pumpStatus.textContent =
    system.pump ? "ON" : "OFF";

  arduinoStatus.textContent =
    "Connected";

  lastWatering.textContent =
    system.lastWatering;

  cropStatus.textContent =
    system.crop;

  threshold.value =
    system.threshold;

  duration.value =
    system.duration;

  mode.value =
    system.mode;

  crop.value =
    system.crop;

  updateControls();

  updateHistory();

  updateStatistics();

  drawChart();

}

// ----------------------------------------------------
// CONTROL MODE
// ----------------------------------------------------

function updateControls() {

  if (mode.value === "auto") {

    autoControls.classList.remove("hidden");
    scheduleControls.classList.add("hidden");

  } else if (mode.value === "schedule") {

    autoControls.classList.add("hidden");
    scheduleControls.classList.remove("hidden");

  } else {

    autoControls.classList.add("hidden");
    scheduleControls.classList.add("hidden");

  }

}

mode.addEventListener("change", function () {

  const system = getSystem();

  system.mode = mode.value;

  updateControls();

});

// ----------------------------------------------------
// SAVE SETTINGS
// ----------------------------------------------------

saveButton.addEventListener("click", function () {

  const system = getSystem();

  system.threshold = Number(threshold.value);
  system.duration = Number(duration.value);
  system.mode = mode.value;
  system.crop = crop.value;

  cropStatus.textContent = system.crop;

  message.textContent =
    "Settings saved for " + system.name + ".";

  message.className = "message";

});

// ----------------------------------------------------
// MANUAL WATERING
// ----------------------------------------------------

waterButton.addEventListener("click", function () {

  startWatering();

});

// ----------------------------------------------------
// START WATERING
// ----------------------------------------------------

function startWatering() {

  const system = getSystem();

  if (system.pump) {

    message.textContent =
      "Pump is already running.";

    return;

  }

  system.pump = true;

  system.events++;

  system.lastWatering =
    new Date().toLocaleTimeString();

  pumpStatus.textContent = "ON";

  message.textContent =
    "💧 Watering " + system.name + "...";

  updateHistory();
  updateStatistics();

  // Simulate watering for selected duration
  const wateringTime =
    Math.max(1, system.duration) * 1000;

  setTimeout(function () {

    system.pump = false;

    // Simulate water usage
    system.waterUsed +=
      Math.max(0.5, system.duration * 0.08);

    // Increase soil moisture
    system.moisture =
      Math.min(100, system.moisture + 8);

    pumpStatus.textContent = "OFF";

    message.textContent =
      "✅ Watering completed for " +
      system.name + ".";

    addMeasurement();

    updateHistory();
    updateStatistics();
    drawChart();

  }, wateringTime);

}

// ----------------------------------------------------
// AUTOMATIC IRRIGATION
// ----------------------------------------------------

function automaticIrrigation() {

  const system = getSystem();

  if (system.mode !== "auto") return;

  if (system.moisture <= system.threshold &&
      !system.pump) {

    startWatering();

  }

}

// ----------------------------------------------------
// SIMULATE SENSOR DATA
// ----------------------------------------------------

function simulateSensors() {

  Object.keys(systems).forEach(function (id) {

    const system = systems[id];

    // Natural moisture decrease
    if (!system.pump) {

      system.moisture -=
        Math.random() * 1.2;

    }

    // Temperature variation
    system.temperature +=
      (Math.random() - 0.5) * 0.4;

    system.temperature =
      Math.max(18, Math.min(35, system.temperature));

    // Humidity variation
    system.humidity +=
      (Math.random() - 0.5) * 2;

    system.humidity =
      Math.max(35, Math.min(90, system.humidity));

    system.moisture =
      Math.max(5, Math.min(100, system.moisture));

    // Save measurement
    system.history.push({
      time: new Date().toLocaleTimeString(),
      moisture: system.moisture,
      temperature: system.temperature,
      humidity: system.humidity,
      pump: system.pump
    });

    // Keep last 30 measurements
    if (system.history.length > 30) {
      system.history.shift();
    }

  });

  loadSystem();

  automaticIrrigation();

}

// ----------------------------------------------------
// ADD MEASUREMENT
// ----------------------------------------------------

function addMeasurement() {

  const system = getSystem();

  system.history.push({

    time: new Date().toLocaleTimeString(),

    moisture: system.moisture,

    temperature: system.temperature,

    humidity: system.humidity,

    pump: system.pump

  });

  if (system.history.length > 30) {
    system.history.shift();
  }

}

// ----------------------------------------------------
// HISTORY TABLE
// ----------------------------------------------------

function updateHistory() {

  historyTable.innerHTML = "";

  const system = getSystem();

  const recent =
    system.history.slice(-10).reverse();

  recent.forEach(function (item) {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.time}</td>
      <td>${item.moisture.toFixed(1)}%</td>
      <td>${item.temperature.toFixed(1)} °C</td>
      <td>${item.humidity.toFixed(1)}%</td>
      <td>${item.pump ? "ON" : "OFF"}</td>
    `;

    historyTable.appendChild(row);

  });

}

// ----------------------------------------------------
// STATISTICS
// ----------------------------------------------------

function updateStatistics() {

  const system = getSystem();

  events.textContent =
    system.events;

  totalWater.textContent =
    system.waterUsed.toFixed(2);

  if (system.history.length > 0) {

    const total =
      system.history.reduce(
        (sum, item) => sum + item.moisture,
        0
      );

    const average =
      total / system.history.length;

    averageMoisture.textContent =
      average.toFixed(1);

  } else {

    averageMoisture.textContent =
      system.moisture.toFixed(1);

  }

}

// ----------------------------------------------------
// SIMPLE MOISTURE GRAPH
// ----------------------------------------------------

function drawChart() {

  const canvas =
    document.getElementById("chart");

  if (!canvas) return;

  const ctx =
    canvas.getContext("2d");

  const system = getSystem();

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const data =
    system.history.slice(-20);

  if (data.length < 2) {

    ctx.font = "16px Arial";

    ctx.fillText(
      "Collecting sensor data...",
      20,
      40
    );

    return;

  }

  const width =
    canvas.width;

  const height =
    canvas.height;

  const padding = 40;

  // Background
  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  // Axes
  ctx.strokeStyle = "#444";

  ctx.beginPath();

  ctx.moveTo(
    padding,
    padding
  );

  ctx.lineTo(
    padding,
    height - padding
  );

  ctx.lineTo(
    width - padding,
    height - padding
  );

  ctx.stroke();

  // Graph line
  ctx.strokeStyle = "#2e7d32";

  ctx.lineWidth = 3;

  ctx.beginPath();

  data.forEach(function (item, index) {

    const x =
      padding +
      (index / (data.length - 1)) *
      (width - padding * 2);

    const y =
      height -
      padding -
      (item.moisture / 100) *
      (height - padding * 2);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

  });

  ctx.stroke();

  ctx.fillStyle = "#222";

  ctx.font = "14px Arial";

  ctx.fillText(
    "100%",
    5,
    padding
  );

  ctx.fillText(
    "0%",
    15,
    height - padding
  );

  ctx.fillText(
    system.name + " — Soil Moisture",
    50,
    20
  );

}

// ----------------------------------------------------
// CONNECTION STATUS
// ----------------------------------------------------

function setDemoConnection() {

  connection.textContent =
    "ESP32 Demo Mode";

  connection.classList.remove("offline");

  connection.classList.add("online");

}

// ----------------------------------------------------
// START DASHBOARD
// ----------------------------------------------------

createSystemSelector();

setDemoConnection();

// Initial measurements
Object.keys(systems).forEach(function (id) {

  const system = systems[id];

  for (let i = 0; i < 5; i++) {

    system.history.push({

      time: new Date(
        Date.now() - (4 - i) * 3000
      ).toLocaleTimeString(),

      moisture:
        system.moisture +
        (Math.random() * 6 - 3),

      temperature:
        system.temperature,

      humidity:
        system.humidity,

      pump: false

    });

  }

});

loadSystem();

// Update sensors every 5 seconds
setInterval(function () {

  simulateSensors();

}, 5000);
