import document from 'document';
import * as util from '../app/utils';
import {ActivityName} from '../types/activity-name';
import SettingsData from '../types/settings-data';

// Boolean to track whether to show or hide the base heart rate.
let baseHeartRate = false;
export {baseHeartRate};

// Initializes settings data for the app.
export function initializeSettings(data: SettingsData) {
  if (!data) {
    return;
  }

  baseHeartRate = data.baseHeartRateShow;

  (document.getElementById('background') as RectElement).style.fill = data.backgroundColor;
  (document.getElementById('clockDisplay') as TextElement).style.fill = data.timeColor;
  (document.getElementById('dateDisplay') as TextElement).style.fill = data.dateColor;
  (document.getElementById('batteryDisplay') as TextElement).style.fill = data.batteryColor;
  (document.getElementById('weatherDisplay') as TextElement).style.fill = data.weatherColor;
  (document.getElementById('weatherIcon') as ImageElement).style.fill = data.weatherColor;
  (document.getElementById('heartDisplay') as TextElement).style.fill = data.heartColor;

  // Set progress and color for visible elements and remove invisible elements
  Object.keys(ActivityName).forEach((act: string) => {
    let arc = document.getElementById(`${act}Arc`) as ArcElement;
    let icon = document.getElementById(`${act}Icon`) as ImageElement;
    let text = document.getElementById(`${act}Text`) as TextElement;

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
}