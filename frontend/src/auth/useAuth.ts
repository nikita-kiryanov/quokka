import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { API_ORIGIN } from '../utils/BaseUrlContext';

const API = API_ORIGIN;
const AUTH_STORAGE_KEY = 'auth:lastKnownUser';

type AuthUser = { username: string };

function readPersistedUser(): AuthUser | undefined {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) as AuthUser : undefined;
    } catch {
        return undefined;
    }
}

function persistUser(user: AuthUser | null) {
    if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
}

export function useAuth() {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
            if (!res.ok) {
                throw new Error('Failed to check auth status');
            }
            const data = await res.json() as { username: string | null };
            const user = data.username ? { username: data.username } : null;
            persistUser(user);
            return user;
        },
        // Seeds from the last confirmed login so a failed offline re-check
        // (e.g. no network) falls back to "still logged in" instead of
        // being indistinguishable from a confirmed logout.
        initialData: readPersistedUser,
        retry: false,
    });

    const login = useMutation({
        mutationFn: async (creds: { username: string; password: string }) => {
            const res = await fetch(`${API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(creds),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || 'Login failed');
            }
            return res.json();
        },
        onSuccess: (_data, variables) => {
            persistUser({ username: variables.username });
            queryClient.setQueryData(['auth'], { username: variables.username });
        },
    });

    const logout = useMutation({
        mutationFn: async () => {
            await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
        },
        onSuccess: () => {
            persistUser(null);
            queryClient.setQueryData(['auth'], null);
        },
    });

    return { user, isLoading, login, logout };
}
