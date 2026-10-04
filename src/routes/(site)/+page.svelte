<script lang="ts">
	import About from '$lib/components/site/About.svelte';
	import Brands from '$lib/components/site/Brands.svelte';
	import Contact from '$lib/components/site/Contact.svelte';
	import Followers from '$lib/components/site/Followers.svelte';
	import Hero from '$lib/components/site/Hero.svelte';
	import PostCard from '$lib/components/site/PostCard.svelte';
	import ProjectCard from '$lib/components/site/ProjectCard.svelte';
	import SectionHead from '$lib/components/site/SectionHead.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import Services from '$lib/components/site/Services.svelte';
	import Testimonials from '$lib/components/site/Testimonials.svelte';
	import VideoCard from '$lib/components/site/VideoCard.svelte';
	import { inView } from '$lib/attachments';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';

	let { data, form } = $props();
	const site = $derived(data.site);

	/** Tells search engines who the site is about and which profiles are the same person. */
	const person = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.person.fullName,
		description: site.meta.description,
		image: site.person.portrait ? `/media/${site.person.portrait}` : undefined,
		email: site.contact.email,
		telephone: site.contact.phoneIntl,
		jobTitle: site.hero.badge,
		sameAs: [
			...new Set(
				[...site.followers.accounts, ...site.footer.socials]
					.map((account) => account.url)
					.filter((url): url is string => !!url)
			)
		]
	});
</script>

<Seo
	title={site.meta.title}
	description={site.meta.description}
	path="/"
	image={site.person.portrait}
	type="profile"
	siteName={site.person.fullName}
	jsonLd={person}
/>

<Hero person={site.person} hero={site.hero} />
<Brands brands={site.brands} />
<Followers followers={site.followers} />
<About about={site.about} firstName={site.person.firstName} />

{#if site.services.length}
	<Services services={site.services} />
{/if}

{#if data.projects.length}
	<section id="projects" class="px-6 py-24">
		<div class="mx-auto max-w-7xl">
			<SectionHead
				title={m.projects_title()}
				subtitle={m.projects_subtitle()}
				link={{ href: to('/projects'), label: m.projects_all() }}
			/>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.projects as project, i (project.id)}
					<div class="reveal" style:--delay="{i * 0.08}s" {@attach inView()}>
						<ProjectCard {project} />
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if data.headline}
	<section id="videos" class="px-6 py-24">
		<div class="mx-auto max-w-7xl">
			<SectionHead
				title={m.videos_title()}
				subtitle={m.videos_subtitle()}
				link={{ href: to('/videos'), label: m.videos_all() }}
			/>
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
				<div class="reveal" {@attach inView()}>
					<VideoCard video={data.headline} large />
				</div>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
					{#each data.videos.slice(0, 2) as video, i (video.videoId)}
						<div class="reveal" style:--delay="{(i + 1) * 0.08}s" {@attach inView()}>
							<VideoCard {video} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}

{#if site.testimonials.length}
	<Testimonials testimonials={site.testimonials} />
{/if}

{#if data.posts.length}
	<section id="blog" class="px-6 py-24">
		<div class="mx-auto max-w-7xl">
			<SectionHead
				title={m.blog_title()}
				subtitle={m.blog_subtitle()}
				link={{ href: to('/blog'), label: m.blog_all() }}
			/>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.posts as post, i (post.id)}
					<div class="reveal" style:--delay="{i * 0.08}s" {@attach inView()}>
						<PostCard {post} />
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<Contact firstName={site.person.firstName} contact={site.contact} packages={[]} {form} />
