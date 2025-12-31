import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getThreads } from '@/lib/data';
import { Thread } from '@/lib/types';
import { ThreadList } from '@/components/forum/ThreadList';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [allThreads, setAllThreads] = useState<Thread[]>([]);
    const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchThreads() {
            setLoading(true);
            try {
                const threads = await getThreads();
                setAllThreads(threads);
            } catch (error) {
                console.error("Failed to fetch threads for search", error);
            } finally {
                setLoading(false);
            }
        }
        fetchThreads();
    }, []);

    // Filter threads whenever query or allThreads changes
    useEffect(() => {
        if (!query.trim()) {
            setFilteredThreads([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = allThreads.filter(thread =>
            thread.title.toLowerCase().includes(lowerQuery) ||
            thread.content.toLowerCase().includes(lowerQuery) ||
            thread.category.name.toLowerCase().includes(lowerQuery)
        );
        setFilteredThreads(results);
    }, [query, allThreads]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Search Discussions</h1>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Type to search threads (e.g., 'Prabhas', 'IPL', 'React')..."
                            className="pl-9"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            <div className="py-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : query ? (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Found {filteredThreads.length} result{filteredThreads.length !== 1 ? 's' : ''} for "{query}"
                        </p>
                        {filteredThreads.length > 0 ? (
                            <ThreadList threads={filteredThreads} />
                        ) : (
                            <div className="text-center py-12 text-muted-foreground border border-dashed border-zinc-200 rounded-lg">
                                No discussions found matching your search.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Start typing to search across {allThreads.length} discussions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
