const utilsTests = require('../../app/utils.ts');
const document = require('../fitbit-mocks/document.ts');
import {units} from '../fitbit-mocks/user-settings';

// zeroPad()
test('Test zeroPad() with padding', () => {
  expect(utilsTests.zeroPad(5)).toBe('05');
});

test('Test zeroPad() without padding', () => {
  expect(utilsTests.zeroPad(12)).toBe('12');
});

// setActivityProgress()
test('Test progress and arc setting via setActivityProgress()', () => {

});

// removeActivity()
test('Test singular activity removal via removeActivity()', () => {
  Helper.testRemove();
});

test('Test singular activity removal, after placement, via removeActivity()', () => {
  utilsTests.placeItem('test', 200, 100);
  Helper.testRemove();
});

// placeItem()
test('Test singular activity placement via placeItem()', () => {
  utilsTests.placeItem('test', 100, 50);
  expect(document.arc.x).toBe(70);
  expect(document.arc.y).toBe(20);
  expect(document.arc.style.display).toBe('inline');
  expect(document.icon.x).toBe(85);
  expect(document.icon.y).toBe(35);
  expect(document.icon.style.display).toBe('inline');
  expect(document.text.x).toBe(98);
  expect(document.text.y).toBe(105);
  expect(document.text.style.display).toBe('inline');
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
  units.distance = 'metric';
  expect(utilsTests.getDistanceText(1000)).toBe('1.00');
  expect(utilsTests.getDistanceText(1234)).toBe('1.23');
});

test('Test getDistanceText() in imperial with proper padding', () => {
  units.distance = 'imperial';
  expect(utilsTests.getDistanceText(1609)).toBe('1.00');
  expect(utilsTests.getDistanceText(1000)).toBe('0.62');
});

class Helper {
  static testRemove() {
    utilsTests.removeActivity(document.arc, document.icon, document.text);
    expect(document.arc.x).toBe(0);
    expect(document.arc.y).toBe(0);
    expect(document.arc.style.display).toBe('none');
    expect(document.icon.x).toBe(0);
  }
}