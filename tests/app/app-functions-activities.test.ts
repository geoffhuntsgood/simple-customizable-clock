import * as activityFunctions from "../../app/app-functions-activities";
import { ActivityName } from "../../types/activity-name";
import { defaultArc, defaultText } from "../mocks/document.mock";
import { ActiveZoneMinutes, goals, today } from "../mocks/user-activity.mock";
import { units } from "../mocks/user-settings.mock";

// getActivityNames()
// TODO: find out how to mock a type for Barometer check
test("Retrieves the set of activity names, excluding elevationGain", () => {
  let activities = activityFunctions.getActivityNames();
  let fullSet = Object.keys(ActivityName).filter((act: string) => act !== "elevationGain");
  expect(activities).toStrictEqual(fullSet);
});

// updateActivities()
test("Sets the Active Zone Minutes arc and text to 0 when data is missing", () => {
  jest.spyOn(activityFunctions, "getActivityNames").mockImplementation(() => ["activeZoneMinutes"]);
  activityFunctions.updateActivities();
  expect(defaultText.text).toBe("0");
  expect(defaultArc.sweepAngle).toBe(0);
});

// updateActivities()
test("Updates the Active Zone Minutes arc and text", () => {
  jest.spyOn(activityFunctions, "getActivityNames").mockImplementation(() => ["activeZoneMinutes"]);
  today.adjusted.activeZoneMinutes = new ActiveZoneMinutes();
  today.adjusted.activeZoneMinutes.total = 10;
  goals.activeZoneMinutes = new ActiveZoneMinutes();
  goals.activeZoneMinutes.total = 30;
  activityFunctions.updateActivities();
  expect(defaultText.text).toBe("10");
  expect(defaultArc.sweepAngle).toBe(120);
});

// updateActivities()
test("Sets the Distance arc and text to 0 when data is missing", () => {
  jest.spyOn(activityFunctions, "getActivityNames").mockImplementation(() => ["distance"]);
  activityFunctions.updateActivities();
  expect(defaultText.text).toBe("0.00");
  expect(defaultArc.sweepAngle).toBe(0);
});

// updateActivities()
test("Updates the Distance arc and text", () => {
  jest.spyOn(activityFunctions, "getActivityNames").mockImplementation(() => ["distance"]);
  units.distance = "metric";
  today.adjusted.distance = 1000;
  goals.distance = 3000;
  activityFunctions.updateActivities();
  expect(defaultText.text).toBe("1.00");
  expect(defaultArc.sweepAngle).toBe(120);
});

// updateActivities()
test("Sets other activity arcs and texts to 0 when data is missing", () => {
  jest.spyOn(activityFunctions, "getActivityNames").mockImplementation(() => ["calories"]);
  activityFunctions.updateActivities();
  expect(defaultText.text).toBe("0");
  expect(defaultArc.sweepAngle).toBe(0);
});

// updateActivities()
test("Updates other activity arcs and texts", () => {
  jest.spyOn(activityFunctions, "getActivityNames").mockImplementation(() => ["calories"]);
  today.adjusted.calories = 700;
  goals.calories = 2000;
  activityFunctions.updateActivities();
  expect(defaultText.text).toBe("700");
  expect(defaultArc.sweepAngle).toBe(126);
});

// getAngle()
test("Returns progress percentage out of total as degrees", () => {
  expect(activityFunctions.getAngle(3, 10)).toBe(108);
});

// getAngle()
test("Returns 360 if progress exceeds goal", () => {
  expect(activityFunctions.getAngle(2, 1)).toBe(360);
});

// getAngle()
test("Returns 0 if goal is 0", () => {
  expect(activityFunctions.getAngle(10, 0)).toBe(0);
});

// getDistanceText()
test("Returns distance as miles or kilometers, based on user preference", () => {
  expect(activityFunctions.getDistanceText(2015)).toBe("2.02");
  units.distance = "us";
  expect(activityFunctions.getDistanceText(2000)).toBe("1.24");
});

// placeActivities()
test("Does not place any activity when activityList length is 0", () => {
  let placeItemSpy = jest.spyOn(activityFunctions, "placeItem");
  activityFunctions.placeActivities([]);
  expect(placeItemSpy).not.toHaveBeenCalled();
});

// placeActivities()
test("Does not place any activity when activityList length is too long", () => {
  let placeItemSpy = jest.spyOn(activityFunctions, "placeItem");
  activityFunctions.placeActivities(["", "", "", "", "", ""]);
  expect(placeItemSpy).not.toHaveBeenCalled();
});

// Spies on individual calls to placeItem() in placeActivities().
const trackPlaceActivities = (activities: string[], xValues: number[]) => {
  let placeItemSpy = jest.spyOn(activityFunctions, "placeItem");
  activityFunctions.placeActivities(activities);
  // Default height/width is 300x300
  activities.forEach((act: string, index: number) => {
    expect(placeItemSpy).toHaveBeenNthCalledWith(index + 1, act, xValues[index], 240);
  });
};

// placeActivities()
test("Places 1 activity when activityList length is 1", () => {
  let activities = ["activeZoneMinutes"];
  let xValues = [152];
  trackPlaceActivities(activities, xValues);
});

// placeActivities()
test("Places 2 activities when activityList length is 2", () => {
  let activities = ["activeZoneMinutes", "calories"];
  let xValues = [102, 202];
  trackPlaceActivities(activities, xValues);
});

// placeActivities()
test("Places 3 activities when activityList length is 3", () => {
  let activities = ["activeZoneMinutes", "calories", "distance"];
  let xValues = [77, 152, 227];
  trackPlaceActivities(activities, xValues);
});

// placeActivities()
test("Places 4 activities when activityList length is 4", () => {
  let activities = ["activeZoneMinutes", "calories", "distance", "elevationGain"];
  let xValues = [55, 120, 185, 250];
  trackPlaceActivities(activities, xValues);
});

// placeActivities()
test("Places 5 activities when activityList length is 5", () => {
  let activities = ["activeZoneMinutes", "calories", "distance", "elevationGain", "steps"];
  let xValues = [40, 96, 152, 208, 264];
  trackPlaceActivities(activities, xValues);
});
