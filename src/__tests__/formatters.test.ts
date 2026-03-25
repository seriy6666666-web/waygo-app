import { formatDuration, formatDistance, formatTime } from '../utils/formatters';

describe('formatDuration', () => {
  it('formats minutes in Russian by default', () => {
    expect(formatDuration(1500)).toBe('25 мин');
  });

  it('formats minutes in English', () => {
    expect(formatDuration(1500, 'en')).toBe('25 min');
  });

  it('formats hours+minutes in Russian', () => {
    expect(formatDuration(5400)).toBe('1ч 30м');
  });

  it('formats hours+minutes in English', () => {
    expect(formatDuration(5400, 'en')).toBe('1h 30m');
  });

  it('formats 0 seconds', () => {
    expect(formatDuration(0)).toBe('0 мин');
  });

  it('formats exactly 1 hour', () => {
    expect(formatDuration(3600)).toBe('1ч 0м');
  });
});

describe('formatDistance', () => {
  it('formats meters below 1000', () => {
    expect(formatDistance(500)).toBe('500 м');
  });

  it('formats km for distances >= 1000', () => {
    expect(formatDistance(1500)).toBe('1.5');
  });

  it('formats 0 distance', () => {
    expect(formatDistance(0)).toBe('0 м');
  });
});

describe('formatTime', () => {
  it('formats seconds-only', () => {
    expect(formatTime(45)).toBe('00:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('02:05');
  });

  it('formats with hours', () => {
    expect(formatTime(3661)).toBe('01:01:01');
  });

  it('formats zero', () => {
    expect(formatTime(0)).toBe('00:00');
  });
});
