import type { Attachment } from 'svelte/attachments';

/**
 * Adds `is-visible` the first time the element scrolls into view, then stops watching — the
 * `reveal` class in layout.css does the rest. `onEnter` runs at the same moment.
 */
export function inView(onEnter?: () => void): Attachment<HTMLElement> {
	return (node) => {
		const observer = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			node.classList.add('is-visible');
			onEnter?.();
			observer.disconnect();
		});
		observer.observe(node);
		return () => observer.disconnect();
	};
}
