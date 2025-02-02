<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let title = '';
	let body = '';
	let isSubmitting = false;
	let errors = { title: '', body: '', form: '' };

	function validateForm() {
		errors = { title: '', body: '', form: '' };
		let isValid = true;

		if (!title.trim()) {
			errors.title = 'Title is required';
			isValid = false;
		}

		if (!body.trim()) {
			errors.body = 'Review content is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		isSubmitting = true;
		errors.form = '';

		try {
			await pb.collection('posts').create({
				title,
				body,
				creatorId: pb.authStore.model?.id
			});

			toast.success('Review created successfully');
			goto('/dashboard');
		} catch (error) {
			console.error('Failed to create review:', error);
			errors.form = 'Failed to create review. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl px-4 py-8">
	<Card>
		<CardHeader>
			<CardTitle>Create New Review</CardTitle>
			<CardDescription>Share your experience with a customer.</CardDescription>
		</CardHeader>
		<CardContent>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				{#if errors.form}
					<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
						{errors.form}
					</div>
				{/if}
				<div class="space-y-2">
					<label for="title" class="text-sm font-medium">Title</label>
					<input
						type="text"
						id="title"
						bind:value={title}
						class="w-full rounded-md border px-3 py-2"
						placeholder="Enter a title for your review"
					/>
					{#if errors.title}
						<p class="text-sm text-destructive">{errors.title}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<label for="body" class="text-sm font-medium">Review Content</label>
					<textarea
						id="body"
						bind:value={body}
						class="h-32 w-full rounded-md border px-3 py-2"
						placeholder="Write your review here..."
					></textarea>
					{#if errors.body}
						<p class="text-sm text-destructive">{errors.body}</p>
					{/if}
				</div>
			</form>
		</CardContent>
		<CardFooter class="flex justify-between">
			<Button variant="outline" on:click={() => goto('/dashboard')}>Cancel</Button>
			<Button on:click={handleSubmit} disabled={isSubmitting}>
				{isSubmitting ? 'Creating...' : 'Create Review'}
			</Button>
		</CardFooter>
	</Card>
</div>
