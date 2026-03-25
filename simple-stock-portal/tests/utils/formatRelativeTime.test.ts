import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatRelativeTime, formatAbsoluteTime } from '../../src/utils/formatters';

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns "Just now" for less than 60 seconds ago', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(formatRelativeTime(now - 30_000)).toBe('Just now');
  });

  it('returns "Just now" for exactly 0 seconds ago', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(formatRelativeTime(now)).toBe('Just now');
  });

  it('returns "1 minute ago" for exactly 60 seconds', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(formatRelativeTime(now - 60_000)).toBe('1 minute ago');
  });

  it('returns "X minutes ago" for 2-59 minutes', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(formatRelativeTime(now - 5 * 60_000)).toBe('5 minutes ago');
    expect(formatRelativeTime(now - 59 * 60_000)).toBe('59 minutes ago');
  });

  it('returns "1 hour ago" for exactly 60 minutes', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(formatRelativeTime(now - 60 * 60_000)).toBe('1 hour ago');
  });

  it('returns "X hours ago" for 2-23 hours', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    expect(formatRelativeTime(now - 3 * 60 * 60_000)).toBe('3 hours ago');
    expect(formatRelativeTime(now - 23 * 60 * 60_000)).toBe('23 hours ago');
  });

  it('returns absolute date/time for more than 24 hours ago', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const result = formatRelativeTime(now - 25 * 60 * 60_000);
    expect(result).not.toContain('ago');
    expect(result).not.toBe('Just now');
  });

  it('returns absolute date/time string containing year for old timestamps', () => {
    const now = 1711382400000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const oldTimestamp = now - 7 * 24 * 60 * 60_000;
    const result = formatRelativeTime(oldTimestamp);
    expect(result).toMatch(/\d{4}/);
  });
});

describe('formatAbsoluteTime', () => {
  it('returns a formatted date string containing the year', () => {
    const ts = new Date('2026-03-15T10:30:00Z').getTime();
    const result = formatAbsoluteTime(ts);
    expect(result).toContain('2026');
  });

  it('includes day of week', () => {
    const ts = new Date('2026-03-15T10:30:00Z').getTime();
    const result = formatAbsoluteTime(ts);
    expect(result).toMatch(/Sun|Mon|Tue|Wed|Thu|Fri|Sat/);
  });
});
