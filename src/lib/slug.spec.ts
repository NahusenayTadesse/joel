import { describe, expect, it } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
	it('makes a plain slug', () => {
		expect(slugify('Galaxy S24 Launch — Day 1!')).toBe('galaxy-s24-launch-day-1');
	});
	it('folds accents', () => {
		expect(slugify('Café Crème')).toBe('cafe-creme');
	});
	it('keeps Amharic', () => {
		expect(slugify('የቴክ ምክሮች 2026')).toBe('የቴክ-ምክሮች-2026');
	});
	it('falls back when nothing is left', () => {
		expect(slugify('!!!', 'post')).toBe('post');
	});
});
