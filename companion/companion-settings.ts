import { geolocation } from "geolocation";
import { peerSocket } from "messaging";
import { settingsStorage } from "settings";
import { ActivityName } from "../types/activity-name";
import StorageData from "../types/storage-data";
import WeatherData from "../types/weather-data";

// API key for OpenWeatherMap.
let apiKey: string | null = null;

// Storage for in-flight requests that haven't been processed yet.
let inFlights: StorageData[] = [];

// Initializes the clock face's settings.
export function initialize(): void {
  // By default, show all user activities.
  Object.keys(ActivityName).forEach((act: string) => {
    let key = `${act}Show`;
    let settingKey = settingsStorage.getItem(key);
    if (settingKey === null || settingKey === undefined) {
      settingsStorage.setItem(key, "true");
    }
  });

  // Triggers changes to settings to be sent to the device.
  settingsStorage.onchange = (event: StorageChangeEvent) => {
    handleSettingChange(event);
  };

  // Fetch weather data every 15 minutes (current data only, no forecasting)
  getWeather().catch((error) => {
    console.log("Failed to fetch weather: ", error);
  });
  setInterval(getWeather, 15 * 60 * 1000);
}

// Handles a settings change from the phone.
export const handleSettingChange = (event: StorageChangeEvent): void => {
  if (event.key === "apiKey") {
    apiKey = event.newValue ? event.newValue : null;
  } else {
    if (event.key && event.newValue && event.oldValue !== event.newValue) {
      let data = new StorageData(event.key, JSON.parse(event.newValue));
      if (peerSocket.readyState === peerSocket.OPEN) {
        peerSocket.send(data);
      } else {
        console.log("peerSocket is not open. Adding setting request to queue.");
        inFlights.push(data);
      }
    } else {
      console.log("No changes will be saved.");
    }
  }
};

// Fetches weather information and updates the display.
export const getWeather = async (): Promise<void> => {
  geolocation.getCurrentPosition(
    (position: Position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let key = apiKey ? apiKey : "e79ddcc3266e3ade636be2248739efe4";
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${key}&lat=${latitude}&lon=${longitude}`;

      fetch(url)
        .then((response: Response) => response.json())
        .then((data) => {
          if (data.weather) {
            let weatherData = new WeatherData(
              data.main.temp - 273.15,
              ((data.main.temp - 273.15) * 9) / 5 + 32,
              data.dt > data.sys.sunrise && data.dt < data.sys.sunset,
              data.weather[0].id
            );
            let storageData = new StorageData("weather", JSON.stringify(weatherData));
            if (peerSocket.readyState === peerSocket.OPEN) {
              peerSocket.send(storageData);
            } else {
              console.log("peerSocket is not open. Adding weather request to queue.");
              inFlights.push(storageData);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    (error: PositionError) => {
      console.log(error.message);
    },
    { timeout: 60 * 1000 }
  );
};

peerSocket.onopen = () => {
  if (inFlights.length > 0) {
    sendInFlights();
  }
};

// Sends all incomplete requests to the device when ready.
export const sendInFlights = (): void => {
  if (inFlights.length > 0) {
    console.log("Sending in-flight requests to device...");
    inFlights.forEach((item: StorageData) => {
      peerSocket.send(item);
    });
    inFlights = [];
  }
};
