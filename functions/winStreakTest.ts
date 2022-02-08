import { Game } from "../interfaces/interfaces";
import startingDate from "../public/startingDate";
import { getCurrentWinStreak, getHighestWinStreak } from "./statFunctions";

export const winStreakTest = (
    firstBreak: number,
    secondBreak: number,
    total: number
) => {
    let games: Game[] = [];
    for (let i = 0; i < total + 2; i++) {
        const date = new Date(startingDate);
        date.setDate(date.getDate() + i);
        games.push({
            round: i + 1,
            totalGuesses: 1,
            won: true,
            word: "tests",
            date: date,
        });
    }
    games.splice(firstBreak, 1);
    games.splice(secondBreak, 1);
    games[secondBreak + 2].won = false;

    console.log(
        "days",
        games.map((game) => [game.date.getDate(), game.won])
    );
    console.log("current streak", getCurrentWinStreak(games));
    console.log("longest streak", getHighestWinStreak(games));
};
