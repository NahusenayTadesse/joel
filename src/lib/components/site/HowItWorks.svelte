<script lang="ts">
	import { inView } from '$lib/attachments';
	import { m } from '$lib/paraglide/messages.js';

	const steps = $derived([
		{ title: m.how_1_title(), body: m.how_1_body() },
		{ title: m.how_2_title(), body: m.how_2_body() },
		{ title: m.how_3_title(), body: m.how_3_body() },
		{ title: m.how_4_title(), body: m.how_4_body() }
	]);
</script>

<section id="how" class="px-6 pt-8 pb-4">
	<div class="mx-auto max-w-7xl">
		<h2 class="mb-12 text-center text-3xl font-extrabold md:text-5xl">{m.how_title()}</h2>
		<ol class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each steps as step, i (i)}
				<li
					class="reveal glass relative rounded-[2rem] p-7"
					style:--delay="{i * 0.1}s"
					{@attach inView()}
				>
					<span
						class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent text-lg font-bold text-white"
						aria-hidden="true"
					>
						{i + 1}
					</span>
					<h3 class="mb-2 text-lg font-bold">{step.title}</h3>
					<p class="text-sm leading-relaxed text-foreground/70">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
