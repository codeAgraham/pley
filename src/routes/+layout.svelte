<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { pb } from '$lib/pocketbase';

	let { children, data } = $props();

	// Handle logout
	const handleLogout = async () => {
		pb.authStore.clear();
		window.location.href = '/';
	};
</script>

<!-- Header -->
<header
	class="sticky top-0 z-50 h-10 w-full border-b border-border/40 bg-background/95 pt-6 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="mx-auto flex h-full max-w-6xl items-center justify-between">
		<Button variant="ghost" href="/" class="font-semibold">Home</Button>
		<div class="flex items-center gap-2">
			{#if data.isAuthenticated}
				<Button variant="ghost" href="/dashboard">Dashboard</Button>
				<Button variant="ghost" on:click={handleLogout}>Log out</Button>
			{:else}
				<Button variant="ghost" href="/login">Log in</Button>
				<Button href="/signup">Sign up</Button>
			{/if}
		</div>
	</div>
</header>

<main class="pt-[60px]">
	{@render children()}
</main>
