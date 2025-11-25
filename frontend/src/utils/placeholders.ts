function svg(body: string) {
    return `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">` +
        `<rect width="200" height="300" rx="8" fill="#374151"/>` +
        body +
        `</svg>`
    )}`;
}

export const GAME_PLACEHOLDER = svg(
    `<g transform="translate(100,130)" fill="#9ca3af">` +
        `<rect x="-40" y="-20" width="80" height="50" rx="10"/>` +
        `<circle cx="-18" cy="-2" r="5" fill="#374151"/>` +
        `<rect x="10" y="-10" width="4" height="14" rx="1" fill="#374151"/>` +
        `<rect x="5" y="-3" width="14" height="4" rx="1" fill="#374151"/>` +
        `<text x="0" y="55" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">No Image</text>` +
    `</g>`
);

export const MOVIE_PLACEHOLDER = svg(
    `<g transform="translate(100,130)" fill="#9ca3af">` +
        `<rect x="-35" y="-30" width="70" height="55" rx="4"/>` +
        `<rect x="-35" y="-30" width="70" height="12" rx="4" fill="#6b7280"/>` +
        `<rect x="-28" y="-27" width="8" height="6" rx="1" fill="#374151"/>` +
        `<rect x="-16" y="-27" width="8" height="6" rx="1" fill="#374151"/>` +
        `<rect x="-4" y="-27" width="8" height="6" rx="1" fill="#374151"/>` +
        `<rect x="8" y="-27" width="8" height="6" rx="1" fill="#374151"/>` +
        `<rect x="20" y="-27" width="8" height="6" rx="1" fill="#374151"/>` +
        `<polygon points="-5,-5 -5,12 10,3.5" fill="#374151"/>` +
        `<text x="0" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">No Image</text>` +
    `</g>`
);

export const SHOW_PLACEHOLDER = svg(
    `<g transform="translate(100,125)" fill="#9ca3af">` +
        `<path d="M-4,-38 L-22,-60 M4,-38 L22,-58" stroke="#9ca3af" stroke-width="4" stroke-linecap="round" fill="none"/>` +
        `<rect x="-46" y="-38" width="92" height="66" rx="8"/>` +
        `<rect x="-38" y="-30" width="62" height="50" rx="3" fill="#374151"/>` +
        `<circle cx="34" cy="-15" r="4" fill="#374151"/>` +
        `<circle cx="34" cy="1" r="4" fill="#374151"/>` +
        `<path d="M-16,28 L-26,42 M16,28 L26,42" stroke="#9ca3af" stroke-width="6" stroke-linecap="round" fill="none"/>` +
        `<text x="0" y="70" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">No Image</text>` +
    `</g>`
);

export const BOOK_PLACEHOLDER = svg(
    `<g transform="translate(100,130)" fill="#9ca3af">` +
        `<rect x="-32" y="-38" width="64" height="76" rx="3"/>` +
        `<rect x="-32" y="-38" width="10" height="76" rx="3" fill="#6b7280"/>` +
        `<rect x="-14" y="-22" width="36" height="4" rx="2" fill="#374151"/>` +
        `<rect x="-14" y="-12" width="36" height="4" rx="2" fill="#374151"/>` +
        `<rect x="-14" y="-2" width="24" height="4" rx="2" fill="#374151"/>` +
        `<polygon points="12,-38 12,-8 20,-18 28,-8 28,-38" fill="#374151"/>` +
        `<text x="0" y="58" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">No Image</text>` +
    `</g>`
);

export const SAUCE_PLACEHOLDER = svg(
    `<g transform="translate(100,130)" fill="#9ca3af">` +
        `<rect x="-10" y="-35" width="20" height="8" rx="2" fill="#6b7280"/>` +
        `<rect x="-15" y="-27" width="30" height="55" rx="6"/>` +
        `<rect x="-10" y="-15" width="20" height="25" rx="3" fill="#6b7280"/>` +
        `<text x="0" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6b7280">No Image</text>` +
    `</g>`
);
