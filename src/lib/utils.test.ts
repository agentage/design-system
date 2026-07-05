import { describe, it, expect } from 'vitest';
import { cn } from './utils.js';

describe('cn', () => {
  it('returns a single class unchanged', () => {
    expect(cn('px-4')).toBe('px-4');
  });

  it('joins multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('skips falsy values', () => {
    expect(cn('px-4', false && 'hidden', null, undefined)).toBe('px-4');
  });

  it('includes truthy conditional classes', () => {
    expect(cn('px-4', true && 'block')).toBe('px-4 block');
  });

  it('supports object syntax', () => {
    expect(cn({ 'px-4': true, 'py-2': false })).toBe('px-4');
  });

  it('resolves tailwind conflicts, last wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('flattens nested arrays', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
  });
});
