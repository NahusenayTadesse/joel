import { describe, expect, it, vi } from 'vitest';

// The module reads the database and the environment at import; the parser needs neither.
vi.mock('$lib/server/db', () => ({ db: {} }));
vi.mock('$env/dynamic/private', () => ({ env: {} }));

const { parseFeed } = await import('./youtube');

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
 <title>Joel Talargie</title>
 <entry>
  <yt:videoId>E6s-kQUT2Oo</yt:videoId>
  <title>AI &amp; you: what&#39;s next?</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=E6s-kQUT2Oo"/>
  <published>2026-09-27T16:00:01+00:00</published>
  <media:group>
   <media:description>Line one
Line two</media:description>
   <media:community><media:statistics views="2514"/></media:community>
  </media:group>
 </entry>
 <entry>
  <yt:videoId>KS7fcWRRruM</yt:videoId>
  <title>በምድር ላይ</title>
  <link rel="alternate" href="https://www.youtube.com/shorts/KS7fcWRRruM"/>
  <published>2026-09-22T10:00:00+00:00</published>
  <media:group><media:description></media:description></media:group>
 </entry>
 <entry><title>broken, no id</title></entry>
</feed>`;

describe('parseFeed', () => {
	it('reads each video, decoding entities and spotting Shorts', () => {
		expect(parseFeed(FEED)).toEqual([
			{
				videoId: 'E6s-kQUT2Oo',
				title: "AI & you: what's next?",
				description: 'Line one\nLine two',
				publishedAt: new Date('2026-09-27T16:00:01Z'),
				views: 2514,
				isShort: false
			},
			{
				videoId: 'KS7fcWRRruM',
				title: 'በምድር ላይ',
				description: null,
				publishedAt: new Date('2026-09-22T10:00:00Z'),
				views: null,
				isShort: true
			}
		]);
	});
});
