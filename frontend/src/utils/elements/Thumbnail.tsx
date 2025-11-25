import { useState } from "react";
import useCacheBuster from "../useCacheBuster";

export default function Thumbnail({src, alt, fallback}: {src: string, alt: string, fallback?: string}) {
    const [thumbnailVersion] = useCacheBuster();
    const [failed, setFailed] = useState(false);

    const imgSrc = (failed && fallback) ? fallback : `${src}?v=${thumbnailVersion}`;

    return <img src={imgSrc} alt={alt} loading="lazy" onError={() => setFailed(true)} className="max-h-64 object-contain" />;
}
