import SettingsData from "../../types/settings-data";

let fileExists = true;
let settings = new SettingsData();

export const setFileExists = (exists: boolean) => {
  fileExists = exists;
};

export const setSettingsData = (data: SettingsData) => {
  settings = data;
};

export const existsSync = (settingsFile: string) => {
  return fileExists;
};

export const readFileSync = (settingsFile: string, settingsType: string) => {
  return settings;
};

export const writeFileSync = (settingsFile: string, settingsData: SettingsData, settingsType: string) => {
  settings = settingsData;
};
