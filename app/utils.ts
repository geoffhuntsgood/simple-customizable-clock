import document from 'document';
import {ActiveZoneMinutes, goals, today} from 'user-activity';
import {units} from 'user-settings';
import {ActivityName} from '../types/activity-name';

const mos = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Gets the abbreviated name of a numbered month and weekday.
export function getMonthAndWeekdayNames(month: number, day: number): string[] {
  return [mos[month], days[day]];
}

// Adds a zero in front of numbers < 10.
export function zeroPad(i: number): string {
  return i < 10 ? `0${i}` : `${i}`;
}

// Sets progress for a user activity's text and arc elements.
export function setActivityProgress(act: string): void {
  let arc = document.getElementById(`${act}Arc`) as ArcElement;
  let text = document.getElementById(`${act}Text`) as TextElement;

  let progress: ActiveZoneMinutes | number = today.adjusted[`${act}`];
  let goal: ActiveZoneMinutes | number = goals[`${act}`];

  if (typeof progress === 'number' && typeof goal === 'number') {
    text.text = act === ActivityName.distance ? `${getDistanceText(progress)}` : `${progress}`;
    arc.sweepAngle = getAngle(act, progress, goal);
  } else {
    // I miss active minutes...
    progress = progress as ActiveZoneMinutes;
    goal = goal as ActiveZoneMinutes;
    text.text = `${progress.total}`;
    arc.sweepAngle = getAngle(act, progress.total, goal.total);
  }
}

// Removes an activity's objects from the clock face.
export function removeActivity(arc: ArcElement, icon: ImageElement, text: TextElement): void {
  arc.x = 0;
  arc.y = 0;
  icon.x = 0;
  icon.y = 0;
  text.x = 0;
  text.y = 0;
  arc.style.display = 'none';
  icon.style.display = 'none';
  text.style.display = 'none';
}

// Places shown user activities on the clock face.
export function placeActivities(activityList: string[]): void {
  let background = document.getElementById('root') as RectElement;
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
      placeItem(activityList[1], (divider * 2) + 2, row);
      break;
    }
    case 3: {
      let divider = Math.floor(x / 4);
      placeItem(activityList[0], divider + 2, row);
      placeItem(activityList[1], (divider * 2) + 2, row);
      placeItem(activityList[2], (divider * 3) + 2, row);
      break;
    }
    case 4: {
      let divider = Math.floor(x / 5);
      placeItem(activityList[0], divider - 5, row);
      placeItem(activityList[1], divider * 2, row);
      placeItem(activityList[2], (divider * 3) + 5, row);
      placeItem(activityList[3], (divider * 4) + 10, row);
      break;
    }
    case 5: {
      let divider = Math.floor(x / 6);
      placeItem(activityList[0], divider - 10, row);
      placeItem(activityList[1], (divider * 2) - 4, row);
      placeItem(activityList[2], (divider * 3) + 2, row);
      placeItem(activityList[3], (divider * 4) + 8, row);
      placeItem(activityList[4], (divider * 5) + 14, row);
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
  arc.style.display = 'inline';
  icon.style.display = 'inline';
  text.style.display = 'inline';
  arc.x = x - 30;
  arc.y = y - 30;
  icon.x = x - 15;
  icon.y = y - 15;
  text.x = x - 2;
  text.y = y + 55;
}

// Calculates the progress arc angle for a user activity.
export function getAngle(name: string, progress: number | undefined, goal: number | undefined): number {
  if (progress === undefined || goal === undefined) {
    console.log(`Goal is not set or progress cannot be retrieved for ${name}`);
    return 0;
  }
  if (progress / goal > 1) return 360;
  return Math.floor((progress * 360) / goal);
}

// Converts distance to km or miles.
export function getDistanceText(distanceInMeters: number): string {
  if (units.distance === 'metric') {
    return (distanceInMeters / 1000).toFixed(2);
  }
  return (distanceInMeters * 0.000621).toFixed(2);
}
