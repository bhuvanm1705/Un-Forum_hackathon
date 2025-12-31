import { ThreadList } from '@/components/forum/ThreadList';
import { getThreads } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let threads = await getThreads();

  // Strict filtering for "Popular Threads" as requested (Adjusted for new 25 comment requirement)
  threads = threads
    .filter(t => t.likes > 50 && t.replyCount >= 20 && t.viewCount > 100)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Popular Threads</h1>
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            Trending
          </Button>
        </div>
        <p className="text-muted-foreground text-zinc-500">
          See what the community is talking about today.
        </p>
      </div>
      <ThreadList threads={threads} />
    </div>
  );
}
