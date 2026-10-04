import { describe, expect, it } from 'vitest';
import { compactCount, formatPhone, formatPrice, highlightSegments } from './format';

describe('compactCount', () => {
	it('rounds down to thousands and millions', () => {
		expect(compactCount(440_000)).toEqual({ value: 440, suffix: 'k', decimals: 0 });
		expect(compactCount(51_900)).toEqual({ value: 51, suffix: 'k', decimals: 0 });
		expect(compactCount(4_560_000)).toEqual({ value: 4.5, suffix: 'M', decimals: 1 });
		expect(compactCount(2_000_000)).toEqual({ value: 2, suffix: 'M', decimals: 0 });
		expect(compactCount(950)).toEqual({ value: 950, suffix: '', decimals: 0 });
	});
});

describe('formatPrice / formatPhone', () => {
	it('formats birr and Ethiopian numbers', () => {
		expect(formatPrice(129_999)).toBe('129,999');
		expect(formatPhone('+251955928986')).toBe('+251 955 928 986');
		expect(formatPhone('0955928986')).toBe('0955928986');
	});
});

describe('highlightSegments', () => {
	it('splits on both markers', () => {
		expect(highlightSegments('Hi, I’m **Joel**, for __youth__.')).toEqual([
			{ text: 'Hi, I’m ' },
			{ text: 'Joel', tone: 'primary' },
			{ text: ', for ' },
			{ text: 'youth', tone: 'accent' },
			{ text: '.' }
		]);
	});
});
