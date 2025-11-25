import { useState, type FormEvent } from 'react';
import { useAuth } from './useAuth';

export default function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login.mutate({ username, password }, {
            onError: (err) => setError(err.message),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-900">
            <form className="w-full max-w-sm rounded-lg border border-neutral-700 bg-neutral-800 p-8 shadow-lg"  onSubmit={handleSubmit}>
                {error && (
                    <p className="mb-4 rounded bg-red-900/50 px-3 py-2 text-sm text-red-300">
                        {error}
                    </p>
                )}
                <img src="/logo.png" alt="Quokka logo" className="mb-2" />

                <label className="mb-1 block text-sm text-neutral-400">Username</label>
                <input className="mb-4 w-full rounded border border-neutral-600 bg-neutral-700 px-3 py-2 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                       type="text" value={username} onChange={e => setUsername(e.target.value)}
                       autoCapitalize="none" />

                <label className="mb-1 block text-sm text-neutral-400">Password</label>
                <input className="mb-6 w-full rounded border border-neutral-600 bg-neutral-700 px-3 py-2 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                       type="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50" type="submit" disabled={login.isPending}>
                    {login.isPending ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </div>
    );
}
