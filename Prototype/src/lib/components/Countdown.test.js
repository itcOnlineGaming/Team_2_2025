import { describe, it, expect } from 'vitest';
import { formatTime, tick } from '$lib/countdownLogic.js';

describe('Countdown logic', () => {
  it('formats seconds correctly', () => {
    expect(formatTime(1500)).toBe('25:00');
    expect(formatTime(61)).toBe('1:01');
  });

  it('ticks down correctly', () => {
    expect(tick(10)).toBe(9);
    expect(tick(1)).toBe(0);
    expect(tick(0)).toBe(0);
  });
});




