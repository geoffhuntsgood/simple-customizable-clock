import * as settingsFunctions from "../../app/app-functions-settings";
import SettingsData from "../../types/settings-data";
import { defaultArc, defaultIcon, defaultText } from "../mocks/document.mock";

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

// placeItem()
test("Places the arc, icon, and text elements for an activity", () => {
  settingsFunctions.placeItem("test", 150, 150);
  expect(defaultArc.style.display).toBe("inline");
  expect(defaultArc.x).toBe(120);
  expect(defaultArc.y).toBe(120);
  expect(defaultIcon.style.display).toBe("inline");
  expect(defaultIcon.x).toBe(135);
  expect(defaultIcon.y).toBe(135);
  expect(defaultText.style.display).toBe("inline");
  expect(defaultText.x).toBe(148);
  expect(defaultText.y).toBe(205);
});

// initializeSettings()
// TODO: fill in test cases for settings initialization
test("Initializes settings with default values", () => {
  settingsFunctions.initializeSettings(new SettingsData());
});
