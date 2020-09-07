import { me } from 'appbit';
import * as fs from 'fs';
import * as messaging from 'messaging';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings: any, onsettingschange: Function;

export function initialize(callback: Function): void {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

// Received message containing settings data
messaging.peerSocket.onmessage = (event: messaging.MessageEvent) => {
  settings[event.data.key] = event.data.value;
  onsettingschange(settings);
};

// On settings unload, save settings to filesystem
me.onunload = () => fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}
