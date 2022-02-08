import { Game } from "../interfaces/interfaces";

const checkIfAlreadyPlayedToday = (games: Game[]) => {
    const lastGamePlayed = games[games.length - 1];
    const dateOfLastGame = new Date(lastGamePlayed.date);
    const today = new Date();
    return checkDatesForSameDay(today, dateOfLastGame);
};

 export const checkDatesForSameDay = (date1: Date, date2: Date) => {
    const d1 = getDayMonthYearFromDate(date1);
    const d2 = getDayMonthYearFromDate(date2);
    return d1.day === d2.day && d1.month === d2.month && d1.year === d2.year
        ? true
        : false;
};

const getDayMonthYearFromDate = (date: Date) => {
    const d = date.toDateString().split(" ");
    return {
        day: d[2],
        month: d[1],
        year: d[3],
    };
};

export default checkIfAlreadyPlayedToday;