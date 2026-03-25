import { getDayOfWeekRu, formatDateRu, generateId, getWeekRange } from '../utils/date';

describe('getDayOfWeekRu', () => {
  it('returns "понедельник" for Monday', () => {
    // 2024-01-01 is Monday
    expect(getDayOfWeekRu(new Date(2024, 0, 1))).toBe('понедельник');
  });

  it('returns "воскресенье" for Sunday', () => {
    expect(getDayOfWeekRu(new Date(2024, 0, 7))).toBe('воскресенье');
  });
});

describe('formatDateRu', () => {
  it('formats January date correctly', () => {
    expect(formatDateRu(new Date(2024, 0, 15))).toBe('15 января');
  });

  it('formats December date correctly', () => {
    expect(formatDateRu(new Date(2024, 11, 31))).toBe('31 декабря');
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('getWeekRange', () => {
  it('returns an object with start and end keys', () => {
    const range = getWeekRange();
    expect(range).toHaveProperty('start');
    expect(range).toHaveProperty('end');
  });

  it('returns ISO date strings', () => {
    const range = getWeekRange();
    expect(range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('end is 6 days after start', () => {
    const range = getWeekRange();
    const start = new Date(range.start);
    const end = new Date(range.end);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    expect(diff).toBe(6);
  });
});
