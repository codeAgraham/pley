import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';
import type { RecordModel } from 'pocketbase';

interface TurdRecord extends RecordModel {
	postId: string;
	turdcount: number;
}

export const load: PageLoad = async () => {
	// Check if user is authenticated
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	// Fetch user's reviews
	const reviews = await pb.collection('posts').getList(1, 10, {
		filter: `creatorId = "${pb.authStore.model?.id}"`,
		sort: '-created',
		expand: 'creatorId'
	});

	// Get all turds for these posts
	const allTurds = await pb.collection('turds').getFullList<TurdRecord>({
		filter: reviews.items.map((post) => `postId = "${post.id}"`).join(' || '),
		fields: 'postId,turdcount'
	});

	// Create a map of post IDs to their total turd count
	const turdCountMap = allTurds.reduce((map: Record<string, number>, turd: TurdRecord) => {
		const postId = turd.postId;
		map[postId] = (map[postId] || 0) + (turd.turdcount || 0);
		return map;
	}, {});

	// Add turd counts to reviews
	const reviewsWithTurds = reviews.items.map((review) => ({
		...review,
		turdCount: turdCountMap[review.id] || 0
	}));

	return {
		user: pb.authStore.model,
		reviews: reviewsWithTurds
	};
};
