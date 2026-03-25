import { calculateCalories, calculateDistance, calculateSpeed } from '../utils/stats';

describe('calculateDistance', () => {
  it('returns 0 for empty route', () => {
    expect(calculateDistance([])).toBe(0);
  });

  it('returns 0 for single point', () => {
    expect(calculateDistance([{ lat: 55.75, lng: 37.62, ts: 0 }])).toBe(0);
  });

  it('calculates distance between two known points', () => {
    // Moscow center ~1km apart
    const route = [
      { lat: 55.7558, lng: 37.6173, ts: 0 },
      { lat: 55.7650, lng: 37.6173, ts: 1000 },
    ];
    const dist = calculateDistance(route);
    // ~1023m between these points
    expect(dist).toBeGreaterThan(900);
    expect(dist).toBeLessThan(1200);
  });

  it('accumulates distance over route segments', () => {
    const route = [
      { lat: 55.75, lng: 37.60, ts: 0 },
      { lat: 55.75, lng: 37.61, ts: 1000 },
      { lat: 55.75, lng: 37.62, ts: 2000 },
    ];
    const dist = calculateDistance(route);
    expect(dist).toBeGreaterThan(0);
  });
});

describe('calculateCalories', () => {
  it('calculates with default weight', () => {
    const cal = calculateCalories(5); // 5 km
    expect(cal).toBe(Math.round(70 * 5 * 0.75));
  });

  it('uses custom weight', () => {
    const cal = calculateCalories(3, 80);
    expect(cal).toBe(Math.round(80 * 3 * 0.75));
  });

  it('returns 0 for 0 km', () => {
    expect(calculateCalories(0)).toBe(0);
  });
});

describe('calculateSpeed', () => {
  it('returns 0 for 0 duration', () => {
    expect(calculateSpeed(1000, 0)).toBe(0);
  });

  it('calculates km/h correctly', () => {
    // 1000m in 3600sec = 1 km/h
    expect(calculateSpeed(1000, 3600)).toBeCloseTo(1.0);
  });

  it('calculates 5 km/h', () => {
    // 5000m in 3600sec = 5 km/h
    expect(calculateSpeed(5000, 3600)).toBeCloseTo(5.0);
  });
});
