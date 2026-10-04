import type { Component } from 'svelte';
import Github from '@lucide/svelte/icons/github';
import Instagram from '@lucide/svelte/icons/instagram';
import Landmark from '@lucide/svelte/icons/landmark';
import PanelsTopLeft from '@lucide/svelte/icons/panels-top-left';
import Rocket from '@lucide/svelte/icons/rocket';
import Send from '@lucide/svelte/icons/send';
import ShieldCheck from '@lucide/svelte/icons/shield-check';
import Sparkles from '@lucide/svelte/icons/sparkles';
import Target from '@lucide/svelte/icons/target';
import Twitter from '@lucide/svelte/icons/twitter';
import Users from '@lucide/svelte/icons/users';
import Wallet from '@lucide/svelte/icons/wallet';
import Youtube from '@lucide/svelte/icons/youtube';
import Zap from '@lucide/svelte/icons/zap';
import Clapperboard from '@lucide/svelte/icons/clapperboard';
import Code from '@lucide/svelte/icons/code';
import Compass from '@lucide/svelte/icons/compass';
import GraduationCap from '@lucide/svelte/icons/graduation-cap';
import Megaphone from '@lucide/svelte/icons/megaphone';
import Mic from '@lucide/svelte/icons/mic';
import Facebook from '@lucide/svelte/icons/facebook';
import Linkedin from '@lucide/svelte/icons/linkedin';
import Music2 from '@lucide/svelte/icons/music-2';
import type {
	BANK_ICONS,
	BANK_TONES,
	HIGHLIGHT_ICONS,
	PACKAGE_ICONS,
	PACKAGE_TONES,
	SERVICE_ICONS,
	SOCIAL_PLATFORMS
} from '$lib/content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Icon = Component<any>;

/** Every icon a row may name, by the value stored in its `icon` column. */
export const ICONS: Record<
	(typeof HIGHLIGHT_ICONS)[number] | (typeof PACKAGE_ICONS)[number] | (typeof BANK_ICONS)[number],
	Icon
> = {
	zap: Zap,
	target: Target,
	users: Users,
	'panels-top-left': PanelsTopLeft,
	sparkles: Sparkles,
	rocket: Rocket,
	'shield-check': ShieldCheck,
	landmark: Landmark,
	wallet: Wallet
};

type Platform = (typeof SOCIAL_PLATFORMS)[number];

/** Each platform's outline icon, and the colour the footer's round icon turns on hover. */
export const PLATFORM_ICONS: Record<Platform, { icon: Icon; hover: string }> = {
	instagram: { icon: Instagram, hover: 'hover:text-pink-500' },
	youtube: { icon: Youtube, hover: 'hover:text-red-500' },
	twitter: { icon: Twitter, hover: 'hover:text-blue-400' },
	telegram: { icon: Send, hover: 'hover:text-blue-500' },
	github: { icon: Github, hover: 'hover:text-foreground' },
	tiktok: { icon: Music2, hover: 'hover:text-cyan-400' },
	facebook: { icon: Facebook, hover: 'hover:text-blue-500' },
	linkedin: { icon: Linkedin, hover: 'hover:text-blue-400' }
};

/** Brand colour of each platform, for the follower cards. */
export const PLATFORM_COLORS: Record<Platform, string> = {
	tiktok: '#00f2ff',
	youtube: '#ff0000',
	instagram: '#e1306c',
	twitter: '#1da1f2',
	telegram: '#229ed9',
	github: '#ffffff',
	facebook: '#1877f2',
	linkedin: '#0a66c2'
};

/** Package card colours. Tailwind needs the full class names written out to generate them. */
export const PACKAGE_TONE_TEXT: Record<(typeof PACKAGE_TONES)[number], string> = {
	primary: 'text-primary',
	accent: 'text-accent',
	pink: 'text-sky-500'
};

export const BANK_TONE_CLASSES: Record<(typeof BANK_TONES)[number], string> = {
	blue: 'bg-blue-500/10 text-blue-500',
	orange: 'bg-orange-500/10 text-orange-500',
	green: 'bg-green-500/10 text-green-500',
	purple: 'bg-purple-500/10 text-purple-500'
};

/** The "What I do" cards' icons, by the value stored in `service.icon`. */
export const SERVICE_ICON_MAP: Record<(typeof SERVICE_ICONS)[number], Icon> = {
	clapperboard: Clapperboard,
	megaphone: Megaphone,
	compass: Compass,
	code: Code,
	'graduation-cap': GraduationCap,
	mic: Mic,
	sparkles: Sparkles
};
