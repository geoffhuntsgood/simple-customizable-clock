import {me as appbit} from 'appbit';
import {goals} from 'user-activity';
import {user} from 'user-profile';
import {ActivityName} from './activity-name';

export default class SettingsData {

  [key: string]: any;

  backgroundColor: string = 'black';
  dateColor: string = 'white';
  timeColor: string = 'white';
  batteryColor: string = 'white';
  weatherColor: string = 'white';
  heartColor: string = 'red';
  baseHeartRateShow: boolean = false;

  activeZoneMinutesVisible: boolean = true;
  activeZoneMinutesColor: string = 'white';
  activeZoneMinutesGoal: number = SettingsData.getGoal(ActivityName.activeZoneMinutes);

  caloriesVisible: boolean = true;
  caloriesColor: string = 'white';
  caloriesGoal: number = SettingsData.getGoal(ActivityName.calories);

  distanceVisible: boolean = true;
  distanceColor: string = 'white';
  distanceGoal: number = SettingsData.getGoal(ActivityName.distance);

  elevationGainVisible: boolean = true;
  elevationGainColor: string = 'white';
  elevationGainGoal: number = SettingsData.getGoal(ActivityName.elevationGain);

  stepsVisible: boolean = true;
  stepsColor: string = 'white';
  stepsGoal: number = SettingsData.getGoal(ActivityName.steps);

  // Set default goal for a user activity.
  private static getGoal(activityName: ActivityName): number {
    if (goals !== undefined) {
      switch (activityName) {
        case (ActivityName.activeZoneMinutes):
          return goals.activeZoneMinutes !== undefined ? goals.activeZoneMinutes.total : 30;
        case (ActivityName.calories):
          return goals.calories !== undefined ? goals.calories : 2000;
        case (ActivityName.distance):
          return goals.distance !== undefined ? goals.distance : SettingsData.getDefaultDistance();
        case (ActivityName.elevationGain):
          return goals.elevationGain !== undefined ? goals.elevationGain : 10;
        case (ActivityName.steps):
          return goals.steps !== undefined ? goals.steps : 10000;
        default:
          return 0;
      }
    } else {
      console.log('No goal for ' + activityName.toString() + ' set: Goals is inaccessible.');
      return 0;
    }
  }

  // Set default distance goal (if not set in Goals).
  private static getDefaultDistance(): number {
    if (appbit.permissions.granted('access_user_profile' as PermissionName)) {
      return user.stride !== undefined && user.stride.walk !== undefined ? user.stride.walk * 10000 : 0;
    } else {
      console.log("The app doesn't have the 'access_user_profile' permission.");
      return 0;
    }
  }
}