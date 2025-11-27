import { Clerk } from '@clerk/clerk-js';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

// Initialize Clerk instance
export const clerk = new Clerk(CLERK_PUBLISHABLE_KEY);

// Load Clerk and ensure it's ready
export const initializeClerk = async () => {
  await clerk.load();
  return clerk;
};
