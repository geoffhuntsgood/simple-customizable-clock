import * as sensorFunctions from "../../app/app-functions-sensors";
import { allowPermission } from "../mocks/appbit.mock";
import { BodyPresenceSensor, setPresent } from "../mocks/body-presence.mock";
import { display } from "../mocks/display.mock";
import { HeartRateSensor } from "../mocks/heart-rate.mock";
import { battery, charger } from "../mocks/power.mock";
import { TestElement } from "../mocks/test-element";
import { preferences } from "../mocks/user-settings.mock";

let dateDisplay = new TestElement() as TextElement;
let clockDisplay = new TestElement() as TextElement;
let heartDisplay = new TestElement() as TextElement;
let batteryDisplay = new TestElement() as TextElement;

// setDateAndTime()
test("Sets date and time displays correctly", () => {
  jest.spyOn(Date, "now").mockImplementation(() => 1607913488);
  sensorFunctions.setDateAndTime(dateDisplay, clockDisplay);
  let test = new Date(Date.now());
  console.log(test.getMonth(), test.getDate(), test.getHours(), test.getMinutes());
  expect(dateDisplay.text).toBe("Mon, Jan 19, 1970");
  expect(clockDisplay.text).toBe("9:38");
});

// setDateAndTime()
test("Sets date and time displays correctly with zero-padding", () => {
  jest.spyOn(Date, "now").mockImplementation(() => 1605913488);
  sensorFunctions.setDateAndTime(dateDisplay, clockDisplay);
  expect(dateDisplay.text).toBe("Mon, Jan 19, 1970");
  expect(clockDisplay.text).toBe("9:05");
});

// setDateAndTime()
test("Sets date and time displays correctly for 24-hour clock", () => {
  jest.spyOn(Date, "now").mockImplementation(() => 1625913488);
  preferences.clockDisplay = "24h";
  sensorFunctions.setDateAndTime(dateDisplay, clockDisplay);
  expect(dateDisplay.text).toBe("Mon, Jan 19, 1970");
  expect(clockDisplay.text).toBe("14:38");
});

// startHeartMonitoring()
// TODO: find out how to test heartSensor.onreading()
test("Starts heart rate monitoring and observes changes from display onchange", () => {
  let bodyStartSpy = jest.spyOn(BodyPresenceSensor.prototype, "start");
  let bodyStopSpy = jest.spyOn(BodyPresenceSensor.prototype, "stop");
  let heartStartSpy = jest.spyOn(HeartRateSensor.prototype, "start");
  let heartStopSpy = jest.spyOn(HeartRateSensor.prototype, "stop");

  sensorFunctions.startHeartMonitoring(heartDisplay);
  expect(bodyStartSpy).toHaveBeenCalledTimes(1);
  expect(heartStartSpy).toHaveBeenCalledTimes(1);

  display.onchange();
  expect(bodyStartSpy).toHaveBeenCalledTimes(2);
  expect(heartStartSpy).toHaveBeenCalledTimes(2);

  setPresent(false);
  sensorFunctions.startHeartMonitoring(heartDisplay);
  display.onchange();
  expect(bodyStartSpy).toHaveBeenCalledTimes(4);
  expect(heartStopSpy).toHaveBeenCalledTimes(1);

  display.on = false;
  display.onchange();
  expect(bodyStopSpy).toHaveBeenCalledTimes(1);
  expect(heartStopSpy).toHaveBeenCalledTimes(2);
});

// startHeartMonitoring()
test("Fails to start heart rate monitoring", () => {
  allowPermission(false);
  let consoleSpy = jest.spyOn(console, "log");
  sensorFunctions.startHeartMonitoring(heartDisplay);
  expect(consoleSpy).toHaveBeenCalledWith(
    "The device does not have the required sensors, or the app does not have required permissions."
  );
});

// updateChargeDisplay()
test("Updates battery charge display with percentage", () => {
  sensorFunctions.updateChargeDisplay(batteryDisplay);
  expect(batteryDisplay.text).toBe("100%");
  expect(batteryDisplay.x).toBe(10);
});

// updateChargeDisplay()
test("Updates battery charge display, adjusting for charging icon", () => {
  charger.connected = true;
  sensorFunctions.updateChargeDisplay(batteryDisplay);
  expect(batteryDisplay.text).toBe("100%");
  expect(batteryDisplay.x).toBe(45);
});

// updateChargeDisplay()
test("Updates battery charge display, adjusting for low battery icon", () => {
  battery.chargeLevel = 12;
  sensorFunctions.updateChargeDisplay(batteryDisplay);
  expect(batteryDisplay.text).toBe("12%");
  expect(batteryDisplay.x).toBe(45);
});
