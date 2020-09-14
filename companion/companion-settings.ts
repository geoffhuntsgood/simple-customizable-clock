import * as weather from 'fitbit-weather/companion'
import * as messaging from 'messaging';
import {settingsStorage} from 'settings';
import StorageData from '../types/storage-data';

const WEATHER_API_KEY = 'e79ddcc3266e3ade636be2248739efe4';

// Initializes the OpenWeatherMap data service.
weather.setup({provider: weather.Providers.openweathermap, apiKey: WEATHER_API_KEY});

// Initializes the clock face's settings.
export function initialize() {
  settingsStorage.onchange = (event: StorageChangeEvent) => {
    if (event.key && event.newValue) {
      if (event.oldValue !== event.newValue &&
          event.newValue &&
          messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(new StorageData(event.key, JSON.parse(event.newValue)));
      } else {
        console.log('peerSocket connection is not open.');
      }
    } else {
      console.log('Misconfigured setting change: key or new value missing.');
    }
  }
}
