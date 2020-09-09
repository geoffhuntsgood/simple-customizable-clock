import {me as appbit} from 'appbit';
import {BodyPresenceSensor} from 'body-presence';
import clock from 'clock';
import {display} from 'display';
import document from 'document';
import {HeartRateSensor} from 'heart-rate';
import {preferences} from 'user-settings';

import * as settings from './device-settings';
import localizedDate from './locale-date';
import * as util from './utils';
import SettingsData from '../types/settings-data';
import {ActivityName} from '../types/activity-name';

const background: RectElement = document.getElementById('background') as RectElement;
const dateDisplay: TextElement = document.getElementById('dateDisplay') as TextElement;
const clockFace: TextElement = document.getElementById('clockFace') as TextElement;

// Updates date and time based on granularity.
clock.granularity = 'seconds';
clock.ontick = (event) => {
  let now = event.date;
  dateDisplay.text = `${localizedDate(now)} ${now.getFullYear()}`;
  let hours = preferences.clockDisplay === '12h' ? (now.getHours() % 12 || 12) : now.getHours();
  clockFace.text = `${hours}:${util.zeroPad(now.getMinutes())}`;
  for (let act in ActivityName) {
    let arc: ArcElement = document.getElementById(`${act}Arc`) as ArcElement;
    let text: TextElement = document.getElementById(`${act}Text`) as TextElement;
    util.setActivityProgress(text, arc, act);
  }
};

// Initializes settings.
settings.initialize((data: SettingsData) => {
  if (!data) {
    return;
  }
  background.style.fill = data.backgroundColor;
  clockFace.style.fill = data.timeColor;
  dateDisplay.style.fill = data.dateColor;

  // Set progress and color for visible elements and remove invisible elements
  Object.keys(ActivityName).forEach((act: string) => {
    let arc: ArcElement = document.getElementById(`${act}Arc`) as ArcElement;
    let icon: ImageElement = document.getElementById(`${act}Icon`) as ImageElement;
    let text: TextElement = document.getElementById(`${act}Text`) as TextElement;

    if (data[`${act}`].visible) {
      // Set activity color
      let activityColor: string = data[`${act}`].color;
      arc.style.fill = activityColor;
      icon.style.fill = activityColor;

      // Set activity progress
      util.setActivityProgress(text, arc, act);
    } else {
      // Remove activity from the clock face
      util.removeActivity(arc, icon, text);
    }
  });

  // Place visible elements
  util.placeActivities(Object.keys(ActivityName).filter((act: string) => {
    return data[`${act}`].visible === true;
  }));
});

// Updates heart rate display.
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
