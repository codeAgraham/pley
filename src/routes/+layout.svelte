<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="min-h-screen bg-background">
	<header class="border-b">
		<div class="container flex h-16 items-center px-4">
			<a href="/" class="mr-6 text-2xl font-bold text-primary">Pley</a>

			<nav class="flex gap-6">
				<a href="/" class="text-sm font-medium hover:text-primary">Home</a>
				<a href="/businesses" class="text-sm font-medium hover:text-primary">Businesses</a>
				<a href="/about" class="text-sm font-medium hover:text-primary">About</a>
			</nav>

			<div class="ml-auto flex items-center space-x-4">
				<Button variant="outline">Sign In</Button>
				<Button>Sign Up</Button>
			</div>
		</div>
	</header>

	<main>
		<slot />
	</main>
</div>
