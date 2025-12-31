import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Thread, Post, User } from './types';

// Helper to convert Firestore dates to ISO strings
const convertDates = (data: any, id: string) => ({
    ...data,
    id: id,
    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
});

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
