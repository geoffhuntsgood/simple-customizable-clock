import {me as appbit} from 'appbit';
import {Barometer} from 'barometer';
import {BodyPresenceSensor} from 'body-presence';
import clock, {TickEvent} from 'clock';
import {display} from 'display';
import document from 'document';
import * as weather from 'fitbit-weather/app';
import {HeartRateSensor} from 'heart-rate';
import {battery, charger} from 'power';
import {user} from 'user-profile';
import {preferences} from 'user-settings';
import * as settings from './device-settings';
import * as util from './utils';
import {ActivityName} from '../types/activity-name';
import SettingsData from '../types/settings-data';

// Elements that are updated in index.ts
const heartDisplay = document.getElementById('heartDisplay') as TextElement;
const dateDisplay = document.getElementById('dateDisplay') as TextElement;
const clockDisplay = document.getElementById('clockDisplay') as TextElement;

// Boolean to track whether to display the resting heart rate.
let baseHeartRate = false;

// Boolean to show weather in Fahrenheit or Celsius.
let useCelsius = false;

// Updates time, date and activity progress.
clock.granularity = 'seconds';
clock.ontick = (event: TickEvent) => {
  if (dateDisplay && clockDisplay) {
    // Set time and date
    let now = event.date;
    let monthAndDay = util.getMonthAndWeekdayNames(now.getMonth(), now.getDay());
    dateDisplay.text = `${monthAndDay[1]}, ${monthAndDay[0]} ${now.getDate()} ${now.getFullYear()}`;

    let hours = preferences.clockDisplay === '12h' ? (now.getHours() % 12 || 12) : now.getHours();
    clockDisplay.text = `${hours}:${util.zeroPad(now.getMinutes())}`;

    // Sets user activity progress
    let nameList: string[] = [];
    if (!Barometer) {
      nameList = Object.keys(ActivityName).filter((act: string) => {
        return act !== ActivityName.elevationGain;
      });
    } else {
      nameList = Object.keys(ActivityName);
    }

    nameList.forEach((act: string) => {
      let text = document.getElementById(`${act}Text`) as TextElement;
      let arc = document.getElementById(`${act}Arc`) as ArcElement;
      util.setActivityProgress(text, arc, act);
    });
  }
};

// Updates heart rate display.
if (appbit.permissions.granted('access_heart_rate' as PermissionName)) {
  if (HeartRateSensor && BodyPresenceSensor) {
    const heartSensor = new HeartRateSensor();
    const bodySensor = new BodyPresenceSensor();
    bodySensor.start();

    // Display heart rate and/or base heart rate.
    heartSensor.onreading = () => {
      let rate = heartSensor.heartRate ? heartSensor.heartRate : 0;
      let baseRate = user.restingHeartRate;
      if (baseHeartRate && baseRate !== undefined) {
        heartDisplay.text = heartSensor.activated && bodySensor.present ? `${rate}/${baseRate}` : `--/${baseRate}`;
      } else {
        heartDisplay.text = heartSensor.activated && bodySensor.present ? `${rate}` : '--';
      }
    };
    heartSensor.start();

    // If display is off or device is off-wrist, deactivate heart readings
    display.onchange = () => {
      display.on ? bodySensor.start() : bodySensor.stop();
      display.on && bodySensor.present ? heartSensor.start() : heartSensor.stop();
    };
  } else {
    console.warn("The device is missing a heart rate sensor or a body presence sensor.");
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

// Displays battery charge level.
function updateChargeDisplay(): void {
  let batteryDisplay = document.getElementById('batteryDisplay') as TextElement;
  let chargeLevel: number = battery.chargeLevel;
  batteryDisplay.text = `${chargeLevel}%`;
  batteryDisplay.x = chargeLevel > 20 && !charger.connected ? 10 : 45;
}

// Initializes battery display.
updateChargeDisplay();

// Initializes settings data for the app.
function initializeSettings(data: SettingsData): void {
  if (!data) {
    return;
  }

  // Reinitialize activityOrder for changes in the settings file.
  if (!data.activityOrder) {
    data.activityOrder = [ActivityName.activeZoneMinutes, ActivityName.calories, ActivityName.distance,
      ActivityName.elevationGain, ActivityName.steps];
  }

  // Skip elevationGain in devices that don't support it.
  if (!Barometer) {
    data.activityOrder = data.activityOrder.filter(act => act !== 'elevationGain');
  }

  baseHeartRate = data.baseHeartRateShow;
  useCelsius = data.useCelsius;

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

    if (data.activityOrder.indexOf(act) !== -1) {
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
  util.placeActivities(data.activityOrder);
}

settings.initialize(initializeSettings);

// Fetches weather information and updates the display.
function initializeWeather() {
  weather.fetch(0).then((result: weather.Result) => {
    let weatherIcon = document.getElementById('weatherIcon') as ImageElement;
    (document.getElementById('weatherDisplay') as TextElement).text = useCelsius === true ?
        `${Math.floor(result.temperatureC)}&deg;` : `${Math.floor(result.temperatureF)}&deg;`;
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
  }).catch(error => {
    console.log(JSON.stringify(error));
  });
}

initializeWeather();

// Update weather every 15 minutes (current weather only, no forecast data)
setInterval(initializeWeather, 1000 * 60 * 15);
