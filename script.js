/* ============================
   SmartCity — main JS
============================ */

// Backend Test API
fetch("http://localhost:5000/api/test")
  .then(res => res.json())
  .then(data => console.log("Backend Connected →", data))
  .catch(err => console.error("Backend Error →", err));


/* ---------- Basic UI Navigation ---------- */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.sidebar nav a');
const pageTitle = document.getElementById('pageTitle');
const userGreeting = document.getElementById('userGreeting');

navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(n => n.classList.remove('active'));
    a.classList.add('active');

    const sec = a.dataset.section;
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sec).classList.add('active');

    pageTitle.innerText = a.innerText;
  });
});

/* Hamburger */
document.getElementById('hamburger').addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  sb.style.display = sb.style.display === 'block' ? 'none' : 'block';
});

/* ---------- Theme Toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('sc_theme') || 'dark';

if (currentTheme === 'light') document.body.classList.add('light');
themeToggle.checked = (currentTheme === 'light');

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('sc_theme',
    document.body.classList.contains('light') ? 'light' : 'dark'
  );
});

/* ---------- Login Modal ---------- */
const loginModal = document.getElementById('loginModal');
document.getElementById('openLogin').addEventListener('click', () => loginModal.style.display = 'flex');
document.getElementById('closeLogin').addEventListener('click', () => loginModal.style.display = 'none');

document.getElementById('loginForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const user = document.getElementById('username').value.trim();

  if (user) {
    userGreeting.innerText = user;
    loginModal.style.display = 'none';
    document.querySelector('[data-section="admin"]').style.display = 'block';
    alert(`Welcome, ${user} — You are logged in.`);
  }
});

document.querySelector('[data-section="admin"]').style.display = 'none';


/* ======================================================
      REAL SENSOR DATA FROM BACKEND  (MAIN FIX)
====================================================== */
let sensors = [];

async function loadSensorsFromBackend() {
  try {
    const res = await fetch("http://localhost:5000/api/sensors");
    sensors = await res.json();

    console.log("Loaded sensors from backend:", sensors);

    renderSensors();
    renderMapMarkers();
    updateChartsFromSensors();
    updateAnalyticsText();

  } catch (err) {
    console.error("Failed to load sensors:", err);
  }
}
loadSensorsFromBackend();


/* ---------- Live Updates ---------- */
let liveUpdates = true;
const sensorListEl = document.getElementById('sensorList');

function renderSensors() {
  sensorListEl.innerHTML = '';
  sensors.forEach(s => {
    const div = document.createElement('div');
    div.className = 'sensor-item';
    div.innerHTML =
      `<div><strong>${s.id}</strong> ${s.name}</div>
       <div>${s.value}${s.type === 'air' ? ' AQI' : s.type === 'energy' ? ' %' : ''}</div>`;
    sensorListEl.appendChild(div);
  });

  document.getElementById('kpi-sensors').innerText = sensors.length;
}

document.getElementById('toggleLive').addEventListener('click', () => {
  liveUpdates = !liveUpdates;
  document.getElementById('toggleLive').innerText = liveUpdates ? 'Pause Live' : 'Resume Live';
});

function randomWalk(v, min = 0, max = 100) {
  const delta = (Math.random() - 0.5) * 10;
  let nv = Math.round(v + delta);
  if (nv < min) nv = min;
  if (nv > max) nv = max;
  return nv;
}

function updateSensors() {
  if (!liveUpdates) return;

  sensors.forEach(s => {
    if (s.type === "air") s.value = randomWalk(s.value, 10, 300);
    else if (s.type === "traffic") s.value = randomWalk(s.value, 10, 100);
    else if (s.type === "energy") s.value = randomWalk(s.value, 10, 100);
    else s.value = randomWalk(s.value, 0, 120);
  });

  renderSensors();
  updateChartsFromSensors();
  updateAnalyticsText();
  refreshMarkerPopups();
}
setInterval(updateSensors, 3000);


/* ======================================================
                CHARTS
====================================================== */
let lineChart, pieChart, barChart, radarChart;

/* Line Chart */
lineChart = new Chart(document.getElementById('chartLine'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Traffic Index',
      data: [],
      borderWidth: 3,
      tension: 0.3
    }]
  },
  options: { responsive: true }
});

/* Pie Chart */
pieChart = new Chart(document.getElementById('chartPie'), {
  type: 'pie',
  data: {
    labels: ['Residential', 'Commercial', 'Industry', 'Transport'],
    datasets: [{
      data: [40, 30, 20, 10]
    }]
  }
});

/* Bar Chart */
function getSensorCounts() {
  const c = {};
  sensors.forEach(s => c[s.type] = (c[s.type] || 0) + 1);
  return c;
}

barChart = new Chart(document.getElementById('chartBar'), {
  type: 'bar',
  data: { labels: [], datasets: [{ label: 'Sensors', data: [] }] }
});

