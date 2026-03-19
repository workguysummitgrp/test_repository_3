import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatChange,
  formatVolume,
  formatLargeNumber,
  formatDate,
  formatShortDate,
} from '../../src/utils/formatters';

describe('formatCurrency', () => {
  it('formats positive value', () => {
    expect(formatCurrency(150.5)).toBe('$150.50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative value', () => {
    expect(formatCurrency(-42.1)).toBe('-$42.10');
  });

  it('formats large value', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});

describe('formatPercent', () => {
  it('positive value has + sign', () => {
    expect(formatPercent(2.5)).toBe('+2.50%');
  });

  it('negative value has - sign', () => {
    expect(formatPercent(-1.5)).toBe('-1.50%');
  });

  it('zero shows +0.00%', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

describe('formatChange', () => {
  it('positive with + sign', () => {
    expect(formatChange(3.14)).toBe('+3.14');
  });

  it('negative without + sign', () => {
    expect(formatChange(-2.1)).toBe('-2.10');
  });

  it('zero shows +0.00', () => {
    expect(formatChange(0)).toBe('+0.00');
  });
});

describe('formatVolume', () => {
  it('formats billions', () => {
    expect(formatVolume(2_300_000_000)).toBe('2.30B');
  });

  it('formats millions', () => {
    expect(formatVolume(5_500_000)).toBe('5.50M');
  });

  it('formats thousands', () => {
    expect(formatVolume(1_500)).toBe('1.5K');
  });

  it('formats small numbers as-is', () => {
    expect(formatVolume(999)).toBe('999');
  });

  it('formats exactly one million', () => {
    expect(formatVolume(1_000_000)).toBe('1.00M');
  });
});

describe('formatLargeNumber', () => {
  it('formats trillions', () => {
    expect(formatLargeNumber(1_500_000_000_000)).toBe('$1.50T');
  });

  it('formats billions', () => {
    expect(formatLargeNumber(2_500_000_000)).toBe('$2.50B');
  });

  it('formats millions', () => {
    expect(formatLargeNumber(750_000_000)).toBe('$750.00M');
  });

  it('formats small values as currency', () => {
    expect(formatLargeNumber(999)).toBe('$999.00');
  });
});

describe('formatDate', () => {
  it('formats full date', () => {
    const result = formatDate('2026-03-15');
    expect(result).toBe('Mar 15, 2026');
  });
});

describe('formatShortDate', () => {
  it('formats short date', () => {
    const result = formatShortDate('2026-03-15');
    expect(result).toBe('Mar 15');
  });
});
