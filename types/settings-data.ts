import {me as appbit} from 'appbit';
import {goals} from 'user-activity';
import {user} from 'user-profile';
import {ActivityName} from './activity-name';
import ActivityValues from './activity-values';

export default class SettingsData {

  [key: string]: any;

  backgroundColor: string = 'black';
  dateColor: string = 'white';
  timeColor: string = 'white';
  batteryColor: string = 'white';
  weatherColor: string = 'white';
  heartColor: string = 'red';
  baseHeartRateShow: boolean = false;

  activeZoneMinutes: ActivityValues;
  calories: ActivityValues;
  distance: ActivityValues;
  elevationGain: ActivityValues;
  steps: ActivityValues;

  activityOrder: string[] = [ActivityName.activeZoneMinutes, ActivityName.calories, ActivityName.distance,
    ActivityName.elevationGain, ActivityName.steps];

  constructor() {
    this.activeZoneMinutes =
        new ActivityValues(ActivityName.activeZoneMinutes, SettingsData.getGoal(ActivityName.activeZoneMinutes));
    this.calories =
        new ActivityValues(ActivityName.calories, SettingsData.getGoal(ActivityName.calories));
    this.distance =
        new ActivityValues(ActivityName.distance, SettingsData.getGoal(ActivityName.distance));
    this.elevationGain =
        new ActivityValues(ActivityName.elevationGain, SettingsData.getGoal(ActivityName.elevationGain));
    this.steps =
        new ActivityValues(ActivityName.steps, SettingsData.getGoal(ActivityName.steps));
  }

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