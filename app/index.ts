import clock from "clock";
import document from "document";
import { battery, charger } from "power";
import { updateActivities } from "./app-functions-activities";
import { setDateAndTime, startHeartMonitoring, updateChargeDisplay } from "./app-functions-sensors";
import { initializeSettings } from "./app-functions-settings";
import * as settings from "./device-settings";

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
  startHeartMonitoring(heartDisplay);

  // Initialize and monitor battery percentage changes
  updateChargeDisplay(batteryDisplay);

  battery.onchange = () => {
    updateChargeDisplay(batteryDisplay);
  };

  charger.onchange = () => {
    updateChargeDisplay(batteryDisplay);
  };
};
startUp();

clock.ontick = () => {
  setTicks();
};

// Updates time, date and activity progress based on clock granularity.
const setTicks = (): void => {
  // Update date and time every tick
  if (dateDisplay && clockDisplay) {
    setDateAndTime(dateDisplay, clockDisplay);
  }

  // Update activity progress every tick
  updateActivities();
};

// Initializes settings for the app.
settings.initialize(initializeSettings);
