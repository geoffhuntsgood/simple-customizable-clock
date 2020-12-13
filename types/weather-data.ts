export default class WeatherData {
  celsius: number;
  fahrenheit: number;
  daytime: boolean;
  conditionCode: number;

  constructor(celsius: number, fahrenheit: number, daytime: boolean, conditionCode: number) {
    this.celsius = celsius;
    this.fahrenheit = fahrenheit;
    this.daytime = daytime;
    this.conditionCode = conditionCode;
  }
}
