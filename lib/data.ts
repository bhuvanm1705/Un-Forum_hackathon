import { Category, Post, Thread, User } from './types';

// --- Mock Users ---
export const USERS: Record<string, User> = {
    u1: {
        id: 'u1',
        name: 'Alex Rivera',
        avatar: 'https://i.pravatar.cc/150?u=u1',
        role: 'moderator',
        joinedAt: '2023-01-15T10:00:00Z',
    },
    u2: {
        id: 'u2',
        name: 'Jordan Lee',
        avatar: 'https://i.pravatar.cc/150?u=u2',
        role: 'user',
        joinedAt: '2023-03-20T14:30:00Z',
    },
    u3: {
        id: 'u3',
        name: 'Casey Smith',
        avatar: 'https://i.pravatar.cc/150?u=u3',
        role: 'user',
        joinedAt: '2023-06-10T09:15:00Z',
    },
};

// --- Mock Categories ---
export const CATEGORIES: Category[] = [
    {
        id: 'c1',
        name: 'Films & Cinema',
        slug: 'films',
        description: 'Discussions about Tollywood, Bollywood, and Pan-Indian movies. Prabhas, Rajamouli, and more!',
        icon: 'Film',
        threadCount: 150
    },
    {
        id: 'c2',
        name: 'Cricket',
        slug: 'cricket',
        description: 'IPL, Team India, and match discussions.',
        icon: 'Trophy',
        threadCount: 342
    },
    {
        id: 'c3',
        name: 'Tech & Startups',
        slug: 'tech',
        description: 'Bangalore/Hyderabad startup scene, coding, and jobs.',
        icon: 'Laptop',
        threadCount: 89
    },
    {
        id: 'c4',
        name: 'Food & Dining',
        slug: 'food',
        description: 'Best Biryani spots, street food, and recipes.',
        icon: 'Utensils',
        threadCount: 56
    },
    {
        id: 'c5',
        name: 'Travel India',
        slug: 'travel',
        description: 'Trip planning to Goa, Kerala, Ladakh, and hidden gems.',
        icon: 'Map',
        threadCount: 78
    },
    {
        id: 'c6',
        name: 'Education & Career',
        slug: 'education',
        description: 'JEE, NEET, Engineering, and career advice.',
        icon: 'GraduationCap',
        threadCount: 120
    },
    {
        id: 'c7',
        name: 'Automobiles',
        slug: 'auto',
        description: 'Cars, bikes, traffic tips, and new launches.',
        icon: 'Car',
        threadCount: 45
    },
    {
        id: 'c8',
        name: 'Finance & Investing',
        slug: 'finance',
        description: 'Stock market (Nifty/Sensex), SIPs, and personal finance.',
        icon: 'TrendingUp',
        threadCount: 67
    },
    {
        id: 'c9',
        name: 'Politics & News',
        slug: 'politics',
        description: 'Latest updates and healthy debates.',
        icon: 'Newspaper',
        threadCount: 200
    },
    {
        id: 'c10',
        name: 'Memes & Humor',
        slug: 'memes',
        description: 'Desi memes and lighthearted fun.',
        icon: 'Smile',
        threadCount: 999
    }
];

// --- Mock Threads ---
export const THREADS: Thread[] = [
    {
        id: 't1',
        title: 'Welcome to the new community!',
        content: 'We are excited to launch this new platform. Feel free to introduce yourselves below.',
        authorId: 'u1',
        author: USERS.u1,
        categoryId: 'c1',
        category: CATEGORIES[0],
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
        replyCount: 5,
        viewCount: 1250,
        likes: 45,
        isPinned: true,
        tags: ['announcement', 'welcome'],
    },
    {
        id: 't2',
        title: 'Best practices for React Server Components?',
        content: 'I have been experimenting with RSC and wanted to know how you verify data fetching patterns...',
        authorId: 'u2',
        author: USERS.u2,
        categoryId: 'c2',
        category: CATEGORIES[1],
        createdAt: '2024-01-02T15:45:00Z',
        updatedAt: '2024-01-03T09:20:00Z',
        replyCount: 12,
        viewCount: 890,
        likes: 23,
        tags: ['react', 'nextjs', 'rsc'],
    },
    {
        id: 't3',
        title: 'My Project: AI-powered ToDo App',
        content: 'Just finished the v1 of my app. It uses OpenAI to prioritize tasks...',
        authorId: 'u3',
        author: USERS.u3,
        categoryId: 'c3',
        category: CATEGORIES[2],
        createdAt: '2024-01-04T11:30:00Z',
        updatedAt: '2024-01-04T11:30:00Z',
        replyCount: 8,
        viewCount: 450,
        likes: 67,
        tags: ['showcase', 'ai', 'project'],
    },
];

// --- Mock Posts ---
export const POSTS: Post[] = [
    {
        id: 'p1',
        threadId: 't2',
        content: 'I usually treat them like async functions in my components. It simplifies things a lot.',
        authorId: 'u1',
        author: USERS.u1,
        createdAt: '2024-01-02T16:00:00Z',
        likes: 5,
    },
    {
        id: 'p2',
        threadId: 't2',
        content: 'Same here, but caching can be tricky. Make sure to use `unstable_cache` effectively.',
        authorId: 'u3',
        author: USERS.u3,
        createdAt: '2024-01-02T16:30:00Z',
        likes: 8,
    },
];

// --- Simulation Helpers ---
import { getThreadsFromFirestore, getThreadByIdFromFirestore, getPostsByThreadIdFromFirestore, deleteThreadInFirestore, getThreadsByAuthorFromFirestore } from './firestore';

// Toggle this to true to use Firebase (requires .env configuration)
const USE_FIREBASE = true;

export async function getThreads() {
    if (USE_FIREBASE) {
        return await getThreadsFromFirestore();
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate latency
    return THREADS;
}

export async function getThreadById(id: string) {
    if (USE_FIREBASE) {
        return await getThreadByIdFromFirestore(id);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return THREADS.find((t) => t.id === id) || null;
}

export async function getPostsByThreadId(threadId: string) {
    if (USE_FIREBASE) {
        return await getPostsByThreadIdFromFirestore(threadId);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return POSTS.filter((p) => p.threadId === threadId);
}

export async function deleteThread(threadId: string) {
    if (USE_FIREBASE) {
        return await deleteThreadInFirestore(threadId);
    }
    // Mock deletion not implemented
}

export async function getThreadsByAuthor(authorId: string) {
    if (USE_FIREBASE) {
        return await getThreadsByAuthorFromFirestore(authorId);
    }
    return THREADS.filter(t => t.authorId === authorId);
}

export async function seedPopularThreads() {
    if (USE_FIREBASE) {
        const { seedPopularThreadsInFirestore } = await import('./firestore');
        return await seedPopularThreadsInFirestore();
    }
    return false;
}
