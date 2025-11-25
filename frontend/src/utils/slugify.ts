/** Turns a label like "Release Date" into an id/name like "release-date". */
export default function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-');
}
