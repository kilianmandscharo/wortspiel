import { Game } from "../interfaces/interfaces";

export const getWinPercentage = (games: Game[]) => {
	const wins = games.filter((game) => game.won).length;
	return Math.round((wins / games.length) * 100);
};

export const getCurrentWinStreak = (games: Game[]) => {
	let currentStreak = 0;
	let gameNumber = games.length - 1;
	while (gameNumber >= 0) {
		if (!games[gameNumber].won) {
			break;
		}
		currentStreak++;
		gameNumber--;
	}
	return currentStreak;
};

export const getHighestWinStreak = (games: Game[]) => {
	let streak = 0;
	const winStreaks: number[] = [];
	for (const game of games) {
		if (game.won) {
			streak += 1;
		} else {
			winStreaks.push(streak);
			streak = 0;
		}
	}
	winStreaks.push(streak);
	return Math.max(...winStreaks);
};