export async function findPosters(query) {
    async function sgdbFetch(path) {
        const res = await fetch(`https://www.steamgriddb.com/api/v2${path}`, {
            headers: { Authorization: `Bearer ${process.env.VITE_SGDB_API_KEY}` },
        });
        if (!res.ok)
            throw new Error(`SteamGridDB error: ${res.status}`);

        const json = await res.json();
        return json.data;
    }
    const games = await sgdbFetch(`/search/autocomplete/${encodeURIComponent(query)}`);
    const game = games[0];
    return await sgdbFetch(`/grids/game/${game.id}`);
}