class ActiveZoneMinutes {
  cardio: number = 0;
  fatBurn: number = 0;
  peak: number = 0;
  total: number = 0;
}

let goals = {
  activeZoneMinutes: new ActiveZoneMinutes(),
  calories: 0,
  distance: 0,
  elevationGain: 0,
  steps: 0
};

let today = {
  adjusted: {
    activeZoneMinutes: new ActiveZoneMinutes(),
    calories: 0,
    distance: 0,
    elevationGain: 0,
    steps: 0
  }
};

export {ActiveZoneMinutes, goals, today};
