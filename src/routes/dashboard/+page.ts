import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Check if user is authenticated
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	return {
		user: pb.authStore.model
	};
};
