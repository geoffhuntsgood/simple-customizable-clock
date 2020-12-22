import * as deviceSettings from "../../app/device-settings";
import { ActivityName } from "../../types/activity-name";
import SettingsData from "../../types/settings-data";
import * as fs from "../mocks/fs.mock";

// loadSettings()
test("Loads existing settings file", () => {
  let expectedData = new SettingsData();
  expectedData.batteryColor = "green";
  fs.setSettingsData(expectedData);
  let receivedData = deviceSettings.loadSettings();
  expect(receivedData).toStrictEqual(expectedData);
});

// loadSettings()
test("Writes a new settings file and loads from it", () => {
  let consoleSpy = jest.spyOn(console, "log");
  let notExpectedData = new SettingsData();
  notExpectedData.batteryColor = "green";
  fs.setSettingsData(notExpectedData);
  fs.setFileExists(false);
  let receivedData = deviceSettings.loadSettings();
  expect(consoleSpy).toHaveBeenCalledWith("settings.cbor does not exist. Writing a new one.");
  expect(receivedData).not.toStrictEqual(notExpectedData);
  expect(receivedData).toStrictEqual(new SettingsData());
});

// toggleOrder()
test("Adds non-present activity to activityOrder", () => {
  let activityOrder = ["activeZoneMinutes"];
  deviceSettings.toggleOrder(true, ActivityName.steps, activityOrder);
  expect(activityOrder).toStrictEqual(["activeZoneMinutes", "steps"]);
});

// toggleOrder()
test("Keeps present activity in activityOrder", () => {
  let activityOrder = ["steps", "calories"];
  deviceSettings.toggleOrder(true, ActivityName.steps, activityOrder);
  expect(activityOrder).toStrictEqual(["steps", "calories"]);
});

// toggleOrder()
test("Removes present activity from activityOrder", () => {
  let activityOrder = ["calories", "elevationGain"];
  deviceSettings.toggleOrder(false, ActivityName.calories, activityOrder);
  expect(activityOrder).toStrictEqual(["elevationGain"]);
});

// toggleOrder()
test("Keeps non-present activity out of activityOrder", () => {
  let activityOrder = ["elevationGain"];
  deviceSettings.toggleOrder(false, ActivityName.activeZoneMinutes, activityOrder);
  expect(activityOrder).toStrictEqual(["elevationGain"]);
});
