import { me as appbit } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { battery, charger } from "power";
import { user } from "user-profile";
import { preferences } from "user-settings";
import { getBaseHeartRate } from "./app-functions-settings";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sets date and time text on the device.
export const setDateAndTime = (dateDisplay: TextElement, clockDisplay: TextElement): void => {
  let now: Date = new Date(Date.now());
  dateDisplay.text = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  let hours: number = preferences.clockDisplay === "12h" ? now.getHours() % 12 || 12 : now.getHours();
  let minutes: number = now.getMinutes();
  clockDisplay.text = minutes < 10 ? `${hours}:0${minutes}` : `${hours}:${minutes}`;
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
