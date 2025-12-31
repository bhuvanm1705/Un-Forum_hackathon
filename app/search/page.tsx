'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';

export default function SearchPage() {
    const [query, setQuery] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Search Discussions</h1>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search threads, posts, or tags..."
                            className="pl-9"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        />
                    </div>
                    <Button>Search</Button>
                </div>
            </div>

            <div className="py-12 text-center text-muted-foreground">
                {query ? (
                    <p>Searching for <span className="font-semibold">"{query}"</span>...</p>
                ) : (
                    <p>Enter a keyword to start searching.</p>
                )}
            </div>
        </div>
    );
}
