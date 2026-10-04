<script lang="ts">
	import { page } from '$app/state';
	import Notice from '@nahu/admin-kit/components/Notice.svelte';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';

	/** Inside the dashboard's shell, so the sidebar stays and the way back is one click. */
</script>

<div class="flex flex-col gap-6">
	<PageHeader title={page.status === 404 ? 'Page not found' : 'Something went wrong'} />
	<Notice tone={page.status === 404 ? 'warning' : 'danger'} title="Error {page.status}">
		{page.error?.message ?? 'The page could not be shown.'}
	</Notice>
</div>
