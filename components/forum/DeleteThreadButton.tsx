'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteThreadInFirestore } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export function DeleteThreadButton({ threadId, authorId }: { threadId: string, authorId?: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // If authorId is provided, check ownership. If NOT provided, assume caller handled check (legacy/admin).
    // But for strict safety as requested:
    if (authorId && user?.uid !== authorId) return null;
    if (!user) return null;

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this thread? This action cannot be undone.")) return;

        setLoading(true);
        try {
            await deleteThreadInFirestore(threadId);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete thread");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
