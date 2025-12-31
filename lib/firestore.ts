import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, orderBy, Timestamp, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { Thread, Post, User } from './types';

// Helper to convert Firestore dates to ISO strings
const convertDates = (data: any, id: string) => ({
    ...data,
    id: id,
    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
});

export async function createPostInFirestore(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const docRef = await addDoc(collection(db, 'posts'), {
            ...post,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });

        // Increment replyCount on the thread
        const threadRef = doc(db, 'threads', post.threadId);
        await updateDoc(threadRef, {
            replyCount: increment(1)
        });

        return docRef.id;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export async function incrementThreadLikes(threadId: string) {
    try {
        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing likes:", error);
    }
}

export async function incrementThreadViews(threadId: string) {
    try {
        const threadRef = doc(db, 'threads', threadId);
        await updateDoc(threadRef, {
            viewCount: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing views:", error);
    }
}

export async function seedPopularThreadsInFirestore() {
    try {
        const popularThreadsData = [
            { catId: 'c1', slug: 'films', name: 'Films & Cinema', title: 'Salaar Part 2: Shouryaanga Parvam Predictions', content: 'Will Deva and Varadha actually fight? The politics in Khansaar are getting intense.' },
            { catId: 'c2', slug: 'cricket', name: 'Cricket', title: 'IPL 2025: Mega Auction Analysis', content: 'Which team has the strongest squad this year? discussing potential captains and openers.' },
            { catId: 'c3', slug: 'tech', name: 'Tech & Startups', title: 'Bangalore vs Hyderabad: Best city for Devs?', content: 'Comparing package, traffic, rent, and overall lifestyle for software engineers.' },
            { catId: 'c4', slug: 'food', name: 'Food & Dining', title: 'The Ultimate Hyderabad Biryani List', content: 'Paradise is overrated. Here are the actual best spots for authentic Biryani in 2024.' },
            { catId: 'c5', slug: 'travel', name: 'Travel India', title: 'Hidden Gem: Unexplored valleys of Himachal', content: 'Just came back from a 7-day solo trip. Here is my itinerary and budget breakdown.' },
            { catId: 'c6', slug: 'education', name: 'Education & Career', title: 'Is CS Engineering still worth it in age of AI?', content: 'With potential layoffs and AI coding tools, should I switch to Electronics or stick to CS?' },
            { catId: 'c7', slug: 'auto', name: 'Automobiles', title: 'Mahindra Thar Roxx vs Jimny', content: 'Need advice for a daily driver that can handle weekend off-roading. Budget 15L.' },
            { catId: 'c8', slug: 'finance', name: 'Finance & Investing', title: 'Nifty 50 Prediction for next Quarter', content: 'Market is at an all time high. Is it time to book profits or keep SIPs running?' },
            { catId: 'c9', slug: 'politics', name: 'Politics & News', title: 'Global Elections 2024: Impact on India', content: 'Discussing foreign policy changes and economic impact.' },
            { catId: 'c10', slug: 'memes', name: 'Memes & Humor', title: 'Average Corporate Employee Life (Meme Thread)', content: 'Post your best relatable work memes here.' }
        ];

        const timestamp = Timestamp.now();

        for (let i = 0; i < popularThreadsData.length; i++) {
            const t = popularThreadsData[i];
            const threadRef = await addDoc(collection(db, 'threads'), {
                title: t.title,
                content: t.content,
                authorId: 'anonymous_user',
                author: {
                    id: 'anonymous_user',
                    name: 'Anonymous User',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 50}`,
                },
                categoryId: t.catId,
                category: { id: t.catId, name: t.name, slug: t.slug },
                likes: 155 + i * 2,
                replyCount: 25, // Requested EXACTLY 25 comments
                viewCount: 250 + i * 10,
                createdAt: timestamp,
                updatedAt: timestamp,
                tags: ['popular', 'trending']
            });

            // Create 25 dummy posts for each thread so comments aren't empty
            const dummyContents = [
                "Totally agree! This is exactly what I was thinking.",
                "I have a different perspective on this. Have you considered...",
                "Thanks for sharing this info, really helpful!",
                "Great analysis, waiting for the next update.",
                "I'm not sure about this point, can you elaborate?",
                "This is the content I signed up for.",
                "Interesting take on the current situation.",
                "Does anyone else feel the same way?",
            ];

            // Generate 25 comments
            for (let j = 0; j < 25; j++) {
                const postContent = dummyContents[j % dummyContents.length];
                await addDoc(collection(db, 'posts'), {
                    threadId: threadRef.id,
                    content: postContent,
                    authorId: 'dummy_commenter',
                    author: {
                        id: 'dummy_commenter',
                        name: `User ${j + 1}`,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=comment${i}_${j}`,
                        role: 'user'
                    },
                    likes: Math.floor(Math.random() * 50),
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
            }
        }

        console.log("Seeded 10 diverse popular threads with 25 comments each!");
        return true;
    } catch (error) {
        console.error("Error seeding threads:", error);
        return false;
    }
}

export async function getThreadsFromFirestore(): Promise<Thread[]> {
    try {
        const q = query(collection(db, 'threads'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => convertDates(d.data(), d.id) as Thread);
    } catch (error) {
        console.error("Error fetching threads:", error);
        return [];
    }
}

export async function createThreadInFirestore(thread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const docRef = await addDoc(collection(db, 'threads'), {
            ...thread,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            replyCount: 0,
            viewCount: 0,
            likes: 0,
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating thread:", error);
        throw error;
    }
}

export async function deleteThreadInFirestore(threadId: string) {
    try {
        await deleteDoc(doc(db, 'threads', threadId));
        // Note: In a real app, you'd also delete associated posts recursively
    } catch (error) {
        console.error("Error deleting thread:", error);
        throw error;
    }
}

export async function getThreadsByAuthorFromFirestore(authorId: string): Promise<Thread[]> {
    try {
        // Note: You might need a composite index for this query (authorId ASC, createdAt DESC)
        // If it fails, check console for the indexing link
        const q = query(
            collection(db, 'threads'),
            where('authorId', '==', authorId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => convertDates(d.data(), d.id) as Thread);
    } catch (error) {
        console.error("Error fetching user threads:", error);
        return [];
    }
}

export async function getThreadByIdFromFirestore(id: string): Promise<Thread | null> {
    try {
        const docRef = doc(db, 'threads', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return convertDates(docSnap.data(), docSnap.id) as Thread;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting thread:", error);
        return null;
    }
}

export async function getPostsByThreadIdFromFirestore(threadId: string): Promise<Post[]> {
    try {
        const q = query(
            collection(db, 'posts'),
            where('threadId', '==', threadId)
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(d => convertDates(d.data(), d.id) as Post);
        // Sort by createdAt ASC (oldest first) in memory to avoid Firestore Composite Index requirements
        return posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        // Return a dummy post with the error message to debug on client
        return [{
            id: 'error-post',
            threadId: threadId,
            content: `DEBUG ERROR: Failed to load posts. ${error.message || error}`,
            authorId: 'system',
            author: { id: 'system', name: 'System', avatar: '', role: 'admin', joinedAt: new Date().toISOString() },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0
        }];
    }
}

export async function deleteAllDataInFirestore() {
    try {
        const threadsSnap = await getDocs(collection(db, 'threads'));
        const postsSnap = await getDocs(collection(db, 'posts'));

        const batch = db.batch && typeof db.batch === 'function' ? db.batch() : null; // Check if batch is available or use deleteDoc loop

        // Simple loop delete for safety if batch is tricky with types
        const deletePromises = [
            ...threadsSnap.docs.map(d => deleteDoc(d.ref)),
            ...postsSnap.docs.map(d => deleteDoc(d.ref))
        ];

        await Promise.all(deletePromises);
        console.log("All data deleted!");
        return true;
    } catch (error) {
        console.error("Error deleting all data:", error);
        return false;
    }
}
