declare module 'svelte-sonner' {
	import type { SvelteComponent } from 'svelte';

	export class Toaster extends SvelteComponent<{
		richColors?: boolean;
		expand?: boolean;
		closeButton?: boolean;
		offset?: string | number;
		position?:
			| 'top-left'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-right'
			| 'top-center'
			| 'bottom-center';
	}> {}

	export const toast: {
		success: (message: string, options?: object) => void;
		error: (message: string, options?: object) => void;
		loading: (message: string, options?: object) => void;
		dismiss: () => void;
	};

	export type ToasterProps = InstanceType<typeof Toaster>['$$prop_def'];
}
