import document from "document";
import { goals, today } from "user-activity";
import { preferences, units } from "user-settings";
import { ActivityName } from "../types/activity-name";
import * as Barometer from "barometer";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { user } from "user-profile";
import { display } from "display";
import { battery, charger } from "power";
import SettingsData from "../types/settings-data";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let baseHeartRateShow = false;
let useCelsius = false;

// Returns the current base heart rate value.
export const getBaseHeartRate = (): boolean => {
  return baseHeartRateShow;
};

// Returns the current use Celsius value.
export const getUseCelsius = (): boolean => {
  return useCelsius;
};

// Provides the list of activity names, ignoring elevation for devices without a barometer.
export const getActivityNames = (): string[] => {
  return Object.keys(ActivityName).filter((act: string) => (Barometer ? true : act !== ActivityName.elevationGain));
};

// Sets date and time text on the device.
export const setDateAndTime = (dateDisplay: TextElement, clockDisplay: TextElement): void => {
  if (!dateDisplay || !clockDisplay) return;

  let now: Date = new Date();
  dateDisplay.text = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  let hours: number = preferences.clockDisplay === "12h" ? now.getHours() % 12 || 12 : now.getHours();
  let minutes: number = now.getMinutes();
  clockDisplay.text = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

// Sets current user activity progress.
export const updateActivities = (): void => {
  getActivityNames().forEach((act: string) => {
    let arc = document.getElementById(`${act}Arc`) as ArcElement;
    let text = document.getElementById(`${act}Text`) as TextElement;
    let progress: number;
    switch (act) {
      case "activeZoneMinutes":
        progress = today.adjusted.activeZoneMinutes?.total || 0;
        text.text = `${progress}`;
        arc.sweepAngle = getAngle(act, progress, goals.activeZoneMinutes?.total || 0);
        break;
      case "distance":
        progress = today.adjusted.distance || 0;
        text.text = `${getDistanceText(progress)}`;
        arc.sweepAngle = getAngle(act, progress, goals.distance || 0);
        break;
      default:
        progress = today.adjusted[act] || 0;
        text.text = `${progress}`;
        arc.sweepAngle = getAngle(act, progress, goals[act] || 0);
        break;
    }
  });
};

// Calculates the progress arc angle for a user activity.
export const getAngle = (name: string, progress: number, goal: number): number => {
  if (progress / goal > 1) return 360;
  return Math.floor((progress * 360) / goal);
};

// Converts distance to km or miles.
export const getDistanceText = (distanceInMeters: number): string => {
  if (units.distance === "metric") {
    return (distanceInMeters / 1000).toFixed(2);
  }
  return (distanceInMeters * 0.000621).toFixed(2);
};

// Updates the heart rate display.
export const startHeartMonitoring = (heartDisplay: TextElement) => {
  if (appbit.permissions.granted("access_heart_rate" as PermissionName) && HeartRateSensor && BodyPresenceSensor) {
    const heartSensor = new HeartRateSensor();
    const bodySensor = new BodyPresenceSensor();
    bodySensor.start();

    // Display heart rate and/or base heart rate
    heartSensor.onreading = () => {
      let rate: string = heartSensor.heartRate ? `${heartSensor.heartRate}` : "--";
      let baseRate: string = user.restingHeartRate ? `/${user.restingHeartRate}` : "/--";
      heartDisplay.text = getBaseHeartRate() ? rate + baseRate : rate;
    };
    heartSensor.start();

    // If display is off or device is off-wrist, deactivate heart readings
    display.onchange = () => {
      display.on ? bodySensor.start() : bodySensor.stop();
      display.on && bodySensor.present ? heartSensor.start() : heartSensor.stop();
    };
  } else {
    console.log("The device does not have the required sensors, or the app does not have required permissions.");
  }
};

// Displays battery charge level.
export const updateChargeDisplay = (batteryDisplay: TextElement): void => {
  let chargeLevel: number = battery.chargeLevel;
  batteryDisplay.text = `${chargeLevel}%`;
  batteryDisplay.x = chargeLevel > 20 && !charger.connected ? 10 : 45;
};

// Initializes settings data for the app.
export const initializeSettings = (data: SettingsData): void => {
  if (!data) {
    return;
  }

  if (!data.activityOrder) {
    data.activityOrder = getActivityNames();
  }

  baseHeartRateShow = data.baseHeartRateShow;
  useCelsius = data.useCelsius;

  (document.getElementById("background") as RectElement).style.fill = data.backgroundColor;
  (document.getElementById("clockDisplay") as TextElement).style.fill = data.timeColor;
  (document.getElementById("dateDisplay") as TextElement).style.fill = data.dateColor;
  (document.getElementById("batteryDisplay") as TextElement).style.fill = data.batteryColor;
  (document.getElementById("weatherDisplay") as TextElement).style.fill = data.weatherColor;
  (document.getElementById("weatherIcon") as ImageElement).style.fill = data.weatherColor;
  (document.getElementById("heartDisplay") as TextElement).style.fill = data.heartColor;

  // Set progress and color for visible elements and remove invisible elements
  Object.keys(ActivityName).forEach((act: string) => {
    let arc = document.getElementById(`${act}Arc`) as ArcElement;
    let icon = document.getElementById(`${act}Icon`) as ImageElement;
    let text = document.getElementById(`${act}Text`) as TextElement;

    if (data.activityOrder.indexOf(act) !== -1) {
      // Set activity color
      let activityColor: string = data[`${act}Color`];
      arc.style.fill = activityColor;
      icon.style.fill = activityColor;
    } else {
      // Remove activity from the clock face
      arc.style.display = "none";
      icon.style.display = "none";
      text.style.display = "none";
    }
  });

  // Place visible elements
  placeActivities(data.activityOrder);
  updateActivities();
};

// Places shown user activities on the clock face.
export function placeActivities(activityList: string[]): void {
  let background = document.getElementById("root") as RectElement;
  let x: number = background.width;
  let y: number = background.height;
  let row: number = Math.floor((y / 5) * 4);

  switch (activityList.length) {
    case 0:
      break;
    case 1:
      placeItem(activityList[0], Math.floor(x / 2) + 2, row);
      break;
    case 2: {
      let divider = Math.floor(x / 3);
      placeItem(activityList[0], divider + 2, row);
      placeItem(activityList[1], divider * 2 + 2, row);
      break;
    }
    case 3: {
      let divider = Math.floor(x / 4);
      placeItem(activityList[0], divider + 2, row);
      placeItem(activityList[1], divider * 2 + 2, row);
      placeItem(activityList[2], divider * 3 + 2, row);
      break;
    }
    case 4: {
      let divider = Math.floor(x / 5);
      placeItem(activityList[0], divider - 5, row);
      placeItem(activityList[1], divider * 2, row);
      placeItem(activityList[2], divider * 3 + 5, row);
      placeItem(activityList[3], divider * 4 + 10, row);
      break;
    }
    case 5: {
      let divider = Math.floor(x / 6);
      placeItem(activityList[0], divider - 10, row);
      placeItem(activityList[1], divider * 2 - 4, row);
      placeItem(activityList[2], divider * 3 + 2, row);
      placeItem(activityList[3], divider * 4 + 8, row);
      placeItem(activityList[4], divider * 5 + 14, row);
      break;
    }
    default:
      break;
  }
}

// Sets x/y coordinates for an activity item.
export function placeItem(name: string, x: number, y: number): void {
  let arc = document.getElementById(`${name}Arc`) as ArcElement;
  let icon = document.getElementById(`${name}Icon`) as ImageElement;
  let text = document.getElementById(`${name}Text`) as TextElement;
  arc.style.display = "inline";
  icon.style.display = "inline";
  text.style.display = "inline";
  arc.x = x - 30;
  arc.y = y - 30;
  icon.x = x - 15;
  icon.y = y - 15;
  text.x = x - 2;
  text.y = y + 55;
}

export const getConditionIconPath = (code: number, isDay: boolean = true): string => {
  if (code < 300) {
    return "icons/weather/cloud-lightning.png";
  } else if (code < 400) {
    return "icons/weather/cloud-drizzle.png";
  } else if (code < 500) {
    return "icons/weather/cloud-rain.png";
  } else if (code < 600) {
    return "icons/weather/cloud-snow.png";
  } else if (code < 700) {
    return "icons/weather/fog.png";
  } else if (code === 801 || code === 802) {
    return isDay ? "icons/weather/cloud-sun.png" : "icons/weather/cloud-moon.png";
  } else if (code === 803 || code === 804) {
    return "icons/weather/cloud.png";
  } else {
    return isDay ? "icons/weather/sun.png" : "icons/weather/moon-stars.png";
  }
};
