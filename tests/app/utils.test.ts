import documentTest from '../fitbit-mocks/document';
import * as userActivityTest from '../fitbit-mocks/user-activity';
import * as userSettingsTest from '../fitbit-mocks/user-settings';

const utilsTests = require('../../app/utils.ts');

// getMonthAndWeekdayNames()
test('Test getMonthAndWeekdayNames()', () => {
  expect(utilsTests.getMonthAndWeekdayNames(3, 4)).toStrictEqual(['Apr', 'Thu']);
  expect(utilsTests.getMonthAndWeekdayNames(11, 0)).toStrictEqual(['Dec', 'Sun']);
});

// zeroPad()
test('Test zeroPad() with padding', () => {
  expect(utilsTests.zeroPad(5)).toBe('05');
});

test('Test zeroPad() without padding', () => {
  expect(utilsTests.zeroPad(12)).toBe('12');
});

// setActivityProgress()
test('Test progress and arc setting for a number (steps) via setActivityProgress()', () => {
  userActivityTest.today.adjusted.steps = 1000;
  userActivityTest.goals.steps = 10000;
  utilsTests.setActivityProgress('steps');
  expect(documentTest.text.text).toBe('1000');
  expect(documentTest.arc.sweepAngle).toBe(36);
});

test('Test progress and arc setting for distance (km) via setActivityProgress()', () => {
  userActivityTest.today.adjusted.distance = 2500;
  userActivityTest.goals.distance = 5000;
  userSettingsTest.units.distance = 'metric';
  utilsTests.setActivityProgress('distance');
  expect(documentTest.text.text).toBe('2.50');
  expect(documentTest.arc.sweepAngle).toBe(180);
});

test('Test progress and arc setting for distance (mi) via setActivityProgress()', () => {
  userActivityTest.today.adjusted.distance = 3200;
  userActivityTest.goals.distance = 10000;
  userSettingsTest.units.distance = 'imperial';
  utilsTests.setActivityProgress('distance');
  expect(documentTest.text.text).toBe('1.99');
  expect(documentTest.arc.sweepAngle).toBe(115);
});

test('Test progress and arc setting for activeZoneMinutes via setActivityProgress()', () => {
  userActivityTest.today.adjusted.activeZoneMinutes.total = 10;
  userActivityTest.goals.activeZoneMinutes.total = 30;
  utilsTests.setActivityProgress('activeZoneMinutes');
  expect(documentTest.text.text).toBe('10');
  expect(documentTest.arc.sweepAngle).toBe(120);
});

// removeActivity()
test('Test singular activity removal via removeActivity()', () => {
  utilsTests.removeActivity(documentTest.arc, documentTest.icon, documentTest.text);
  Helper.testZeroPlacement();
});

test('Test singular activity removal, after placement, via removeActivity()', () => {
  utilsTests.placeItem('test', 200, 100);
  utilsTests.removeActivity(documentTest.arc, documentTest.icon, documentTest.text);
  Helper.testZeroPlacement();
});

// placeActivities()
test('Test zero item/default placement via placeActivities()', () => {
  // case 0
  let activities: string[] = [];
  utilsTests.placeActivities(activities);
  Helper.testZeroPlacement();

  // default
  activities.push('', '', '', '', '', '', '');
  utilsTests.placeActivities(activities);
  Helper.testZeroPlacement();
});

test('Test placing one item via placeActivities()', () => {
  let activities = ['steps'];
  documentTest.root.height = 300;
  documentTest.root.width = 300;
  utilsTests.placeActivities(activities);
  // Center X is 300 / 2 + 2 = 152
  // Center Y is 300 / 5 * 4 = 240
  Helper.testLastPlacement(122, 210, 150, 295, 137, 225);
});

test('Test placing two items via placeActivities()', () => {
  let activities = ['steps', 'calories'];
  documentTest.root.height = 336;
  documentTest.root.width = 336;
  utilsTests.placeActivities(activities);
  // Center X is (336 / 3 * 2) + 2 = 226
  // Center Y is Math.floor(336 / 5 * 4) = 268
  Helper.testLastPlacement(196, 238, 224, 323, 211, 253);
});

