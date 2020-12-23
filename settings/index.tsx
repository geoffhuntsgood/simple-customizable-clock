// @ts-nocheck

// Default set of selectable colors.
const colorSet = [
  { color: "red" },
  { color: "crimson" },
  { color: "orange" },
  { color: "gold" },
  { color: "yellow" },
  { color: "lime" },
  { color: "limegreen" },
  { color: "deepskyblue" },
  { color: "blue" },
  { color: "purple" },
  { color: "deeppink" },
  { color: "black" },
  { color: "white" },
  { color: "saddlebrown" }
];

// Selectable options, and their associated settings keys.
const options = [
  ["Background Color", "backgroundColor"],
  ["Time Color", "timeColor"],
  ["Date Color", "dateColor"],
  ["Battery Charge Color", "batteryColor"],
  ["Weather Color", "weatherColor"],
  ["Heart Rate Color", "heartColor"],
  ["Active Zone Minutes Color", "activeZoneMinutesColor"],
  ["Calories Burned Color", "caloriesColor"],
  ["Distance Traveled Color", "distanceColor"],
  ["Floors Climbed Color", "elevationGainColor"],
  ["Steps Taken Color", "stepsColor"]
];

// Returns a label based on the state of a setting.
const toggleLabel = (settings: SettingsComponentProps, key: string, trueLabel: string, falseLabel: string) => {
  return settings.settingsStorage.getItem(key) === "true" ? trueLabel : falseLabel;
};

// Renders the settings page on the phone.
registerSettingsPage((settings: SettingsComponentProps) => (
    <Page>
      <Section title="User Activity Settings">
        <Toggle
            settingsKey="activeZoneMinutesShow"
            label={`${toggleLabel(settings, "activeZoneMinutesShow", "Show", "Hide")} active zone minutes`}/>
        <Toggle
            settingsKey="caloriesShow"
            label={`${toggleLabel(settings, "caloriesShow", "Show", "Hide")} calories burned`}/>
        <Toggle
            settingsKey="distanceShow"
            label={`${toggleLabel(settings, "distanceShow", "Show", "Hide")} distance traveled`}/>
        <Toggle
            settingsKey="elevationGainShow"
            label={`${toggleLabel(settings, "elevationGainShow", "Show", "Hide")} floors climbed`}/>
        <Toggle
            settingsKey="stepsShow"
            label={`${toggleLabel(settings, "stepsShow", "Show", "Hide")} steps taken`}/>
        <Toggle
            settingsKey="baseHeartRateShow"
            label={`${toggleLabel(settings, "baseHeartRateShow", "Show", "Hide")} base heart rate`}/>
        <Toggle
            settingsKey="useCelsius"
            label={`Use ${toggleLabel(settings, "useCelsius", "Celsius", "Fahrenheit")} for weather`}/>
        <Toggle
            settingsKey="showSeconds"
            label={`Show time as ${toggleLabel(settings, "showSeconds", "HH:MM:SS", "HH:MM")}`}/>
        <Toggle
            settingsKey="colorLabels"
            label={`Display activity values in ${toggleLabel(settings, "colorLabels", "their color", "white")}`}/>
      </Section>
      <Section title="Color Settings">
        {options.map(([title, settingsKey]) => (
            <Fragment>
              <Text align="left" bold>{title}</Text>
              <ColorSelect settingsKey={settingsKey} centered={true} colors={colorSet}/>
            </Fragment>
        ))}
      </Section>
    </Page>
));
