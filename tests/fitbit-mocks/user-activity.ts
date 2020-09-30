class ActiveZoneMinutes {
  cardio: number | undefined;
  fatBurn: number | undefined;
  peak: number | undefined;
  total: number = 0;
}

let goals = {
  activeZoneMinutes: new ActiveZoneMinutes(),
  calories: undefined,
  distance: undefined,
  elevationGain: undefined,
  steps: undefined
};

let today = {
  adjusted: {
    activeZoneMinutes: new ActiveZoneMinutes(),
    calories: undefined,
    distance: undefined,
    elevationGain: undefined,
    steps: undefined
  }
};

module.exports = {ActiveZoneMinutes, goals, today};