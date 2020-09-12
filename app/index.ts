import {me as appbit} from 'appbit';
import {battery, charger} from 'power';
import {BodyPresenceSensor} from 'body-presence';
import clock from 'clock';
import {display} from 'display';
import document from 'document';
import * as weather from 'fitbit-weather/app';
import {HeartRateSensor} from 'heart-rate';
import {preferences, units} from 'user-settings';

import * as settings from './device-settings';
import localizedDate from './locale-date';
import * as util from './utils';
import {ActivityName} from '../types/activity-name';
import SettingsData from '../types/settings-data';

const background: RectElement = document.getElementById('background') as RectElement;
const batteryDisplay: TextElement = document.getElementById('batteryDisplay') as TextElement;
const weatherDisplay: TextElement = document.getElementById('weatherDisplay') as TextElement;
const weatherIcon: ImageElement = document.getElementById('weatherIcon') as ImageElement;
const dateDisplay: TextElement = document.getElementById('dateDisplay') as TextElement;
const clockFace: TextElement = document.getElementById('clockFace') as TextElement;

clock.granularity = 'seconds';
clock.ontick = (event) => {
  // Set time and date
  let now = event.date;
  dateDisplay.text = `${localizedDate(now)} ${now.getFullYear()}`;
  let hours = preferences.clockDisplay === '12h' ? (now.getHours() % 12 || 12) : now.getHours();
  clockFace.text = `${hours}:${util.zeroPad(now.getMinutes())}`;

  // Set user activity progress
  Object.keys(ActivityName).forEach((act: string) => {
    let arc: ArcElement = document.getElementById(`${act}Arc`) as ArcElement;
    let text: TextElement = document.getElementById(`${act}Text`) as TextElement;
    util.setActivityProgress(text, arc, act);
  });
};

// Initializes settings.
settings.initialize((data: SettingsData) => {
  if (!data) {
    return;
  }
  background.style.fill = data.backgroundColor;
  clockFace.style.fill = data.timeColor;
  dateDisplay.style.fill = data.dateColor;
  batteryDisplay.style.fill = data.batteryColor;
  weatherDisplay.style.fill = data.weatherColor;
  weatherIcon.style.fill = data.weatherColor;

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
      let rate = heartRateSensor.heartRate;
      heartDisplay.text = heartRateSensor.activated && rate !== null ? `${rate}` : '---';
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

// Updates battery percentage display when charge level changes.
battery.onchange = () => {
  updateChargeDisplay();
};

// Updates battery percentage display when plugged in.
charger.onchange = () => {
  updateChargeDisplay();
};

function updateChargeDisplay() {
  let chargeLevel: number = battery.chargeLevel;
  batteryDisplay.text = `${chargeLevel}%`;
  batteryDisplay.x = chargeLevel > 20 && !charger.connected ? 10 : 45;
}

updateChargeDisplay();

// Fetches weather information and updates the display.
// Uses a cached value if the cache is less than 15 minutes old.
function initializeWeather() {
  weather.fetch(1000 * 60 * 15)
      .then((result: weather.Result) => {
        weatherDisplay.text = units.temperature === 'C' ?
            `${Math.floor(result.temperatureC)}&deg;` : `${Math.floor(result.temperatureF)}&deg;`;
        console.log(JSON.stringify(result.conditionCode));
        switch (result.conditionCode) {
          case 0:
            // Clear skies
            weatherIcon.href = result.isDay ? 'icons/weather/sun.png' : 'icons/weather/moon-stars.png';
            break;
          case 1:
            // Few clouds
            weatherIcon.href = result.isDay ? 'icons/weather/cloud-sun.png' : 'icons/weather/cloud-moon.png';
            break;
          case 2:
            // Varying degrees of cloudiness
            weatherIcon.href = 'icons/weather/cloud.png';
            break;
          case 3:
            // Varying degrees of cloudiness
            weatherIcon.href = 'icons/weather/cloud.png';
            break;
          case 4:
            // Light showers
            weatherIcon.href = 'icons/weather/cloud-drizzle.png';
            break;
          case 5:
            // Rain
            weatherIcon.href = 'icons/weather/cloud-rain.png';
            break;
          case 6:
            // Thunderstorm
            weatherIcon.href = 'icons/weather/cloud-lightning.png';
            break;
          case 7:
            // Snow
            weatherIcon.href = 'icons/weather/cloud-snow.png';
            break;
          case 8:
            // Mist/fog
            weatherIcon.href = 'icons/weather/fog.png';
            break;
          default:
            // Unknown, display clear skies
            weatherIcon.href = result.isDay ? 'icons/weather/sun.png' : 'icons/weather/moon-stars.png';
        }
        console.log(JSON.stringify(weatherIcon.href));
        console.log(JSON.stringify(weatherIcon.style.fill));
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
}

initializeWeather();

// Update weather every 15 minutes (current weather only, no forecast data)
setInterval(initializeWeather, 1000 * 60 * 15);