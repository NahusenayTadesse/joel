import { describe, expect, it } from 'vitest';
import { htmlToText, readingMinutes, sanitizeRichHtml, summarize } from './sanitize';

describe('sanitizeRichHtml', () => {
	it('keeps what the editor makes', () => {
		const html = '<h2>Title</h2><p><strong>Bold</strong> and <a href="/blog">a link</a></p>';
		expect(sanitizeRichHtml(html)).toBe(html);
	});

	it('removes scripts, handlers and javascript: links', () => {
		const out = sanitizeRichHtml(
			'<p onclick="x()">Hi<script>alert(1)</script> <a href="javascript:alert(1)">x</a></p>'
		);
		expect(out).not.toMatch(/script|onclick|javascript/i);
		expect(out).toContain('Hi');
	});

	it('keeps an uploaded image and drops a hot-linked one', () => {
		expect(sanitizeRichHtml('<p>a</p><img src="/media/abc.webp" alt="">')).toContain(
			'src="/media/abc.webp"'
		);
		expect(sanitizeRichHtml('<p>a</p><img src="https://evil.test/x.png">')).toBe('<p>a</p>');
	});

	it('opens outside links in a new tab without handing over the page', () => {
		expect(sanitizeRichHtml('<p><a href="https://x.test">x</a></p>')).toContain(
			'rel="noopener noreferrer nofollow"'
		);
	});

	it('saves an empty editor as nothing', () => {
		expect(sanitizeRichHtml('<p></p>')).toBe('');
		expect(sanitizeRichHtml('<p> <br></p>')).toBe('');
	});
});

describe('text helpers', () => {
	it('reads blocks as separate words', () => {
		expect(htmlToText('<p>one</p><p>two &amp; three</p>')).toBe('one two & three');
	});
	it('counts reading time', () => {
		expect(readingMinutes('word '.repeat(660).trim())).toBe(3);
		expect(readingMinutes('')).toBe(1);
	});
	it('cuts an excerpt at a word', () => {
		expect(summarize('alpha beta gamma delta', 14)).toBe('alpha beta…');
	});
});
