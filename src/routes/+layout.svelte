<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';

	let { children, data } = $props();
	let isAuthenticated = $state(pb.authStore.isValid);
	let isDrawerOpen = $state(false);

	$effect(() => {
		// Update authentication state whenever data.isAuthenticated changes
		isAuthenticated = data.isAuthenticated || pb.authStore.isValid;
	});

	$effect(() => {
		console.log('Drawer state changed:', isDrawerOpen);
	});

	const handleDrawerButtonClick = () => {
		console.log('Drawer button clicked, current state:', isDrawerOpen);
		isDrawerOpen = !isDrawerOpen;
		console.log('Drawer state after toggle:', isDrawerOpen);
	};

	onMount(() => {
		// Subscribe to auth state changes
		pb.authStore.onChange(() => {
			isAuthenticated = pb.authStore.isValid;
			// Save auth state to cookie whenever it changes
			document.cookie = pb.authStore.exportToCookie();
		});
	});

	// Handle logout
	const handleLogout = async () => {
		pb.authStore.clear();
		document.cookie = pb.authStore.exportToCookie();
		isDrawerOpen = false;
		goto('/');
	};
</script>

<!-- Header -->
<header
	class="sticky top-0 z-50 h-16 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" href="/" class="text-lg font-semibold">pley</Button>
			{#if isAuthenticated}
				<Button variant="outline" size="sm" href="/reviews/new" class="gap-2">
					<Icon icon="material-symbols:add" class="size-4" />
					New Post
				</Button>
			{/if}
		</div>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-2 md:flex">
			{#if isAuthenticated}
				<Button variant="ghost" href="/dashboard">Dashboard</Button>
				<Button variant="ghost" on:click={handleLogout}>Log out</Button>
			{:else}
				<Button variant="ghost" href="/login">Log in</Button>
				<Button href="/signup">Sign up</Button>
			{/if}
		</div>

		<!-- Mobile Navigation -->
		<div class="md:hidden">
			<Drawer.Root bind:open={isDrawerOpen}>
				<Drawer.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="md:hidden"
						builders={[builder]}
						on:click={handleDrawerButtonClick}
					>
						<Icon icon="material-symbols:menu" width="24" height="24" />
						<span class="sr-only">Toggle menu</span>
					</Button>
				</Drawer.Trigger>
				<Drawer.Content>
					<div class="mx-auto w-full max-w-sm">
						<Drawer.Header>
							<Drawer.Title>Menu</Drawer.Title>
						</Drawer.Header>
						<div class="p-4">
							<div class="flex flex-col items-center gap-4">
								{#if isAuthenticated}
									<Button
										variant="ghost"
										href="/dashboard"
										class="w-full"
										on:click={() => (isDrawerOpen = false)}
									>
										Dashboard
									</Button>
									<Button
										variant="outline"
										href="/reviews/new"
										class="w-full gap-2"
										on:click={() => (isDrawerOpen = false)}
									>
										<Icon icon="material-symbols:add" width="16" height="16" />
										New Post
									</Button>
									<Button variant="ghost" class="w-full" on:click={handleLogout}>Log out</Button>
								{:else}
									<Button
										variant="ghost"
										href="/login"
										class="w-full"
										on:click={() => (isDrawerOpen = false)}
									>
										Log in
									</Button>
									<Button href="/signup" class="w-full" on:click={() => (isDrawerOpen = false)}>
										Sign up
									</Button>
								{/if}
							</div>
						</div>
						<Drawer.Footer>
							<Drawer.Close asChild let:builder>
								<Button variant="outline" builders={[builder]}>Close</Button>
							</Drawer.Close>
						</Drawer.Footer>
					</div>
				</Drawer.Content>
			</Drawer.Root>
		</div>
	</div>
</header>

<main>
	{@render children()}
</main>
