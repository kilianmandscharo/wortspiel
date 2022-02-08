import { Game } from "../interfaces/interfaces";

export const getGamesFromStorage = () => {
    const keys = getSortedStorageKeys();
    const games: Game[] = keys.map((key) => JSON.parse(localStorage[key]));
    return games;
};

export const getSortedStorageKeys = () => {
    return Object.keys(localStorage)
        .filter((key) => Number.isInteger(parseInt(key)))
        .sort((a: string, b: string) => parseInt(a) - parseInt(b));
};

export const getGameNumber = () => {
	const keys = getSortedStorageKeys();
	return !keys.length ? 1 : parseInt(keys[keys.length - 1]) + 1;
}

