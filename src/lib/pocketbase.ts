import PocketBase from 'pocketbase';

// Initialize the PocketBase client
export const pb = new PocketBase('https://pley.pockethost.io');

// Helper to get the current user
export const getCurrentUser = () => {
	return pb.authStore.model;
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
	return pb.authStore.isValid;
};

// Subscribe to auth state changes
pb.authStore.onChange(() => {
	// Save the auth store data to cookie on every change
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});
