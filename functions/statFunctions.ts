import { Game } from "../interfaces/interfaces";
import { checkDatesForSameDay } from "./checkIfPlayed";

export const getWinPercentage = (games: Game[]) => {
    const wins = games.filter((game) => game.won).length;
    return Math.round((wins / games.length) * 100);
};

export const getCurrentWinStreak = (games: Game[]) => {
    let currentStreak = 0;
    let gameNumber = games.length - 1 ? games.length - 1 : 0;
    let dateOfLastGame = new Date(games[games.length - 1].date);
    while (gameNumber >= 0) {
        if (!games[gameNumber].won) {
            break;
        }
        gameNumber--;
        currentStreak++;
        if (gameNumber >= 0) {
            const dateOfCurrentGame = new Date(games[gameNumber].date);
            const temp = new Date(dateOfCurrentGame);
            dateOfCurrentGame.setDate(dateOfCurrentGame.getDate() + 1);
            if (!checkDatesForSameDay(dateOfLastGame, dateOfCurrentGame)) {
                break;
            }
            dateOfLastGame = temp;
        }
    }
    return currentStreak;
};

export const getHighestWinStreak = (games: Game[]) => {
    let streak = 0;
    const winStreaks: number[] = [];
    let dateOfGameBefore = new Date(games[0].date);
    for (const game of games) {
        const dateOfCurrentGame = new Date(game.date);
        const temp = new Date(dateOfCurrentGame);
        dateOfCurrentGame.setDate(dateOfCurrentGame.getDate() - 1);
        let dateCorrect =
            game.round > 1
                ? checkDatesForSameDay(dateOfGameBefore, dateOfCurrentGame)
                : true;
        if (game.won && dateCorrect) {
            streak += 1;
        } else {
            winStreaks.push(streak);
            streak = game.won ? 1 : 0;
        }
        dateOfGameBefore = temp;
    }
    winStreaks.push(streak);
    return Math.max(...winStreaks);
};
