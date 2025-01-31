import { pb } from '$lib/pocketbase';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	// Try to restore auth state from cookie
	try {
		// Load the auth store data from cookies
		pb.authStore.loadFromCookie(document.cookie);
		return {
			user: pb.authStore.model,
			isAuthenticated: pb.authStore.isValid
		};
	} catch {
		return {
			user: null,
			isAuthenticated: false
		};
	}
};
