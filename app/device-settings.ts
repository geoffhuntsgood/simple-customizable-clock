import {me as appbit} from 'appbit';
import * as fs from 'fs';
import * as messaging from 'messaging';
import {ActivityName} from '../types/activity-name';
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
      toggleOrder(data.value, ActivityName.activeZoneMinutes, settings.activityOrder);
      break;
    case 'caloriesShow':
      toggleOrder(data.value, ActivityName.calories, settings.activityOrder);
      break;
    case 'distanceShow':
      toggleOrder(data.value, ActivityName.distance, settings.activityOrder);
      break;
    case 'elevationGainShow':
      toggleOrder(data.value, ActivityName.elevationGain, settings.activityOrder);
      break;
    case 'stepsShow':
      toggleOrder(data.value, ActivityName.steps, settings.activityOrder);
      break;
    default:
      settings[data.key] = data.value;
  }
  onsettingschange(settings);

  // Saves changed settings to the filesystem.
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
};

// On settings unload, saves settings to filesystem.
appbit.onunload = () => fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);

// Loads settings from filesystem.
export function loadSettings(): SettingsData {
  if (fs.existsSync(SETTINGS_FILE)) {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } else {
    console.warn(`${SETTINGS_FILE} does not exist. Writing a new one.`);
    fs.writeFileSync(SETTINGS_FILE, new SettingsData(), SETTINGS_TYPE);
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  }
}

// Toggles user activity order.
export function toggleOrder(show: boolean, name: ActivityName, activityOrder: string[]) {
  if (show === true && activityOrder.indexOf(name) === -1) {
    activityOrder.push(name);
  } else if (show === false && activityOrder.indexOf(name) !== -1) {
    activityOrder.splice(activityOrder.indexOf(name), 1);
  }
}
