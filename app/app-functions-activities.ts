import { Barometer } from "barometer";
import document from "document";
import { goals, today } from "user-activity";
import { units } from "user-settings";
import { ActivityName } from "../types/activity-name";
import { placeItem } from "./app-functions";

// Provides the list of activity names, ignoring elevation for devices without a barometer.
export const getActivityNames = (): string[] => {
  return Object.keys(ActivityName).filter((act: string) => (Barometer ? true : act !== ActivityName.elevationGain));
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
        arc.sweepAngle = getAngle(progress, goals.activeZoneMinutes?.total || 0);
        break;
      case "distance":
        progress = today.adjusted.distance || 0;
        text.text = `${getDistanceText(progress)}`;
        arc.sweepAngle = getAngle(progress, goals.distance || 0);
        break;
      default:
        progress = today.adjusted[act] || 0;
        text.text = `${progress}`;
        arc.sweepAngle = getAngle(progress, goals[act] || 0);
        break;
    }
  });
};

// Calculates the progress arc angle for a user activity.
export const getAngle = (progress: number, goal: number): number => {
  if (goal === 0) return 0;
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
