import {me as appbit} from 'appbit';
import * as fs from 'fs';
import * as messaging from 'messaging';
import SettingsData from '../types/settings-data';
import StorageData from '../types/storage-data';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings: SettingsData;
let onsettingschange: Function;

// Sets up setting initialization callback.
export function initialize(callback: Function): void {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

// Changes settings based on received message.
messaging.peerSocket.onmessage = (event: messaging.MessageEvent) => {
  let data: StorageData = event.data;
  switch (data.key) {
    case undefined:
      // Non-setting message, most likely weather data
      break;
    case 'activeZoneMinutesColor':
      settings.activeZoneMinutes.color = data.value as string;
      break;
    case 'activeZoneMinutesShow':
      settings.activeZoneMinutes.visible = data.value as boolean;
      break;
    case 'caloriesColor':
      settings.calories.color = data.value as string;
      break;
    case 'caloriesShow':
      settings.calories.visible = data.value as boolean;
      break;
    case 'distanceColor':
      settings.distance.color = data.value as string;
      break;
    case 'distanceShow':
      settings.distance.visible = data.value as boolean;
      break;
    case 'elevationGainColor':
      settings.elevationGain.color = data.value as string;
      break;
    case 'elevationGainShow':
      settings.elevationGain.visible = data.value as boolean;
      break;
    case 'stepsColor':
      settings.steps.color = data.value as string;
      break;
    case 'stepsShow':
      settings.steps.visible = data.value as boolean;
      break;
    default:
      settings[data.key] = data.value;
  }
  onsettingschange(settings);
};

// On settings unload, saves settings to filesystem.
appbit.onunload = () => fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);

// Loads settings from filesystem.
function loadSettings(): SettingsData {
  if (fs.existsSync(SETTINGS_FILE)) {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } else {
    console.warn(`${SETTINGS_FILE} does not exist. Writing a new one.`);
    fs.writeFileSync(SETTINGS_FILE, new SettingsData(), SETTINGS_TYPE);
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  }
}
