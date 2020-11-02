import * as fs from '../fitbit-mocks/fs';
import {ActivityName} from '../../types/activity-name';
import ActivityValues from '../../types/activity-values';
import SettingsData from '../../types/settings-data';

const deviceSettingsTests = require('../../app/device-settings.ts');

// loadSettings()
test('Load existing settings from file via loadSettings()', () => {
  let calories = new ActivityValues(ActivityName.calories, 2000);
  calories.color = 'green';
  fs.setData('calories', calories);
  fs.setData('backgroundColor', 'blue');
  fs.setSettingsFile('settings.cbor');

  let data = deviceSettingsTests.loadSettings();
  expect(data).toBeDefined();
  expect(data.backgroundColor).toBe('blue');
  expect(data.calories.color).toBe('green');
});

test('Attempt to load settings from a non-existent file via loadSettings()', () => {
  fs.setSettingsFile('settings.json');
  let data = deviceSettingsTests.loadSettings();
  expect(data).toStrictEqual(new SettingsData());
});

// toggleOrder()
test('Add a new activity to activityOrder[] via toggleOrder()', () => {
  let activityOrder = ['steps'];
  deviceSettingsTests.toggleOrder(true, ActivityName.distance, activityOrder);
  expect(activityOrder).toStrictEqual(['steps', 'distance']);
});

test('Try to add an existing activity to activityOrder[] via toggleOrder()', () => {
  let activityOrder = ['steps', 'calories'];
  deviceSettingsTests.toggleOrder(true, ActivityName.calories, activityOrder);
  expect(activityOrder).toStrictEqual(['steps', 'calories']);
});

test('Remove an existing activity from activityOrder[] via toggleOrder()', () => {
  let activityOrder = ['distance', 'steps'];
  deviceSettingsTests.toggleOrder(false, ActivityName.distance, activityOrder);
  expect(activityOrder).toStrictEqual(['steps']);
});

test('Try to remove a non-existent activity from activityOrder[] via toggleOrder()', () => {
  let activityOrder = ['elevationGain'];
  deviceSettingsTests.toggleOrder(false, ActivityName.calories, activityOrder);
  expect(activityOrder).toStrictEqual(['elevationGain']);
});