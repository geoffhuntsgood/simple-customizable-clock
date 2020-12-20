import { me as appbit } from "appbit";
import document from "document";
import * as fs from "fs";
import { MessageEvent, peerSocket } from "messaging";
import { ActivityName } from "../types/activity-name";
import SettingsData from "../types/settings-data";
import StorageData from "../types/storage-data";
import WeatherData from "../types/weather-data";
import { getUseCelsius, setUseCelsius } from "./app-functions-settings";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let settings: SettingsData;
let onsettingschange: Function;
let lastRetrievedWeather: WeatherData;

const weatherIcon = document.getElementById("weatherIcon") as ImageElement;
const weatherDisplay = document.getElementById("weatherDisplay") as TextElement;

// Sets up setting initialization callback.
export const initialize = (callback: Function): void => {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);

  // Adds settings change hook
  peerSocket.onmessage = (event: MessageEvent) => {
    console.debug("Receiving message: " + JSON.stringify(event.data));
    onMessage(event);
  };

  // On settings unload, saves settings to filesystem
  appbit.onunload = () => fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
};

// Changes settings based on a received message.
export const onMessage = (event: MessageEvent): void => {
  let data: StorageData = event.data;
  switch (data.key) {
    case null:
      break;
    case "weather":
      let weather: WeatherData = JSON.parse(data.value);
      populateWeather(weather);
      lastRetrievedWeather = weather;
      break;
    case "activeZoneMinutesShow":
      toggleOrder(data.value, ActivityName.activeZoneMinutes, settings.activityOrder);
      break;
    case "caloriesShow":
      toggleOrder(data.value, ActivityName.calories, settings.activityOrder);
      break;
    case "distanceShow":
      toggleOrder(data.value, ActivityName.distance, settings.activityOrder);
      break;
    case "elevationGainShow":
      toggleOrder(data.value, ActivityName.elevationGain, settings.activityOrder);
      break;
    case "stepsShow":
      toggleOrder(data.value, ActivityName.steps, settings.activityOrder);
      break;
    case "useCelsius":
      settings.useCelsius = data.value;
      setUseCelsius(data.value);
      populateWeather(lastRetrievedWeather);
      break;
    default:
      settings[data.key] = data.value;
  }
  onsettingschange(settings);

  // Saves changed settings to the filesystem.
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
};

// Loads settings from filesystem.
export const loadSettings = (): SettingsData => {
  if (fs.existsSync(SETTINGS_FILE)) {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } else {
    console.log(`${SETTINGS_FILE} does not exist. Writing a new one.`);
    fs.writeFileSync(SETTINGS_FILE, new SettingsData(), SETTINGS_TYPE);
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  }
};

// Toggles user activity order.
export const toggleOrder = (show: boolean, name: ActivityName, activityOrder: string[]): void => {
  if (show && activityOrder.indexOf(name) === -1) {
    activityOrder.push(name);
  } else if (!show && activityOrder.indexOf(name) !== -1) {
    activityOrder.splice(activityOrder.indexOf(name), 1);
  }
};

// Function that retrieves weather data and populates the clock face accordingly.
export const populateWeather = (weather: WeatherData | null): void => {
  if (weather) {
    weatherDisplay.text = getUseCelsius()
        ? `${Math.floor(weather.celsius)}&deg;`
        : `${Math.floor(weather.fahrenheit)}&deg;`;
    weatherIcon.href = getConditionIconPath(weather.conditionCode, weather.daytime);
  } else {
    weatherDisplay.text = "--&deg;";
    weatherIcon.href = "icons/weather/sun.png";
  }
};

export const getConditionIconPath = (code: number, isDay: boolean = true): string => {
  if (code < 300) {
    return "icons/weather/cloud-lightning.png";
  } else if (code < 400) {
    return "icons/weather/cloud-drizzle.png";
  } else if (code < 500) {
    return "icons/weather/cloud-rain.png";
  } else if (code < 600) {
    return "icons/weather/cloud-snow.png";
  } else if (code < 700) {
    return "icons/weather/fog.png";
  } else if (code === 801 || code === 802) {
    return isDay ? "icons/weather/cloud-sun.png" : "icons/weather/cloud-moon.png";
  } else if (code === 803 || code === 804) {
    return "icons/weather/cloud.png";
  } else {
    return isDay ? "icons/weather/sun.png" : "icons/weather/moon-stars.png";
  }
};
