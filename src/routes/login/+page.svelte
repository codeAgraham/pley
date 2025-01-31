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

	let email = '';
	let password = '';
	let errors = { email: '', password: '', form: '' };
	let isLoading = false;

	function validateForm() {
		errors = { email: '', password: '', form: '' };
		let isValid = true;

		if (!email) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Please enter a valid email address';
			isValid = false;
		}

		if (!password) {
			errors.password = 'Password is required';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		isLoading = true;
		errors.form = '';

		try {
			await pb.collection('users').authWithPassword(email, password);

			// After successful login, redirect to dashboard
			goto('/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			errors.form = 'Invalid email or password';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-8">
	<Card class="w-full max-w-md">
		<CardHeader class="space-y-1">
			<CardTitle class="text-center text-2xl font-bold">Sign in to Pley</CardTitle>
			<CardDescription class="text-center">Rate your customers—responsibly</CardDescription>
		</CardHeader>
		<CardContent>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				{#if errors.form}
					<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
						{errors.form}
					</div>
				{/if}
				<div class="space-y-2">
					<div class="text-sm font-medium leading-none">Email</div>
					<input
						type="email"
						placeholder="name@example.com"
						bind:value={email}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						class:border-destructive={errors.email}
						disabled={isLoading}
					/>
					{#if errors.email}
						<p class="text-sm text-destructive">{errors.email}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<div class="text-sm font-medium leading-none">Password</div>
					<input
						type="password"
						bind:value={password}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						class:border-destructive={errors.password}
						disabled={isLoading}
					/>
					{#if errors.password}
						<p class="text-sm text-destructive">{errors.password}</p>
					{/if}
				</div>
				<div class="text-right text-sm">
					<a href="/forgot-password" class="text-primary hover:text-primary/90 hover:underline">
						Forgot password?
					</a>
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						Signing in...
					{:else}
						Sign in
					{/if}
				</Button>
			</form>
		</CardContent>
		<CardFooter>
			<p class="w-full text-center text-sm text-muted-foreground">
				Don't have an account?
				<a href="/signup" class="ml-1 text-primary hover:text-primary/90 hover:underline">
					Sign up
				</a>
			</p>
		</CardFooter>
	</Card>
</div>
