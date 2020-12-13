import { getActivityNames } from "../app/app-functions";

// Container class for all user settings.
export default class SettingsData {
  backgroundColor: string = "black";
  dateColor: string = "white";
  timeColor: string = "white";
  batteryColor: string = "white";
  weatherColor: string = "white";
  heartColor: string = "red";

  baseHeartRateShow: boolean = false;
  useCelsius: boolean = false;

  activityOrder: string[] = getActivityNames();

  activeZoneMinutesColor: string = "white";
  caloriesColor: string = "white";
  distanceColor: string = "white";
  elevationGainColor: string = "white";
  stepsColor: string = "white";
}
