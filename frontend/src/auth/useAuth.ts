import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { API_ORIGIN } from '../utils/BaseUrlContext';

const API = API_ORIGIN;

export function useAuth() {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
            const data = await res.json() as { username: string | null };
            return data.username ? data as { username: string } : null;
        },
        retry: false,
        staleTime: Infinity,
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
        onSuccess: (_data, variables) => queryClient.setQueryData(['auth'], { username: variables.username }),
    });

    const logout = useMutation({
        mutationFn: async () => {
            await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
        },
        onSuccess: () => queryClient.setQueryData(['auth'], null),
    });

    return { user, isLoading, login, logout };
}
