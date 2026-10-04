<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Copy from '@lucide/svelte/icons/copy';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { Rates } from '$lib/server/rates';
	import { BANK_TONE_CLASSES, ICONS } from './icons';

	let { payment }: { payment: Rates['payment'] } = $props();

	/**
	 * The copy buttons need the clipboard, so they appear only once the browser says it has one:
	 * the server cannot know, and a button that does nothing is worse than none.
	 */
	let canCopy = $state(false);

	/** The account whose number was just copied, for the two-second "Copied". */
	let copied = $state<number | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		canCopy = Boolean(navigator.clipboard);
		return () => clearTimeout(timer);
	});

	async function copy(bank: Rates['payment']['banks'][number]) {
		try {
			// Typed with spaces for reading; a bank's app wants the digits.
			await navigator.clipboard.writeText(bank.accountNumber.replace(/\s+/g, ''));
		} catch {
			return;
		}
		copied = bank.id;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = null), 2000);
	}
</script>

<section id="payment" class="px-6 py-20">
	<!-- A `<details>`: opens without scripts, and the browser handles keyboard and screen readers. -->
	<details class="slide-open group mx-auto max-w-2xl">
		<summary
			class="glass-card flex items-start justify-between gap-4 rounded-2xl px-8 py-6 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			<span class="flex items-center gap-4 text-left">
				<span
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
				>
					<CreditCard class="h-5 w-5" />
				</span>
				<span>
					<span class="block text-xl font-bold">{m.payment_title()}</span>
					<span class="block text-sm font-medium text-foreground/65">{m.payment_subtitle()}</span>
				</span>
			</span>
			<ChevronDown
				class="pointer-events-none mt-3 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
			/>
		</summary>

		<div class="glass-card mt-4 overflow-hidden rounded-2xl text-sm">
			<div class="space-y-6 p-8">
				<div class="border-b border-foreground/5 pb-4">
					<p class="mb-1 text-sm font-bold tracking-widest text-foreground/60 uppercase">
						{m.payment_holder()}
					</p>
					<p class="text-xl font-bold text-primary">{payment.holder}</p>
				</div>
				<ul class="grid grid-cols-1 gap-6">
					{#each payment.banks as bank (bank.id)}
						{@const Icon = ICONS[bank.icon]}
						<li class="flex items-center gap-4">
							<span
								class={[
									'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
									BANK_TONE_CLASSES[bank.tone]
								]}
							>
								<Icon class="h-4 w-4" />
							</span>
							<div class="min-w-0 flex-1">
								<p class="text-xs font-bold text-foreground/60 uppercase">{bank.name}</p>
								<p class="font-mono text-lg font-bold tracking-wider break-all">
									{bank.accountNumber}
								</p>
							</div>
							{#if canCopy}
								<button
									type="button"
									onclick={() => copy(bank)}
									aria-label={m.payment_copy_label({ bank: bank.name })}
									class={[
										'flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors',
										copied === bank.id
											? 'border-green-500/30 bg-green-500/10 text-green-400'
											: 'border-foreground/10 bg-foreground/5 text-foreground/80 hover:bg-foreground/10'
									]}
								>
									{#if copied === bank.id}
										<Check class="h-4 w-4" />
										{m.payment_copied()}
									{:else}
										<Copy class="h-4 w-4" />
										{m.payment_copy()}
									{/if}
								</button>
							{/if}
						</li>
					{/each}
				</ul>
				<!-- Says "Copied" to screen readers, which cannot see the button change. -->
				<p class="sr-only" aria-live="polite">{copied === null ? '' : m.payment_copied()}</p>
				{#if payment.note}
					<div class="rounded-xl bg-foreground/5 p-4 text-xs leading-relaxed text-foreground/70">
						{payment.note}
					</div>
				{/if}
			</div>
		</div>
	</details>
</section>
