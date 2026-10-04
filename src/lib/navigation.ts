import Award from '@lucide/svelte/icons/award';
import ChartBar from '@lucide/svelte/icons/chart-bar';
import Clapperboard from '@lucide/svelte/icons/clapperboard';
import FolderKanban from '@lucide/svelte/icons/folder-kanban';
import Inbox from '@lucide/svelte/icons/inbox';
import Landmark from '@lucide/svelte/icons/landmark';
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Link from '@lucide/svelte/icons/link';
import MessageSquareQuote from '@lucide/svelte/icons/message-square-quote';
import Newspaper from '@lucide/svelte/icons/newspaper';
import Package from '@lucide/svelte/icons/package';
import Settings from '@lucide/svelte/icons/settings';
import Share2 from '@lucide/svelte/icons/share-2';
import Sparkles from '@lucide/svelte/icons/sparkles';
import Wrench from '@lucide/svelte/icons/wrench';
import type { NavItem } from '@nahu/admin-kit/navigation';

/**
 * The sidebar and the search palette. Each entry is shown only if `access` lets the viewer in.
 * `section` groups them into the cards on the dashboard's home page.
 */
export const NAVIGATION: NavItem[] = [
	{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
	{ title: 'Projects', url: '/dashboard/projects', icon: FolderKanban, section: 'Portfolio' },
	{ title: 'Blog posts', url: '/dashboard/posts', icon: Newspaper, section: 'Portfolio' },
	{ title: 'Videos', url: '/dashboard/videos', icon: Clapperboard, section: 'Portfolio' },
	{ title: 'Inquiries', url: '/dashboard/inquiries', icon: Inbox, section: 'Sponsorship' },
	{ title: 'Rate links', url: '/dashboard/rates', icon: Link, section: 'Sponsorship' },
	{ title: 'Packages', url: '/dashboard/packages', icon: Package, section: 'Sponsorship' },
	{ title: 'Bank accounts', url: '/dashboard/banks', icon: Landmark, section: 'Sponsorship' },
	{ title: 'Site settings', url: '/dashboard/settings', icon: Settings, section: 'Page' },
	{ title: 'Hero highlights', url: '/dashboard/highlights', icon: Sparkles, section: 'Page' },
	{ title: 'Brands', url: '/dashboard/brands', icon: Award, section: 'Page' },
	{ title: 'Social accounts', url: '/dashboard/socials', icon: Share2, section: 'Page' },
	{ title: 'Audience', url: '/dashboard/audience', icon: ChartBar, section: 'Page' },
	{ title: 'Services', url: '/dashboard/services', icon: Wrench, section: 'Page' },
	{
		title: 'Testimonials',
		url: '/dashboard/testimonials',
		icon: MessageSquareQuote,
		section: 'Page'
	}
];

/** Where each kind of record's page lives, so table cells can link to it: `{ employee: '/dashboard/employees' }`. */
export const ENTITIES: Record<string, string> = {};