/* Radar Chart */
radarChart = new Chart(document.getElementById('chartRadar'), {
  type: 'radar',
  data: {
    labels: ['Air', 'Traffic', 'Energy', 'Safety', 'Water'],
    datasets: [{ label: 'Score', data: [70, 60, 75, 80, 65] }]
  }
});


function updateChartsFromSensors() {
  // Bar Chart
  const counts = getSensorCounts();
  barChart.data.labels = Object.keys(counts);
  barChart.data.datasets[0].data = Object.values(counts);
  barChart.update();

  // Line Chart (Traffic)
  const traffic = sensors.filter(s => s.type === 'traffic');
  const avg = traffic.length ?
    Math.round(traffic.reduce((a, b) => a + b.value, 0) / traffic.length) : 0;

  const time = new Date().toLocaleTimeString().replace(/:\d+ /, '');
  lineChart.data.labels.push(time);
  lineChart.data.labels = lineChart.data.labels.slice(-10);

  lineChart.data.datasets[0].data.push(avg);
  lineChart.data.datasets[0].data = lineChart.data.datasets[0].data.slice(-10);

  lineChart.update();

  // Radar chart
  const airAvg = sensors.filter(s => s.type === 'air')
    .reduce((a, b) => a + b.value, 0) / (sensors.filter(s => s.type === 'air').length || 1);

  const energyAvg = sensors.filter(s => s.type === 'energy')
    .reduce((a, b) => a + b.value, 0) / (sensors.filter(s => s.type === 'energy').length || 1);

  radarChart.data.datasets[0].data = [
    Math.round(airAvg),
    avg,
    Math.round(energyAvg),
    80,
    65
  ];
  radarChart.update();
}


/* ======================================================
                MAP + MARKERS
====================================================== */
const map = L.map('mapContainer', {
  center: [22.3072, 73.1812], zoom: 12
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  .addTo(map);

const markerClusterGroup = L.markerClusterGroup();
const markers = {};

const sensorIcons = {
  air: L.divIcon({ html: "🌫️", className: "air-icon" }),
  traffic: L.divIcon({ html: "🚗", className: "traffic-icon" }),
  energy: L.divIcon({ html: "⚡", className: "energy-icon" }),
  water: L.divIcon({ html: "💧", className: "water-icon" }),
  noise: L.divIcon({ html: "🔊", className: "noise-icon" }),
};

function renderMapMarkers() {
  markerClusterGroup.clearLayers();

  sensors.forEach(s => {
    const icon = sensorIcons[s.type] || L.divIcon({ html: "📍" });
    const marker = L.marker([s.lat, s.lon], { icon });

    marker.bindPopup(`
      <b>${s.name}</b><br>
      Type: ${s.type}<br>
      Value: ${s.value}<br>
    `);

    markers[s.id] = marker;
    markerClusterGroup.addLayer(marker);
  });

  map.addLayer(markerClusterGroup);
}

function refreshMarkerPopups() {
  sensors.forEach(s => {
    if (markers[s.id]) {
      markers[s.id].setPopupContent(`
        <b>${s.name}</b><br>
        Type: ${s.type}<br>
        Value: ${s.value}<br>
      `);
    }
  });
}


/* ======================================================
                ANALYTICS TEXT
====================================================== */
function updateAnalyticsText() {
  const air = sensors.filter(s => s.type === 'air');
  const traffic = sensors.filter(s => s.type === 'traffic');
  const energy = sensors.filter(s => s.type === 'energy');

  const avgAir = Math.round(air.reduce((a, b) => a + b.value, 0) / (air.length || 1));
  const avgTraffic = Math.round(traffic.reduce((a, b) => a + b.value, 0) / (traffic.length || 1));
  const avgEnergy = Math.round(energy.reduce((a, b) => a + b.value, 0) / (energy.length || 1));

  document.getElementById("analyticsText").innerHTML = `
    <ul>
      <li>Average AQI: <strong>${avgAir}</strong></li>
      <li>Avg Traffic Index: <strong>${avgTraffic}</strong></li>
      <li>Avg Energy Load: <strong>${avgEnergy}%</strong></li>
    </ul>
  `;
}


/* ======================================================
                AI PANE (CLIENT SIDE)
====================================================== */
document.getElementById('aiRun').addEventListener('click', () => {
  const p = document.getElementById('aiPrompt').value;
  const out = document.getElementById('aiOutput');

  const traffic = sensors.filter(s => s.type === 'traffic');
  const avg = Math.round(traffic.reduce((a, b) => a + b.value, 0) / (traffic.length || 1));

  const air = sensors.filter(s => s.type === 'air');
  const avgAir = Math.round(air.reduce((a, b) => a + b.value, 0) / (air.length || 1));

  out.innerHTML = `
    <strong>Prompt:</strong> ${p}<br>
    Suggested:
    Traffic avg ${avg}.  
    AQI ${avgAir}.  
    Optimize traffic signals + add green buffers.
  `;
});


/* ======================================================
   INITIAL UI SYNC
====================================================== */
setTimeout(() => {
  updateChartsFromSensors();
  updateAnalyticsText();
  renderSensors();
  renderMapMarkers();
}, 1000);

