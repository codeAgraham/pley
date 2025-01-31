<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let { data } = $props();

	async function handleLogout() {
		pb.authStore.clear();
		goto('/login');
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Dashboard</h1>
		<Button variant="outline" on:click={handleLogout}>Sign out</Button>
	</div>

	<div class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
		<h2 class="mb-4 text-xl font-semibold">Welcome, {data.user?.email || 'User'}!</h2>
		<p class="text-muted-foreground">
			This is your dashboard. You can start rating customers and managing your reviews here.
		</p>
	</div>
</div>
