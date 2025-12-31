'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';

export function AuthButton({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Make sure you enabled Google Auth in Firebase Console!");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    if (user) {
        return (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
            </Button>
        );
    }

    return (
        <Button variant="default" size="sm" onClick={handleLogin} disabled={loading} className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
    );
}
