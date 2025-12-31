'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminEnablePage() {
    const router = useRouter();
    const [status, setStatus] = useState('Checking...');

    useEffect(() => {
        const isAdmin = localStorage.getItem('forum_admin_mode');
        setStatus(isAdmin ? 'Admin Mode is CURRENTLY ACTIVE' : 'Admin Mode is DISABLED');
    }, []);

    const enableAdmin = () => {
        localStorage.setItem('forum_admin_mode', 'true');
        setStatus('Admin Mode ACTIVATED');
        setTimeout(() => router.push('/'), 1000);
    };

    const disableAdmin = () => {
        localStorage.removeItem('forum_admin_mode');
        setStatus('Admin Mode DISABLED');
        setTimeout(() => router.push('/'), 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
            <h1 className="text-2xl font-bold">Secret Admin Panel</h1>
            <p className="text-lg font-mono">{status}</p>
            <div className="flex gap-4">
                <Button onClick={enableAdmin} className="bg-green-600 hover:bg-green-700">
                    Enable Admin Mode
                </Button>
                <Button onClick={disableAdmin} variant="destructive">
                    Disable Admin Mode
                </Button>
            </div>
            <p className="text-sm text-muted-foreground max-w-md text-center">
                Clicking "Enable" will save a flag in your browser's LocalStorage.
                This will unlock the "Tools" page and "Seeding" buttons.
            </p>
        </div>
    );
}
