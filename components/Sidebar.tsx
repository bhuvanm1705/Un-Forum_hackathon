'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/data';
import {
    MessageCircle,
    Code2,
    Layout,
    Flame,
    Hash,
    Search,
    Settings,
    Plus,
    Film,
    Trophy,
    Laptop,
    Utensils,
    Map,
    GraduationCap,
    Car,
    TrendingUp,
    Newspaper,
    Smile
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { AuthButton } from './AuthButton';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    MessageCircle,
    Code2,
    Layout,
    Flame,
    Hash,
    Film,
    Trophy,
    Laptop,
    Utensils,
    Map,
    GraduationCap,
    Car,
    TrendingUp,
    Newspaper,
    Smile
};

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { user, loading } = useAuth();

    return (
        <div className={cn("w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 h-screen flex flex-col fixed top-0 left-0 bottom-0 z-50 overflow-y-auto simple-scroller", className)}>
            <div className="flex h-14 items-center border-b border-zinc-200 px-6 dark:border-zinc-800 shrink-0">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-50">
                    <span>Foru.ms</span>
                </Link>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 py-4 min-h-max">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <Link
                            href="/"
                            className={cn(
                                buttonVariants({ variant: pathname === '/' ? 'secondary' : 'ghost' }),
                                "w-full justify-start"
                            )}
                        >
                            <Flame className="mr-2 h-4 w-4" />
                            Popular
                        </Link>
                        <Link
                            href="/your-threads"
                            className={cn(
                                buttonVariants({ variant: pathname === '/your-threads' ? 'secondary' : 'ghost' }),
                                "w-full justify-start"
                            )}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Your Threads
                        </Link>
                        <Link
                            href="/search"
                            className={cn(
                                buttonVariants({ variant: pathname === '/search' ? 'secondary' : 'ghost' }),
                                "w-full justify-start"
                            )}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Link>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Categories
                    </h2>
                    <div className="space-y-1">
                        {CATEGORIES.map((category) => {
                            const Icon = iconMap[category.icon || 'Hash'] || Hash;
                            return (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className={cn(
                                        buttonVariants({ variant: pathname === (`/category/${category.slug}`) ? 'secondary' : 'ghost' }),
                                        "w-full justify-start"
                                    )}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {category.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Fixed New Thread Button */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                <Link href="/new-thread" className={cn(buttonVariants({ variant: 'default' }), "w-full bg-blue-600 hover:bg-blue-700 text-white")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Thread
                </Link>
            </div>

            {/* Fixed User Profile Section */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shrink-0">
                {!loading && user ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="relative h-8 w-8 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                                {user.photoURL && <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-medium truncate">{user.displayName || "User"}</span>
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <AuthButton user={user} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground text-center mb-2">Join the community</p>
                        <AuthButton user={null} />
                    </div>
                )}
            </div>
        </div>
    );
}
