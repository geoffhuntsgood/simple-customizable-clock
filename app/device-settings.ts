import { me as appbit } from "appbit";
import * as fs from "fs";
import { MessageEvent, peerSocket } from "messaging";
import { ActivityName } from "../types/activity-name";
import SettingsData from "../types/settings-data";
import StorageData from "../types/storage-data";
import * as funcs from "./app-functions";
import WeatherData from "../types/weather-data";
import document from "document";

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
    onMessage(event);
  };

  // On settings unload, saves settings to filesystem
  appbit.onunload = () => fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

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
      populateWeather(lastRetrievedWeather);
      break;
    default:
      settings[data.key] = data.value;
  }
  onsettingschange(settings);

  // Saves changed settings to the filesystem.
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

// Loads settings from filesystem.
export const loadSettings = (): SettingsData => {
  if (fs.existsSync(SETTINGS_FILE)) {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } else {
    console.warn(`${SETTINGS_FILE} does not exist. Writing a new one.`);
    fs.writeFileSync(SETTINGS_FILE, new SettingsData(), SETTINGS_TYPE);
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  }
}

// Toggles user activity order.
export const toggleOrder = (show: boolean, name: ActivityName, activityOrder: string[]): void => {
  if (show && activityOrder.indexOf(name) === -1) {
    activityOrder.push(name);
  } else if (!show && activityOrder.indexOf(name) !== -1) {
    activityOrder.splice(activityOrder.indexOf(name), 1);
  }
}

// Function that retrieves weather data and populates the clock face accordingly.
export const populateWeather = (weather: WeatherData): void => {
  if (weather !== null) {
    weatherDisplay.text = funcs.getUseCelsius() ? `${Math.floor(weather.celsius)}&deg;`
        : `${Math.floor(weather.fahrenheit)}&deg;`;
    weatherIcon.href = funcs.getConditionIconPath(weather.conditionCode, weather.daytime);
  } else {
    weatherDisplay.text = "--&deg;";
    weatherIcon.href = "icons/weather/sun.png";
  }
};
