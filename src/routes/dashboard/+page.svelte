<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { toast, Toaster } from 'svelte-sonner';
	import type { ToasterProps } from 'svelte-sonner';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import Icon from '@iconify/svelte';
	import type { RecordModel } from 'pocketbase';

	let { data } = $props();
	let displayName = $state(data.user?.name ?? '');
	let isUpdating = $state(false);

	interface Review extends RecordModel {
		title: string;
		body: string;
		turdCount?: number;
	}

	let reviews = $state<Review[]>(data.reviews as Review[]);

	async function handleLogout() {
		pb.authStore.clear();
		goto('/login');
	}

	async function handleUpdateProfile() {
		if (!data.user?.id) return;

		try {
			isUpdating = true;
			await pb.collection('users').update(data.user.id, {
				name: displayName
			});

			// Update the local auth store to reflect changes
			if (pb.authStore.model) {
				const authData = { ...pb.authStore.model, name: displayName };
				pb.authStore.save(pb.authStore.token, authData);
			}

			toast.success('Profile updated successfully');
		} catch (error) {
			console.error('Failed to update profile:', error);
			toast.error('Failed to update profile. Please try again.');
		} finally {
			isUpdating = false;
		}
	}

	async function handleDeleteReview(reviewId: string) {
		try {
			await pb.collection('posts').delete(reviewId);
			reviews = reviews.filter((review) => review.id !== reviewId);
			toast.success('Review deleted successfully');
		} catch (error) {
			console.error('Failed to delete review:', error);
			toast.error('Failed to delete review. Please try again.');
		}
	}
</script>

<Toaster richColors />

<div class="mx-auto max-w-2xl px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Dashboard</h1>
	</div>

	<Tabs.Root value="profile" class="w-full">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="profile">Profile</Tabs.Trigger>
			<Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="profile">
			<Card.Root>
				<Card.Header>
					<Card.Title>Profile Information</Card.Title>
					<Card.Description>Manage your account details and preferences.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="space-y-1">
						<div class="text-sm font-medium">Email Address</div>
						<div class="text-sm text-muted-foreground">{data.user?.email}</div>
					</div>
					<div class="space-y-1">
						<label for="displayName" class="text-sm font-medium">Display Name</label>
						<input
							type="text"
							id="displayName"
							class="w-full rounded-md border px-3 py-2"
							placeholder="Enter your display name"
							bind:value={displayName}
						/>
					</div>
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Button variant="outline" on:click={handleUpdateProfile} disabled={isUpdating}>
						{isUpdating ? 'Updating...' : 'Update Profile'}
					</Button>
					<Button variant="destructive" on:click={handleLogout}>Logout</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="reviews">
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between">
						<div>
							<Card.Title>Your Reviews</Card.Title>
							<Card.Description>Manage and view your customer reviews.</Card.Description>
						</div>
						<Button href="/reviews/new">
							<Icon icon="material-symbols:add" class="mr-2 h-4 w-4" />
							New Review
						</Button>
					</div>
				</Card.Header>
				<Card.Content>
					{#if reviews.length === 0}
						<p class="text-sm text-muted-foreground">
							You haven't submitted any reviews yet. Start rating customers to see them here.
						</p>
					{:else}
						<div class="space-y-4">
							{#each reviews as review}
								<div class="rounded-lg border p-4">
									<div class="mb-2 flex items-center justify-between">
										<h3 class="text-lg font-semibold">{review.title}</h3>
										<div class="flex items-center gap-2">
											<span class="text-sm text-muted-foreground">
												{new Date(review.created).toLocaleDateString()}
											</span>
											<Button
												variant="destructive"
												size="sm"
												on:click={() => handleDeleteReview(review.id)}
											>
												Delete
											</Button>
										</div>
									</div>
									<p class="text-sm text-muted-foreground">{review.body}</p>
									<div class="mt-2 flex items-center gap-1">
										<span class="text-sm font-medium">{review.turdCount || 0}</span>
										<span class="text-base">💩</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
