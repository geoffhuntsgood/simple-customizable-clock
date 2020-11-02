import SettingsData from '../../types/settings-data';

let testSettingsData = new SettingsData();
let settingsFile = 'settings.cbor';

export function existsSync(filename: string): boolean {
  return filename === settingsFile;
}

export function readFileSync(filename: string, encoding: 'cbor' | 'json'): SettingsData {
  return testSettingsData;
}

export function writeFileSync(filename: string, data: any, encoding: 'cbor' | 'json'): void {
  testSettingsData = data as SettingsData;
}

export function setSettingsFile(filename: string): void {
  settingsFile = filename;
}

export function setData(key: string, value: any): void {
  if (testSettingsData[`${key}`]) {
    testSettingsData[`${key}`] = value;
  }
}
