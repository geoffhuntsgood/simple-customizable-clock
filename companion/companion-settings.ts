import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
import StorageData from './storage-data';

export function initialize() {
  // Event fires when a setting is changed
  settingsStorage.onchange = (event: StorageChangeEvent) => {
    if (event.key && event.newValue) {
      if (event.oldValue !== event.newValue &&
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
