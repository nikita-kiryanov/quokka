import type { Game } from "../types/computer-games";
import { API_ORIGIN } from "../utils/BaseUrlContext";
import { GAME_PLACEHOLDER } from "../utils/placeholders";
import useCacheBuster from "../utils/useCacheBuster";

type PosterProps = React.ImgHTMLAttributes<HTMLImageElement> & { game: Game };

export default function Poster({game, ...props}: PosterProps) {
    const [thumbnailVersion] = useCacheBuster();
    return (
        <img src={`${API_ORIGIN}/thumbnails/games/${game.game_id}.webp?v=${thumbnailVersion}`}
             alt={game.game} loading="lazy" {...props}
             onError={(e) => { e.currentTarget.src = GAME_PLACEHOLDER; }} />
    );
}
