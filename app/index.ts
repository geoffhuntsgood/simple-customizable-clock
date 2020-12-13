import clock from "clock";
import document from "document";
import { battery, charger } from "power";
import * as settings from "./device-settings";
import * as funcs from "./app-functions";
import WeatherData from "../types/weather-data";

// Elements that are frequently referred to.
const heartDisplay = document.getElementById("heartDisplay") as TextElement;
const batteryDisplay = document.getElementById("batteryDisplay") as TextElement;
const dateDisplay = document.getElementById("dateDisplay") as TextElement;
const clockDisplay = document.getElementById("clockDisplay") as TextElement;

// Starts the running services for the clock face.
const startUp = (): void => {
  // Set up clock activities
  clock.granularity = "seconds";

  // Initialize heart rate monitoring
  funcs.startHeartMonitoring(heartDisplay);

  // Initialize and monitor battery percentage changes
  funcs.updateChargeDisplay(batteryDisplay);

  battery.onchange = () => {
    funcs.updateChargeDisplay(batteryDisplay);
  };

  charger.onchange = () => {
    funcs.updateChargeDisplay(batteryDisplay);
  };
};
startUp();

clock.ontick = () => {
  setTicks();
};

// Updates time, date and activity progress based on clock granularity.
const setTicks = (): void => {
  // Update date and time every tick
  funcs.setDateAndTime(dateDisplay, clockDisplay);

  // Update activity progress every tick
  funcs.updateActivities();
};

// Initializes settings for the app.
settings.initialize(funcs.initializeSettings);
