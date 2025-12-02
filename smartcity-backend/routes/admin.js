const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

router.post('/sensor', async (req, res) => {
  try {
    const sensor = new Sensor(req.body);
    await sensor.save();
    res.json(sensor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
