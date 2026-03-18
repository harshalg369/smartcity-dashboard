live: https://codesandbox.io/p/sandbox/github/harshalg369/smartcity-dashboard

# my-smart-vadodara-dashboard
🏙️ Smart City Dashboard — Modern Urban Monitoring System

A full-stack Smart City monitoring platform that visualizes live sensor data, environmental readings, and city analytics using interactive dashboards.

This project contains:

🌐 Frontend Dashboard (HTML • CSS • JavaScript)

🔧 Backend API (Node.js • Express • MongoDB)

📡 Live Sensor Data Support

📊 Leaflet Maps, Charts.js, Cluster Maps

🔐 User Authentication + Admin Seed Script

📸 Screenshots

(You can upload screenshots later and replace these placeholders)

/screenshots/dashboard.png
/screenshots/map-view.png
/screenshots/mobile-view.png

⭐ Features
🔹 Frontend

Interactive Smart City Dashboard

Live map using Leaflet.js

Charts & Graphs using Chart.js

Sensor clustering

Clean UI with responsive design

🔹 Backend

REST APIs built using Express.js

MongoDB data models for sensors & readings

JWT-based authentication

Admin seeding script

Secure environment variable support

🔹 General

Modular folder structure

Scalable backend

Easy deployment ready

Secure configuration using .env

🛠️ Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript, Leaflet.js, Chart.js
Backend	Node.js, Express.js
Database	MongoDB
Authentication	JWT
Tools	Git, VS Code
📂 Project Structure
smartcity-dashboard/
│
├── index.html
├── script.js
├── styles.css
│
└── smartcity-backend/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── Sensor.js
    │   ├── SensorReading.js
    │   └── User.js
    ├── routes/
    │   ├── sensors.js
    │   ├── readings.js
    │   └── auth.js
    ├── scripts/
    │   └── seedAdmin.js
    ├── app.js
    ├── package.json
    └── README.md
<img width="1920" height="1140" alt="image" src="https://github.com/user-attachments/assets/4fd1ada0-4f9b-4c07-9a86-c4a87a900f8e" />

🚀 Installation & Setup
📌 1. Clone the Repository
git clone https://github.com/harshalg369/smartcity-dashboard
cd smartcity-dashboard

📌 2. Frontend Setup

No installation required — static files.

Run using live server:

Open index.html with Live Server

📌 3. Backend Setup

Go inside backend folder:

cd smartcity-backend


Install dependencies:

npm install

📌 4. Environment Variables

Create a .env file in smartcity-backend/:

MONGO_URI=your-mongo-url
JWT_SECRET=your-secret-key
PORT=5000

📌 5. Start Backend Server
npm start


Backend runs on:

http://localhost:5000

🔌 API Endpoints
👤 Auth
Method	Endpoint	Description
POST	/api/auth/login	User login
📡 Sensors
Method	Endpoint	Description
GET	/api/sensors	Get all sensors
POST	/api/sensors	Add sensor
📈 Readings
Method	Endpoint	Description
GET	/api/readings	Get all readings
POST	/api/readings	Add reading
🌍 Deployment
🟢 Frontend (GitHub Pages)
Simply host index.html on GitHub Pages.

🔵 Backend (Render / Railway)

Steps:

Create new service

Upload backend directory

Add environment variables

Deploy

(If you want, I can generate deployment files for Render/Railway also.)

👤 Author

Harshal Ghuge 
Smart City Dashboard Developer

📜 License

This project is licensed under the MIT License.