test('Test placing three items via placeActivities()', () => {
  let activities = ['steps', 'calories', 'elevationGain'];
  documentTest.root.height = 300;
  documentTest.root.width = 300;
  utilsTests.placeActivities(activities);
  // Center X is (300 / 4 * 3) + 2 = 227
  // Center Y is 300 / 5 * 4 = 240
  Helper.testLastPlacement(197, 210, 225, 295, 212, 225);
});

test('Test placing four items via placeActivities()', () => {
  let activities = ['steps', 'calories', 'elevationGain', 'activeZoneMinutes'];
  documentTest.root.height = 250;
  documentTest.root.width = 348;
  utilsTests.placeActivities(activities);
  // Center X is Math.floor(348 / 5) * 4 + 10 = 286
  // Center Y is 250 / 5 * 4 = 200
  Helper.testLastPlacement(256, 170, 284, 255, 271, 185);
});

test('Test placing five items via placeActivities()', () => {
  let activities = ['steps', 'calories', 'elevationGain', 'activeZoneMinutes', 'distance'];
  documentTest.root.height = 300;
  documentTest.root.width = 300;
  utilsTests.placeActivities(activities);
  // Center X is (300 / 6 * 5) + 14 = 264
  // Center Y is 300 / 5 * 4 = 240
  Helper.testLastPlacement(234, 210, 262, 295, 249, 225);
});

// placeItem()
test('Test singular activity placement via placeItem()', () => {
  utilsTests.placeItem('test', 100, 50);
  expect(documentTest.arc.x).toBe(70);
  expect(documentTest.arc.y).toBe(20);
  expect(documentTest.arc.style.display).toBe('inline');
  expect(documentTest.icon.x).toBe(85);
  expect(documentTest.icon.y).toBe(35);
  expect(documentTest.icon.style.display).toBe('inline');
  expect(documentTest.text.x).toBe(98);
  expect(documentTest.text.y).toBe(105);
  expect(documentTest.text.style.display).toBe('inline');
});

// getAngle()
test('Test getAngle() at 0 when parameters are undefined', () => {
  expect(utilsTests.getAngle('test', undefined, undefined)).toBe(0);
  expect(utilsTests.getAngle('test', 100, undefined)).toBe(0);
  expect(utilsTests.getAngle('test', undefined, 100)).toBe(0);
});

test('Test getAngle() at 360 when ratio is > 1', () => {
  expect(utilsTests.getAngle('test', 10, 2)).toBe(360);
});

test('Test getAngle() ratio', () => {
  expect(utilsTests.getAngle('test', 100, 100)).toBe(360);
  expect(utilsTests.getAngle('test', 1, 5)).toBe(72);
  expect(utilsTests.getAngle('test', 10, 23)).toBe(156);
});

// getDistanceText()
test('Test getDistanceText() in metric with proper padding', () => {
  userSettingsTest.units.distance = 'metric';
  expect(utilsTests.getDistanceText(1000)).toBe('1.00');
  expect(utilsTests.getDistanceText(1234)).toBe('1.23');
});

test('Test getDistanceText() in imperial with proper padding', () => {
  userSettingsTest.units.distance = 'imperial';
  expect(utilsTests.getDistanceText(1609)).toBe('1.00');
  expect(utilsTests.getDistanceText(1000)).toBe('0.62');
});

class Helper {
  static testZeroPlacement() {
    expect(documentTest.arc.x).toBe(0);
    expect(documentTest.arc.y).toBe(0);
    expect(documentTest.arc.style.display).toBe('none');
    expect(documentTest.icon.x).toBe(0);
    expect(documentTest.icon.y).toBe(0);
    expect(documentTest.icon.style.display).toBe('none');
    expect(documentTest.text.x).toBe(0);
    expect(documentTest.text.y).toBe(0);
    expect(documentTest.text.style.display).toBe('none');
  }

  static testLastPlacement(arcX: number, arcY: number, textX: number, textY: number, iconX: number, iconY: number) {
    expect(documentTest.arc.style.display).toBe('inline');
    expect(documentTest.arc.x).toBe(arcX);
    expect(documentTest.arc.y).toBe(arcY);
    expect(documentTest.text.style.display).toBe('inline');
    expect(documentTest.text.x).toBe(textX);
    expect(documentTest.text.y).toBe(textY);
    expect(documentTest.icon.style.display).toBe('inline');
    expect(documentTest.icon.x).toBe(iconX);
    expect(documentTest.icon.y).toBe(iconY);
  }
}