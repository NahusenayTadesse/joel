<script lang="ts">
	import FileText from '@lucide/svelte/icons/file-text';
	import FolderKanban from '@lucide/svelte/icons/folder-kanban';
	import HandCoins from '@lucide/svelte/icons/hand-coins';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import StatCard from '@nahu/admin-kit/components/reports/StatCard.svelte';
	import AdminCard from '@nahu/admin-kit/components/shell/AdminCard.svelte';
	import { NAVIGATION } from '$lib/navigation';

	let { data } = $props();

	const cards = [
		{
			title: 'Portfolio',
			description: 'The work, the writing and the videos.',
			icon: FolderKanban,
			section: 'Portfolio'
		},
		{
			title: 'The page',
			description: 'What visitors read: the words, the photo, the logos and the numbers.',
			icon: FileText,
			section: 'Page'
		},
		{
			title: 'Sponsorship',
			description: 'Who asked, the private rate links, what sponsors buy and where they pay.',
			icon: HandCoins,
			section: 'Sponsorship'
		}
	];
</script>

<div class="flex flex-col gap-6">
	<PageHeader title="Dashboard" description="Everything on the site is edited here." />

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each data.stats as stat (stat.key)}
			<StatCard {stat} amharicMoney={false} />
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		{#each cards as card (card.section)}
			<AdminCard
				title={card.title}
				description={card.description}
				icon={card.icon}
				items={NAVIGATION.filter((item) => item.section === card.section)}
			/>
		{/each}
	</div>
</div>
