import document from "document";
import { ActivityName } from "../types/activity-name";
import SettingsData from "../types/settings-data";
import { getActivityNames, placeActivities, updateActivities } from "./app-functions-activities";

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

export const setUseCelsius = (celsius: boolean): void => {
  useCelsius = celsius;
};

// Initializes settings data for the app.
export const initializeSettings = (data: SettingsData): void => {
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
