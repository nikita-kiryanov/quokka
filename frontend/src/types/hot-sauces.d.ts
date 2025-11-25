export interface SauceData {
    [key: string]: Sauce[];
}

export interface EnrichedSauceData {
    [key: string]: BrandEntry;
}

export interface BrandEntry {
    sauces: Sauce[];
    anchorId?: string;
}

export interface BrandProps {
    name: string;
    sauces: Sauce[];
    onPepper: (pepper: string) => void;
}

export type SauceRowProps =
    | { headerOnly: true }
    | { sauce: Sauce, headerOnly?: false, onPepper: (pepper: string) => void };

export interface Sauce {
    sauce_id: number;
    brand: string;
    sauce: string;
    peppers: string[];
    comments: string;
    rating: string;
};
