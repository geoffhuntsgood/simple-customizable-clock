import { me as appbit } from 'appbit';
import document from 'document';
import user from 'user-profile';
import units from 'user-settings';

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

// Place shown user activities on the app
export function placeActivities(activityList, allActivities) {
  removeAllActivities(allActivities);
  let root = document.getElementById('root');
  let x = root.width;
  let y = root.height;
  let row = Math.floor((y / 5) * 4);
  switch (activityList.length) {
    case 0:
      break;
    case 1:
      placeItem(activityList[0], Math.floor(x / 2), row);
      break;
    case 2:
      let divider = Math.floor(x / 3);
      placeItem(activityList[0], divider, row);
      placeItem(activityList[1], divider * 2, row);
      break;
    case 3:
      let divider = Math.floor(x / 4);
      placeItem(activityList[0], divider, row);
      placeItem(activityList[1], divider * 2, row);
      placeItem(activityList[2], divider * 3, row);
      break;
    case 4:
      let divider = Math.floor(x / 5);
      placeItem(activityList[0], divider - 5, row);
      placeItem(activityList[1], divider * 2, row);
      placeItem(activityList[2], (divider * 3) + 5, row);
      placeItem(activityList[3], (divider * 4) + 10, row);
      break;
    case 5:
      let divider = Math.floor(x / 6);
      placeItem(activityList[0], divider - 15, row);
      placeItem(activityList[1], (divider * 2) - 5, row);
      placeItem(activityList[2], (divider * 3) + 5, row);
      placeItem(activityList[3], (divider * 4) + 15, row);
      placeItem(activityList[4], (divider * 5) + 25, row);
    default:
      break;
  }
}

// Set x/y coordinates for an activity item
// Based on an activity item being 60x60
export function placeItem(id, x, y) {
  let arc = document.getElementById(id + 'Arc');
  let icon = document.getElementById(id + 'Icon');
  let text = document.getElementById(id + 'Text');
  arc.style.display = 'inline';
  icon.style.display = 'inline';
  text.style.display = 'inline';
  arc.x = x - 30;
  arc.y = y - 30;
  icon.x = x - 15;
  icon.y = y - 15;
  text.x = x;
  text.y = y + 55;
}

// Remove activity icons/arcs from the display
export function removeAllActivities(activities) {
  activities.forEach(id => {
    let arc = document.getElementById(id + 'Arc');
    let icon = document.getElementById(id + 'Icon');
    let text = document.getElementById(id + 'Text');
    arc.x = 0;
    arc.y = 0;
    icon.x = 0;
    icon.y = 0;
    text.x = 0;
    text.y = 0;
    arc.style.display = 'none';
    icon.style.display = 'none';
    text.style.display = 'none';
  });
}

// Set the color of the activity icon and progress arc
export function setActivityColor(activity, dataColor) {
  let arc = document.getElementById(activity + 'Arc');
  let icon = document.getElementById(activity + 'Icon');
  if (dataColor) {
    arc.style.fill = dataColor;
    icon.style.fill = dataColor;
  } else {
    arc.fill = 'white';
    icon.style.fill = 'white';
  }
}

// Set the activity text value and progress arc angle
export function setActivityValue(activity, today, goal) {
  let arc = document.getElementById(activity + 'Arc');
  let text = document.getElementById(activity + 'Text');
  let total = today.adjusted;
  let daily = goal.adjusted;

  let defaultDistanceGoal = 0;
  if(appbit.permissions.granted('access_user_profile')) {
    defaultDistanceGoal = user.stride !== undefined ? user.stride.walk * 10000 : 0;
  }
  
  switch(activity) {
    case 'am':
      text.text = `${total.activeMinutes}`;
      let activeMinutesGoal = daily !== undefined && daily.activeMinutes !== undefined ? daily.activeMinutes : 30;
      arc.sweepAngle = calculateAngle(total.activeMinutes, activeMinutesGoal);
      break;
    case 'cb':
      text.text = `${total.calories}`;
      let calorieGoal = daily !== undefined ? daily.calories : 2000;
      arc.sweepAngle = calculateAngle(total.calories, calorieGoal);
      break;
    case 'dt':
      text.text = `${calculateDistance(total.distance)}`;
      let distanceGoal = daily !== undefined && daily.distance !== undefined ? daily.distance : defaultDistanceGoal;
      arc.sweepAngle = calculateAngle(total.distance, distanceGoal);
      break;
    case 'fc':
      text.text = `${total.elevationGain}`;
      let elevationGoal = daily !== undefined && daily.elevationGain !== undefined ? daily.elevationGain : 10;
      arc.sweepAngle = calculateAngle(total.elevationGain, elevationGoal);
      break;
    case 'st':
      text.text = `${total.steps}`;
      let stepGoal = daily !== undefined && daily.steps !== undefined ? daily.steps : 10000;
      arc.sweepAngle = calculateAngle(total.steps, stepGoal);
    default:
      break;
  }
}
  
// Calculate the sweep angle percentage of today's progress versus daily goal
function calculateAngle(today, goal) {
  if (today / goal > 1) {
    return 360;
  }
  return Math.floor((today * 360) / goal);
}

// Convert distance to km or miles
function calculateDistance(distanceInMeters) {
  if (units.distance === 'metric') {
    return (distanceInMeters / 1000).toFixed(2);
  }
  return (distanceInMeters * 0.000621).toFixed(2);
}
