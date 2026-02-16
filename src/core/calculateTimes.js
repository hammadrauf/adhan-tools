import {
  PrayerTimes,
  Coordinates,
  CalculationMethod,
  Madhab
} from "adhan";

export function getPrayerTimes(config, date = new Date()) {
  const coords = new Coordinates(
    config.location.latitude,
    config.location.longitude
  );

  const methodFn = CalculationMethod[config.calculation.method];

  if (!methodFn) {
    throw new Error(
      `Invalid calculation method: ${config.calculation.method}`
    );
  }

  const params = methodFn();

  // Apply madhab if provided
  if (config.calculation.madhab) {
    const madhabEnum = Madhab[config.calculation.madhab];
    if (!madhabEnum) {
      throw new Error(
        `Invalid madhab: ${config.calculation.madhab}. Valid: Shafi, Hanafi`
      );
    }
    params.madhab = madhabEnum;
  }

  const times = new PrayerTimes(coords, date, params);

  return {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha
  };
}