import * as settingsFunctions from "../../app/app-functions-settings";
import SettingsData from "../../types/settings-data";

// getBaseHeartRate()
test("Retrieves the current baseHeartRate value", () => {
  let base = settingsFunctions.getBaseHeartRate();
  expect(base).not.toBeNull();
  expect(base).toBeFalsy();
});

// getUseCelsius()
test("Retrieves the current useCelsius value", () => {
  let celsius = settingsFunctions.getUseCelsius();
  expect(celsius).not.toBeNull();
  expect(celsius).toBeFalsy();
});

// initializeSettings()
// TODO: fill in test cases for settings initialization
test("Initializes settings with default values", () => {
  settingsFunctions.initializeSettings(new SettingsData());
});
