const express = require('express');
const router = express.Router();
const SensorReading = require('../models/SensorReading');

router.post('/', async (req, res) => {
  const { sensorId, value, unit } = req.body;
  if (!sensorId || value === undefined)
    return res.status(400).json({ msg: "sensorId & value required" });

  try {
    const reading = new SensorReading({ sensor: sensorId, value, unit });
    await reading.save();
    res.json({ ok: true, reading });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
