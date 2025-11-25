export async function findPosters(query) {
    const yearMatch = query.match(/^(.*?)\s*\((\d{4})\)$/);
    const name = yearMatch ? yearMatch[1] : query;
    const year = yearMatch ? yearMatch[2] : null;
    const params = new URLSearchParams({ title: name, fields: 'cover_i' });
    if (year)
        params.set('first_publish_year', year);

    const url = `https://openlibrary.org/search.json?${params}`;
    const fetchOptions = {
        headers: { 'User-Agent': 'Quokka (personal media tracker)' },
        signal: AbortSignal.timeout(8000)
    };

    let olRes;
    try {
        olRes = await fetch(url, fetchOptions);
    } catch (err) {
        olRes = await fetch(url, fetchOptions);
    }
    if (!olRes.ok)
        throw new Error(`Open Library error: ${olRes.status}`);

    const data = await olRes.json();
    const covers = (data.docs || [])
        .filter((doc) => doc.cover_i)
        .map((doc) => ({ url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` }));

    return covers;
}