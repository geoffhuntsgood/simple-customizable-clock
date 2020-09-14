import {me} from 'appbit';
import * as fs from 'fs';
import * as messaging from 'messaging';
import SettingsData from '../types/settings-data';
import StorageData from '../types/storage-data';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings: SettingsData;
let onsettingschange: Function;

export function initialize(callback: Function): void {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

// Change settings based on received message
messaging.peerSocket.onmessage = (event: messaging.MessageEvent) => {
  let data: StorageData = event.data;
  switch (data.key) {
    case 'backgroundColor':
      settings.backgroundColor = data.value as string;
      break;
    case 'dateColor':
      settings.dateColor = data.value as string;
      break;
    case 'timeColor':
      settings.timeColor = data.value as string;
      break;
    case 'batteryColor':
      settings.batteryColor = data.value as string;
      break;
    case 'weatherColor':
      settings.weatherColor = data.value as string;
      break;
    case 'heartColor':
      settings.heartColor = data.value as string;
      break;
    case 'activeZoneMinutesColor':
      settings.activeZoneMinutes.color = data.value as string;
      break;
    case 'caloriesColor':
      settings.calories.color = data.value as string;
      break;
    case 'distanceColor':
      settings.distance.color = data.value as string;
      break;
    case 'elevationGainColor':
      settings.elevationGain.color = data.value as string;
      break;
    case 'stepsColor':
      settings.steps.color = data.value as string;
      break;
    case 'activeZoneMinutesShow':
      settings.activeZoneMinutes.visible = data.value as boolean;
      break;
    case 'caloriesShow':
      settings.calories.visible = data.value as boolean;
      break;
    case 'distanceShow':
      settings.distance.visible = data.value as boolean;
      break;
    case 'elevationGainShow':
      settings.elevationGain.visible = data.value as boolean;
      break;
    case 'stepsShow':
      settings.steps.visible = data.value as boolean;
      break;
    case 'baseHeartRateShow':
      settings.baseHeartRateShow = data.value as boolean;
      break;
    case undefined:
      // Non-setting message, most likely weather data
      break;
    default:
      console.warn(`Incorrect setting field ${data.key} passed via StorageData.`);
      break;
  }
  onsettingschange(settings);
};

// On settings unload, save settings to filesystem
me.onunload = () => fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);

// Load settings from filesystem
function loadSettings(): SettingsData {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.warn(`Unable to read from ${SETTINGS_FILE}.`);
    return new SettingsData();
  }
}
