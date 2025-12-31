import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}

export function useAdmin() {
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // We do NOT return early on loading, because we want to check LocalStorage immediately.
        // The email check will just be false temporarily until loading finishes, which is fine.


        // 1. Check primary email
        const primaryEmail = user?.email?.toLowerCase();

        // 2. Check provider data (e.g. Google Sign In often hides email here)
        const providerEmail = user?.providerData?.[0]?.email?.toLowerCase();

        // 3. Local Storage Override (Secret Key)
        const isLocalAdmin = typeof window !== 'undefined' && localStorage.getItem('forum_admin_mode') === 'true';

        const isEmailMatch = primaryEmail === 'bhuvanamd17@gmail.com' || providerEmail === 'bhuvanamd17@gmail.com';

        setIsAdmin(!!isEmailMatch || isLocalAdmin);
    }, [user, loading]);

    return { isAdmin, loading };
}
