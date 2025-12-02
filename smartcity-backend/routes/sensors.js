const express = require("express");
const router = express.Router();

// dummy sensors data (frontend को test के लिए)
const sensors = [
  { id: 1, name: "Air Sensor 1", type: "air", value: 72 },
  { id: 2, name: "Traffic Sensor 1", type: "traffic", value: 35 },
  { id: 3, name: "Energy Sensor 1", type: "energy", value: 56 }
];

// GET sensors
router.get("/", (req, res) => {
  res.json(sensors);
});

module.exports = router;
