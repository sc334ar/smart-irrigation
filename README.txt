# SmartFarm Irrigation Website

## Files
- index.html — dashboard structure
- style.css — design
- script.js — dashboard behavior and demo sensor data

## Current version
This version runs without hardware. It simulates soil moisture, temperature and humidity and provides:
- Smart moisture mode
- Scheduled watering settings
- Manual watering
- Moisture graph
- Measurement table
- Science-fair statistics

## Next hardware step
Connect the website to an ESP32. The ESP32 can receive data from the Arduino through serial communication and expose an HTTP API such as:

GET /data
POST /settings
POST /water

The ESP32 should then communicate with the Arduino, while the Arduino controls the sensors and relay/pump.

Important: use an appropriate relay/driver and separate suitable power supply for the pump. Do not power a pump directly from a microcontroller GPIO pin.
