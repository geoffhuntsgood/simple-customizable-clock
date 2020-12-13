const colorSet = [
  {color: 'red'},
  {color: 'crimson'},
  {color: 'orange'},
  {color: 'gold'},
  {color: 'yellow'},
  {color: 'lime'},
  {color: 'limegreen'},
  {color: 'deepskyblue'},
  {color: 'blue'},
  {color: 'purple'},
  {color: 'deeppink'},
  {color: 'black'},
  {color: 'white'},
  {color: 'saddlebrown'}
];

const options = [
  ['Background Color', 'backgroundColor'],
  ['Time Color', 'timeColor'],
  ['Date Color', 'dateColor'],
  ['Battery Charge Color', 'batteryColor'],
  ['Weather Color', 'weatherColor'],
  ['Heart Rate Color', 'heartColor'],
  ['Active Zone Minutes Color', 'activeZoneMinutesColor'],
  ['Calories Burned Color', 'caloriesColor'],
  ['Distance Traveled Color', 'distanceColor'],
  ['Floors Climbed Color', 'elevationGainColor'],
  ['Steps Taken Color', 'stepsColor']
];

registerSettingsPage(() => <Page>
  <Section title="Display User Activities">
    <Toggle settingsKey='activeZoneMinutesShow' label="Active Zone Minutes"/>
    <Toggle settingsKey='caloriesShow' label="Calories Burned"/>
    <Toggle settingsKey='distanceShow' label="Distance Traveled"/>
    <Toggle settingsKey='elevationGainShow' label="Floors Climbed"/>
    <Toggle settingsKey='stepsShow' label="Steps Taken"/>
    <Toggle settingsKey='baseHeartRateShow' label="Show Resting Heart Rate"/>
    <Toggle settingsKey='useCelsius' label="Use Celsius for Weather"/>
  </Section>
  {options.map(([title, settingsKey]) =>
      <Section title={title}>
        <ColorSelect
            centered={true}
            settingsKey={settingsKey}
            colors={colorSet}/>
      </Section>
  )}
</Page>);
