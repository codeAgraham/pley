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
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';

	type Post = {
		id: string;
		title: string;
		body: string;
		collectionId: string;
		collectionName: string;
		expand?: {
			creatorId: {
				name: string;
				avatar: string;
			};
		};
		turdCount?: number;
	};

	let topPosts: Post[] = [];

	onMount(async () => {
		try {
			console.log('Fetching posts...');
			// First get all posts with their creators expanded
			const posts = await pb.collection('posts').getList<Post>(1, 50, {
				expand: 'creatorId',
				sort: '-created'
			});

			console.log('Posts received:', posts.items);

			if (posts.items.length === 0) {
				console.log('No posts found');
				return;
			}

			// Get all turds in one request
			const allTurds = await pb.collection('turds').getFullList({
				fields: 'postId,turdcount'
			});

			// Create a map of post IDs to their total turd count
			const turdCountMap = allTurds.reduce((map: Record<string, number>, turd: any) => {
				const postId = turd.postId;
				map[postId] = (map[postId] || 0) + (turd.turdcount || 0);
				return map;
			}, {});

			// Add turd counts to posts
			const postsWithTurds = posts.items.map((post) => ({
				...post,
				turdCount: turdCountMap[post.id] || 0
			}));

			console.log('Posts with turds:', postsWithTurds);

			// Sort by turd count and take top 3
			topPosts = postsWithTurds.sort((a, b) => (b.turdCount || 0) - (a.turdCount || 0)).slice(0, 3);

			console.log('Final top posts:', topPosts);
		} catch (error) {
			console.error('Error fetching top posts:', error);
		}
	});
</script>

<!-- Hero Section -->
<section
	class="flex min-h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4 py-16"
>
	<div class="mx-auto max-w-4xl space-y-8 text-center">
		<h1
			class="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-5xl font-bold text-transparent md:text-8xl"
		>
			Pley
		</h1>
		<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
			Turn the tables on traditional review platforms. Because customers need to be rated, too.
		</p>
		<div class="mt-8 flex justify-center gap-4">
			<Button size="lg">Get Started</Button>
			<Button size="lg" variant="outline">Learn More</Button>
		</div>
	</div>
</section>

<!-- Featured Reviews Section -->
<section class="px-4 py-20">
	<div class="mx-auto max-w-6xl">
		<h2 class="mb-12 text-center text-3xl font-bold">Top Reviews 🔥💩</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each topPosts as post}
				<Card class="transition-shadow hover:shadow-lg">
					<a href="/posts/{post.id}" class="relative block">
						<div class="absolute right-4 top-4 flex items-center gap-1">
							<span class="text-sm font-medium">{post.turdCount || 0}</span>
							<span class="text-base">💩</span>
						</div>
						<CardHeader class="space-y-4">
							<div class="flex items-center gap-3">
								<Avatar>
									{#if post.expand?.creatorId?.avatar}
										<AvatarImage
											src={pb.files.getUrl(post.expand.creatorId, post.expand.creatorId.avatar)}
										/>
									{/if}
									<AvatarFallback>{post.expand?.creatorId?.name?.[0] || 'U'}</AvatarFallback>
								</Avatar>
								<CardDescription class="line-clamp-1">
									{post.expand?.creatorId?.name || 'Anonymous Business'}
								</CardDescription>
							</div>
							<CardTitle class="line-clamp-2 text-lg leading-tight">
								{post.title || 'Untitled Review'}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p class="line-clamp-3 text-sm text-muted-foreground">
								{post.body || 'No review content'}
							</p>
						</CardContent>
						<CardFooter>
							<div class="flex items-center gap-2"></div>
						</CardFooter>
					</a>
				</Card>
			{:else}
				<Card>
					<CardContent class="p-8 text-center text-muted-foreground">
						Loading top reviews...
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- How It Works Section -->
<section class="bg-secondary/20 px-4 py-20">
	<div class="mx-auto max-w-6xl">
		<h2 class="mb-12 text-center text-3xl font-bold">How It Works</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each ['Sign Up', 'Rate Customers', 'See What Others Think'] as step, i}
				<Card class="text-center">
					<CardHeader>
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							{i + 1}
						</div>
						<CardTitle>{step}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-muted-foreground">
							{#if i === 0}
								Create your business profile and join our community of honest feedback.
							{:else if i === 1}
								Share your experiences with customers and help other businesses.
							{:else}
								Discover what other businesses are saying about their customers.
							{/if}
						</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="mt-20 bg-background px-4 py-12">
	<div class="mx-auto max-w-6xl">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Pley</h3>
				<p class="text-sm text-muted-foreground">
					Empowering businesses to share their customer experiences.
				</p>
			</div>
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Legal</h3>
				<ul class="space-y-2">
					<li>
						<a href="/terms" class="text-sm text-muted-foreground hover:text-primary"
							>Terms of Service</a
						>
					</li>
					<li>
						<a href="/privacy" class="text-sm text-muted-foreground hover:text-primary"
							>Privacy Policy</a
						>
					</li>
				</ul>
			</div>
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Company</h3>
				<ul class="space-y-2">
					<li>
						<a href="/about" class="text-sm text-muted-foreground hover:text-primary">About Us</a>
					</li>
					<li>
						<a href="/contact" class="text-sm text-muted-foreground hover:text-primary">Contact</a>
					</li>
				</ul>
			</div>
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Social</h3>
				<div class="flex gap-4">
					<a href="/" class="text-muted-foreground hover:text-primary" aria-label="Twitter">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
							></path>
						</svg>
					</a>
					<a href="/" class="text-muted-foreground hover:text-primary" aria-label="Instagram">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
								clip-rule="evenodd"
							></path>
						</svg>
					</a>
					<a href="/" class="text-muted-foreground hover:text-primary" aria-label="GitHub">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
								clip-rule="evenodd"
							></path>
						</svg>
					</a>
				</div>
			</div>
		</div>
		<Separator class="my-8" />
		<p class="text-center text-sm text-muted-foreground">© 2024 Pley. All rights reserved.</p>
	</div>
</footer>
