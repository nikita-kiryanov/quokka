export async function findPosters(query) {
    const yearMatch = query.match(/^(.*?)\s*\((\d{4})\)$/);
    const name = yearMatch ? yearMatch[1] : query;
    const year = yearMatch ? yearMatch[2] : null;
    const params = new URLSearchParams({ query: name, include_adult: 'true', language: 'en-US' });
    if (year)
        params.set('first_air_date_year', year);

    const path = `/search/tv?${params}`;
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/${path}`, {
        headers: {
            Authorization: `Bearer ${process.env.VITE_TMDB_API_KEY}`,
            Accept: 'application/json'
        },
    });

    if (!tmdbRes.ok)
        throw new Error(`The Movie DataBase error: ${tmdbRes.status}`);

    const data = await tmdbRes.json();
    const posters = data.results
        .filter((result) => result.poster_path)
        .map((result) => ({ url: `https://image.tmdb.org/t/p/w500/${result.poster_path}` }));

    return posters;
}