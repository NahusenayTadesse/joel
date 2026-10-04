/**
 * Fills an empty database with the content of the original site (cba08e85.mydala.app), in English
 * and Amharic, and copies its images into the upload store.
 *
 *     npm run db:seed            # only if site_settings is empty
 *     npm run db:seed -- --reset # empties the content tables first
 *
 * Images: `seed/media/*` is copied into FILES_DIR (the kit's store, `.tempFiles` by default) under
 * the same names, so the rows point at files the kit serves like any upload.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from '../src/lib/server/db/schema';

const {
	siteSettings,
	heroHighlight,
	brand,
	socialAccount,
	sponsorshipPackage,
	bankAccount,
	audienceStat,
	testimonial,
	service
} = schema;

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const reset = process.argv.includes('--reset');
const client = mysql.createPool(process.env.DATABASE_URL);
const db = drizzle(client, { schema, mode: 'default' });

const FILES_DIR = process.env.FILES_DIR ?? '.tempFiles';
const MEDIA = path.resolve('seed/media');

function copyMedia() {
	fs.mkdirSync(FILES_DIR, { recursive: true });
	for (const name of fs.readdirSync(MEDIA)) {
		fs.copyFileSync(path.join(MEDIA, name), path.join(FILES_DIR, name));
	}
}

const brands: [name: string, file: string][] = [
	['Samsung', 'brand-samsung.webp'],
	['Bank of Abyssinia', 'brand-bank-of-abyssinia.webp'],
	['TECNO', 'brand-tecno.webp'],
	['Alibaba', 'brand-alibaba.webp'],
	['ABH', 'brand-abh.webp'],
	['M-Pesa', 'brand-mpesa.webp'],
	['Ethiopian Airlines', 'brand-ethiopian-airlines.webp'],
	['Coop Bank of Oromia', 'brand-coop-bank-oromia.webp'],
	['Infinix', 'brand-infinix.webp'],
	['Jiji', 'brand-jiji.webp']
];

const SERVICES = [
	{
		title: 'Tech content',
		titleAm: 'የቴክ ይዘት',
		description:
			'Explainers, reviews and practical tips on tech and AI, in Amharic, for YouTube, TikTok, Instagram and Telegram.',
		descriptionAm:
			'ስለ ቴክኖሎጂና AI ማብራሪያዎች፣ ግምገማዎችና ተግባራዊ ምክሮች — በአማርኛ፣ ለYouTube፣ TikTok፣ Instagram እና Telegram።',
		icon: 'clapperboard' as const,
		sortOrder: 0
	},
	{
		title: 'Brand partnerships',
		titleAm: 'የብራንድ ትብብሮች',
		description:
			'Sponsored videos and campaigns that put a product in front of young, tech-curious Ethiopians.',
		descriptionAm: 'ምርትዎን ለወጣትና ለቴክኖሎጂ ጉጉ ኢትዮጵያውያን የሚያደርሱ የስፖንሰርሺፕ ቪዲዮዎችና ዘመቻዎች።',
		icon: 'megaphone' as const,
		sortOrder: 1
	},
	{
		title: 'Digital strategy',
		titleAm: 'የዲጂታል ስትራቴጂ',
		description:
			'Taking a business online the right way: what it needs, which platforms to start on, and the content to win there.',
		descriptionAm:
			'ንግድን በትክክለኛው መንገድ ወደ ዲጂታል ማምጣት፦ የሚያስፈልገውን መለየት፣ የሚጀመርባቸውን መድረኮች መምረጥና የሚያሸንፍ ይዘት ማዘጋጀት።',
		icon: 'compass' as const,
		sortOrder: 2
	},
	{
		title: 'Web development',
		titleAm: 'የድረ-ገጽ ልማት',
		description: 'Front-end development for sites and landing pages, with the marketing built in.',
		descriptionAm: 'ለድረ-ገጾችና ለማስታወቂያ ገጾች የፊት-ገጽ ልማት — ከማርኬቲንጉ ጋር ተዋህዶ።',
		icon: 'code' as const,
		sortOrder: 3
	}
];

async function main() {
	const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
	if (existing && !reset) {
		console.log('Already seeded — site_settings has a row. Pass --reset to start over.');
		return;
	}

	copyMedia();

	await db.transaction(async (tx) => {
		if (reset) {
			// Inquiries are left alone: they are sponsors' messages, not the original site's content.
			// Work samples, testimonials and the audience breakdown start empty (the original had
			// none) and their sections stay hidden until they are filled in from the dashboard.
			for (const table of [
				service,
				testimonial,
				audienceStat,
				bankAccount,
				sponsorshipPackage,
				socialAccount,
				brand,
				heroHighlight,
				siteSettings
			]) {
				await tx.delete(table);
			}
		}

		await tx.insert(siteSettings).values({
			id: 1,
			firstName: 'Joel',
			lastName: 'Talargie',
			initials: 'JT',
			portrait: 'joel-portrait.webp',
			heroBadge: 'Leading Tech Content Creator 🇪🇹',
			heroBadgeAm: 'ቀዳሚ የቴክ ይዘት ፈጣሪ 🇪🇹',
			heroDescription:
				'One of Ethiopia’s leading tech content creators helping brands reach youth, technology lovers, and digital-first audiences.',
			heroDescriptionAm:
				'ብራንዶች ወጣቶችን፣ የቴክኖሎጂ ወዳጆችንና ዲጂታል ተጠቃሚዎችን እንዲደርሱ ከሚያግዙ የኢትዮጵያ ቀዳሚ የቴክ ይዘት ፈጣሪዎች አንዱ።',
			reachValue: '500K+',
			reachLabel: 'Total Reach',
			reachLabelAm: 'ጠቅላላ ተደራሽነት',
			audienceValue: '95%',
			audienceLabel: 'Youth Audience',
			audienceLabelAm: 'ወጣት ተመልካቾች',
			totalFollowers: '600k+',
			aboutText:
				'“Hi, I’m **Joel Talargie**, a tech content creator. My personal brand and content revolve around technology, productivity, vlogs, and exploring places. I am one of the top tech content creators in Ethiopia with active social media engagement in this category. If your target audience is __youth and tech__, you have come to the right person.”',
			aboutTextAm:
				'“ሰላም፣ እኔ **Joel Talargie** ነኝ፤ የቴክ ይዘት ፈጣሪ። የግል ብራንዴና ይዘቴ በቴክኖሎጂ፣ በምርታማነት፣ በቭሎግ እና አዳዲስ ቦታዎችን በማሰስ ላይ ያተኮሩ ናቸው። በዚህ ዘርፍ ንቁ የማህበራዊ ሚዲያ ተሳትፎ ካላቸው የኢትዮጵያ ቀዳሚ የቴክ ይዘት ፈጣሪዎች አንዱ ነኝ። ዒላማ ተመልካችዎ __ወጣቶችና ቴክኖሎጂ__ ከሆኑ፣ ትክክለኛውን ሰው አግኝተዋል።”',
			motto: '1% Growth Every Day',
			mottoAm: 'በየቀኑ 1% እድገት',
			aboutTagline: 'Digital Construct Founder • Tech Explorer • Productivity Ninja',
			aboutTaglineAm: 'የDigital Construct መስራች • የቴክ አሳሽ • የምርታማነት ባለሙያ',
			phone: '0955928986',
			phoneIntl: '+251955928986',
			email: 'ecity240@gmail.com',
			website: 'https://www.joeltalargie.com',
			location: 'Ethiopia, Addis Ababa',
			locationAm: 'ኢትዮጵያ፣ አዲስ አበባ',
			footerBlurb:
				'Helping global and local brands scale their reach in the Ethiopian market through high-impact tech content and authentic storytelling.',
			footerBlurbAm:
				'ዓለም አቀፍና የሀገር ውስጥ ብራንዶች በከፍተኛ ተፅዕኖ ፈጣሪ የቴክ ይዘትና በእውነተኛ ታሪክ አተራረክ በኢትዮጵያ ገበያ ተደራሽነታቸውን እንዲያሰፉ አግዛለሁ።',
			founderOf: 'Digital Construct',
			customTags: [
				'Product Review',
				'App Review',
				'Event Promo',
				'YouTube Only',
				'TikTok Only',
				'Brand Awareness'
			],
			customTagsAm: [
				'የምርት ግምገማ',
				'የመተግበሪያ ግምገማ',
				'የዝግጅት ማስተዋወቅ',
				'YouTube ብቻ',
				'TikTok ብቻ',
				'የብራንድ ግንዛቤ'
			],
			netPriceNote: '(Net Price before Tax)',
			netPriceNoteAm: '(ከታክስ በፊት የተጣራ ዋጋ)',
			customPrice: 'Custom Pricing',
			customPriceAm: 'በስምምነት',
			packageNotes: [
				'Custom package pricing is available upon request.',
				'Packages are valid for one month. Listed payment is net before tax.'
			],
			packageNotesAm: [
				'የልዩ ፓኬጅ ዋጋ በጥያቄ ይገለጻል።',
				'ፓኬጆቹ ለአንድ ወር ያገለግላሉ። የተዘረዘረው ክፍያ ከታክስ በፊት የተጣራ ነው።'
			],
			accountHolder: 'Eyoel Abrham Talargie',
			paymentNote:
				'Please include your company name in the transaction reference. Send a screenshot of the payment to ecity240@gmail.com to confirm your campaign booking.',
			paymentNoteAm:
				'እባክዎ በክፍያ ማጣቀሻው ላይ የድርጅትዎን ስም ያካትቱ። የዘመቻ ቦታ ማስያዣዎን ለማረጋገጥ የክፍያውን ስክሪንሾት ወደ ecity240@gmail.com ይላኩ።',
			youtubeChannelId: 'UCiRJdIGIpoQjD8Zh7cVU9NQ',
			metaTitle: 'Work with Joel Talargie | Tech Influencer Sponsorship Packages',
			metaTitleAm: 'ከJoel Talargie ጋር ይስሩ | የቴክ ኢንፍሉዌንሰር የስፖንሰርሺፕ ፓኬጆች',
			metaDescription:
				'Partner with Joel Talargie, one of Ethiopia’s leading tech content creators, for TikTok, Instagram, YouTube Shorts, Telegram, and custom sponsorship campaigns.',
			metaDescriptionAm:
				'ከኢትዮጵያ ቀዳሚ የቴክ ይዘት ፈጣሪዎች አንዱ ከሆነው Joel Talargie ጋር ለTikTok፣ Instagram፣ YouTube Shorts፣ Telegram እና ልዩ የስፖንሰርሺፕ ዘመቻዎች ይተባበሩ።'
		});

		// From joeltalargie.com: what Joel does besides his own channel.
		await tx.insert(service).values(SERVICES);

		await tx.insert(heroHighlight).values([
			{ name: 'Tech Creator', nameAm: 'የቴክ ፈጣሪ', icon: 'zap', sortOrder: 1 },
			{ name: 'Ethiopia', nameAm: 'ኢትዮጵያ', icon: 'target', sortOrder: 2 },
			{ name: 'High Engagement', nameAm: 'ከፍተኛ ተሳትፎ', icon: 'users', sortOrder: 3 },
			{ name: 'Productivity', nameAm: 'ምርታማነት', icon: 'panels-top-left', sortOrder: 4 }
		]);

		await tx
			.insert(brand)
			.values(brands.map(([name, logo], i) => ({ name, logo, sortOrder: i + 1 })));

		await tx.insert(socialAccount).values([
			{
				platform: 'tiktok',
				name: 'TikTok',
				url: 'https://www.tiktok.com/@joel_talargie',
				followers: 440_000,
				secondaryStat: '4.5M Likes',
				secondaryStatAm: '4.5M ላይኮች',
				showInStats: true,
				sortOrder: 1
			},
			{
				platform: 'youtube',
				name: 'YouTube',
				url: 'https://www.youtube.com/channel/UCiRJdIGIpoQjD8Zh7cVU9NQ',
				followers: 110_000,
				showInStats: true,
				showInFooter: true,
				sortOrder: 2,
				footerSortOrder: 2
			},
			{
				platform: 'instagram',
				name: 'Instagram',
				url: 'https://www.instagram.com/joel_talargie/',
				followers: 51_000,
				showInStats: true,
				showInFooter: true,
				sortOrder: 3,
				footerSortOrder: 1
			},
			// The original footer links these three to "#": the real handles are still to be filled in.
			{
				platform: 'twitter',
				name: 'Twitter',
				showInFooter: true,
				sortOrder: 4,
				footerSortOrder: 3
			},
			{
				platform: 'telegram',
				name: 'Telegram',
				showInFooter: true,
				sortOrder: 5,
				footerSortOrder: 4
			},
			{ platform: 'github', name: 'GitHub', showInFooter: true, sortOrder: 6, footerSortOrder: 5 }
		]);

		await tx.insert(sponsorshipPackage).values([
			{
				name: 'Base Package',
				nameAm: 'መሰረታዊ ፓኬጅ',
				price: 129_999,
				icon: 'zap',
				tone: 'primary',
				features: [
					'1 sponsored content on each platform',
					'TikTok post + Instagram Reel',
					'YouTube Short',
					'5 story posts',
					'Lifetime content ownership',
					'Video Revisions: 2'
				],
				featuresAm: [
					'በእያንዳንዱ መድረክ 1 የስፖንሰር ይዘት',
					'TikTok ፖስት + Instagram Reel',
					'YouTube Short',
					'5 የስቶሪ ፖስቶች',
					'የይዘቱ የዕድሜ ልክ ባለቤትነት',
					'የቪዲዮ ማሻሻያ፦ 2'
				],
				sortOrder: 1
			},
			{
				name: 'Starter Package',
				nameAm: 'ጀማሪ ፓኬጅ',
				price: 149_999,
				icon: 'rocket',
				tone: 'accent',
				isFeatured: true,
				badge: 'Best Seller',
				badgeAm: 'ተመራጭ',
				features: [
					'Includes Base package features',
					'1 video on each platform',
					'1 Instagram story post',
					'Telegram channel post',
					'Additional video for client post',
					'Content Ownership: Available',
					'Video Revisions: 5',
					'Strong brand placement',
					'Best for testing audience'
				],
				featuresAm: [
					'የመሰረታዊ ፓኬጁን ሁሉ ያካትታል',
					'በእያንዳንዱ መድረክ 1 ቪዲዮ',
					'1 የInstagram ስቶሪ ፖስት',
					'የTelegram ቻናል ፖስት',
					'ለደንበኛው ፖስት ተጨማሪ ቪዲዮ',
					'የይዘት ባለቤትነት፦ አለ',
					'የቪዲዮ ማሻሻያ፦ 5',
					'ጠንካራ የብራንድ አቀማመጥ',
					'ተመልካችን ለመሞከር ምርጥ'
				],
				sortOrder: 2
			},
			{
				name: 'Pro Plus Package',
				nameAm: 'ፕሮ ፕላስ ፓኬጅ',
				price: 222_999,
				icon: 'shield-check',
				tone: 'pink',
				features: [
					'2 content pieces on each platform',
					'Includes Base package features',
					'1 content pinned on TikTok/Telegram',
					'Bonus TikTok video & Photo post',
					'10 story posts',
					'Full client content ownership',
					'Event Appearance Included'
				],
				featuresAm: [
					'በእያንዳንዱ መድረክ 2 ይዘቶች',
					'የመሰረታዊ ፓኬጁን ሁሉ ያካትታል',
					'1 ይዘት በTikTok/Telegram ላይ ፒን ይደረጋል',
					'ተጨማሪ የTikTok ቪዲዮ እና የፎቶ ፖስት',
					'10 የስቶሪ ፖስቶች',
					'የይዘቱ ሙሉ ባለቤትነት ለደንበኛው',
					'በዝግጅት ላይ መገኘትን ያካትታል'
				],
				sortOrder: 3
			}
		]);

		await tx.insert(bankAccount).values([
			{
				name: 'Commercial Bank of Ethiopia (CBE)',
				nameAm: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
				accountNumber: '1000137145832',
				tone: 'blue',
				icon: 'landmark',
				sortOrder: 1
			},
			{
				name: 'Bank of Abyssinia',
				nameAm: 'አቢሲንያ ባንክ',
				accountNumber: '102462769',
				tone: 'orange',
				icon: 'landmark',
				sortOrder: 2
			},
			{
				name: 'Dashen Bank',
				nameAm: 'ዳሽን ባንክ',
				accountNumber: '5387956367011',
				tone: 'green',
				icon: 'wallet',
				sortOrder: 3
			}
		]);
	});

	console.log(`Seeded. Images copied to ${FILES_DIR}.`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(() => client.end());
