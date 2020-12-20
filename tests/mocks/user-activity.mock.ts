export class ActiveZoneMinutes {
  cardio: number | undefined;
  fatBurn: number | undefined;
  peak: number | undefined;
  total: number = 0;
}

class Activity {
  activeZoneMinutes: ActiveZoneMinutes | undefined;
  calories: number | undefined;
  distance: number | undefined;
  elevationGain: number | undefined;
  steps: number | undefined;
}

export const today = {
  adjusted: new Activity()
};

export const goals = new Activity();
