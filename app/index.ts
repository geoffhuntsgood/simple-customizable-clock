import {me as appbit} from 'appbit';
import {BodyPresenceSensor} from 'body-presence';
import clock from 'clock';
import {display} from 'display';
import document from 'document';
import {HeartRateSensor} from 'heart-rate';
import {goals, today} from 'user-activity';
import {preferences} from 'user-settings';

import * as settings from './device-settings';
import localizedDate from './locale-date';
import * as util from './utils';

const activities = ['am', 'cb', 'dt', 'fc', 'st'];
const background = document.getElementById('background') as RectElement;
const dateDisplay = document.getElementById('dateDisplay') as TextElement;
const clockFace = document.getElementById('clockFace') as TextElement;

// Update date and time based on granularity
clock.granularity = 'seconds';
clock.ontick = (event) => {
  let now = event.date;
  dateDisplay.text = `${localizedDate(now)} ${now.getFullYear()}`;
  let hours = preferences.clockDisplay === '12h' ? (now.getHours() % 12 || 12) : now.getHours();
  clockFace.text = `${hours}:${util.zeroPad(now.getMinutes())}`;
};

// Initialize/retrieve settings
function settingsCallback(data: any): void {
  if (!data) {
    return;
  }
  data.backgroundColor ? background.style.fill = data.backgroundColor : 'black';
  data.timeColor ? clockFace.style.fill = data.timeColor : 'white';
  data.dateColor ? dateDisplay.style.fill = data.dateColor : 'white';
  if (appbit.permissions.granted('access_activity' as PermissionName)) {
    let shownActivities = activities.filter(activity => {
      return data[activity + 'Show'] === true;
    });
    shownActivities.forEach(activity => {
      util.setActivityColor(activity, data[activity + 'Color']);
      util.setActivityValue(activity, today, goals);
    });
    util.placeActivities(shownActivities, activities);
  } else {
    console.warn("The app doesn't have the 'access_activity' permission.");
  }
}

settings.initialize(settingsCallback);

// Update heart rate display
if (appbit.permissions.granted('access_heart_rate' as PermissionName)) {
  if (HeartRateSensor) {
    const heartRateSensor = new HeartRateSensor();
    const heartDisplay = document.getElementById('heartDisplay') as TextElement;
    heartRateSensor.onreading = () => {
      if (!heartRateSensor.activated || heartRateSensor.heartRate === null) {
        heartDisplay.text = '--';
      } else {
        heartDisplay.text = `${heartRateSensor.heartRate}`;
      }
    };

    // If display is off, deactivate heart readings
    display.onchange = () => {
      display.on && !heartRateSensor.activated ? heartRateSensor.start() : heartRateSensor.stop();
    };

    // If not worn, deactivate heart readings
    if (BodyPresenceSensor) {
      const bodySensor = new BodyPresenceSensor();
      bodySensor.onreading = () => {
        bodySensor.present && !heartRateSensor.activated ? heartRateSensor.start() : heartRateSensor.stop();
      };
      bodySensor.start();
    } else {
      console.warn("The device doesn't have a body presence sensor.");
    }
  } else {
    console.warn("The device doesn't have a heart rate sensor.");
  }
} else {
  console.warn("The app doesn't have the 'access_heart_rate' permission.");
}
