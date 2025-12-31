import { ThreadList } from '@/components/forum/ThreadList';
import { getThreads } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default async function Home() {
  const threads = await getThreads();

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
