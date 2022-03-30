import { Game } from "../interfaces/interfaces";
import startingDate from "../public/startingDate";
import {
    currentWinStreak,
    getCurrentWinStreak,
    getHighestWinStreak,
    hightestWinStreak,
} from "./statFunctions";

const data = {
    1: '{"round":1,"totalGuesses":4,"won":true,"word":"LUDER","date":"2022-02-14T16:00:51.435Z","wortspielNumber":2}',
    2: '{"round":2,"totalGuesses":6,"won":true,"word":"VOTUM","date":"2022-02-15T15:04:14.184Z","wortspielNumber":3}',
    3: '{"round":3,"totalGuesses":5,"won":true,"word":"HALMA","date":"2022-02-15T23:59:35.594Z","wortspielNumber":4}',
    4: '{"round":4,"totalGuesses":2,"won":true,"word":"FEUER","date":"2022-02-17T00:19:50.337Z","wortspielNumber":5}',
    5: '{"round":5,"totalGuesses":4,"won":true,"word":"LATEX","date":"2022-02-17T23:03:44.010Z","wortspielNumber":6}',
    6: '{"round":6,"totalGuesses":3,"won":true,"word":"BELAG","date":"2022-02-19T00:00:14.367Z","wortspielNumber":7}',
    7: '{"round":7,"totalGuesses":2,"won":true,"word":"KOHLE","date":"2022-02-19T23:06:15.185Z","wortspielNumber":8}',
    8: '{"round":8,"totalGuesses":4,"won":true,"word":"LANZE","date":"2022-02-20T23:53:49.651Z","wortspielNumber":9}',
    9: '{"round":9,"totalGuesses":4,"won":true,"word":"RADIO","date":"2022-02-21T23:35:46.198Z","wortspielNumber":10}',
    10: '{"round":10,"totalGuesses":4,"won":true,"word":"ZANGE","date":"2022-02-22T23:37:10.525Z","wortspielNumber":11}',
    11: '{"round":11,"totalGuesses":3,"won":true,"word":"KUPPE","date":"2022-02-23T23:07:02.726Z","wortspielNumber":12}',
    12: '{"round":12,"totalGuesses":3,"won":true,"word":"PUDEL","date":"2022-02-24T23:10:18.700Z","wortspielNumber":13}',
    13: '{"round":13,"totalGuesses":5,"won":true,"word":"RATTE","date":"2022-02-25T23:10:23.063Z","wortspielNumber":14}',
    14: '{"round":14,"totalGuesses":3,"won":true,"word":"BUTAN","date":"2022-02-26T23:02:32.763Z","wortspielNumber":15}',
    15: '{"round":15,"totalGuesses":4,"won":true,"word":"LAKEN","date":"2022-02-27T23:42:59.909Z","wortspielNumber":16}',
    16: '{"round":16,"totalGuesses":5,"won":true,"word":"IKONE","date":"2022-02-28T23:21:47.836Z","wortspielNumber":17}',
    17: '{"round":17,"totalGuesses":2,"won":true,"word":"MOBIL","date":"2022-03-01T23:48:44.746Z","wortspielNumber":18}',
    18: '{"round":18,"totalGuesses":4,"won":true,"word":"MODEM","date":"2022-03-02T23:48:13.584Z","wortspielNumber":19}',
    19: '{"round":19,"totalGuesses":4,"won":true,"word":"MIENE","date":"2022-03-03T23:28:10.743Z","wortspielNumber":20}',
    20: '{"round":20,"totalGuesses":6,"won":true,"word":"SÜLZE","date":"2022-03-05T10:12:07.669Z","wortspielNumber":21}',
    21: '{"round":21,"totalGuesses":4,"won":true,"word":"LOTUS","date":"2022-03-06T09:18:43.401Z","wortspielNumber":22}',
    22: '{"round":22,"totalGuesses":6,"won":true,"word":"ARIER","date":"2022-03-06T23:42:21.559Z","wortspielNumber":23}',
    23: '{"round":23,"totalGuesses":3,"won":true,"word":"CELLO","date":"2022-03-07T23:02:59.391Z","wortspielNumber":24}',
    24: '{"round":24,"totalGuesses":4,"won":true,"word":"MILBE","date":"2022-03-09T09:29:51.464Z","wortspielNumber":25}',
    25: '{"round":25,"totalGuesses":4,"won":true,"word":"JAPAN","date":"2022-03-09T23:41:41.350Z","wortspielNumber":26}',
    26: '{"round":26,"totalGuesses":3,"won":true,"word":"CHLOR","date":"2022-03-10T23:04:20.061Z","wortspielNumber":27}',
    27: '{"round":27,"totalGuesses":2,"won":true,"word":"LEPRA","date":"2022-03-11T23:06:00.717Z","wortspielNumber":28}',
    28: '{"round":28,"totalGuesses":3,"won":true,"word":"PROFI","date":"2022-03-12T23:01:53.868Z","wortspielNumber":29}',
    29: '{"round":29,"totalGuesses":4,"won":true,"word":"DIPOL","date":"2022-03-13T23:19:28.081Z","wortspielNumber":30}',
    30: '{"round":30,"totalGuesses":4,"won":true,"word":"WALÖL","date":"2022-03-14T23:46:56.972Z","wortspielNumber":31}',
    31: '{"round":31,"totalGuesses":4,"won":true,"word":"DÜRRE","date":"2022-03-15T23:32:45.110Z","wortspielNumber":32}',
    32: '{"round":32,"totalGuesses":3,"won":true,"word":"FIGUR","date":"2022-03-16T23:07:41.549Z","wortspielNumber":33}',
    33: '{"round":33,"totalGuesses":4,"won":true,"word":"HÜTTE","date":"2022-03-17T23:08:29.774Z","wortspielNumber":34}',
    34: '{"round":34,"totalGuesses":3,"won":true,"word":"TRAFO","date":"2022-03-18T23:07:58.762Z","wortspielNumber":35}',
    35: '{"round":35,"totalGuesses":4,"won":true,"word":"ÄRGER","date":"2022-03-20T00:10:37.437Z","wortspielNumber":36}',
    36: '{"round":36,"totalGuesses":3,"won":true,"word":"KORAN","date":"2022-03-20T23:32:23.340Z","wortspielNumber":37}',
    37: '{"round":37,"totalGuesses":7,"won":false,"word":"SESAM","date":"2022-03-21T23:18:53.297Z","wortspielNumber":38}',
    38: '{"round":38,"totalGuesses":4,"won":true,"word":"SALSA","date":"2022-03-22T23:48:06.875Z","wortspielNumber":39}',
    39: '{"round":39,"totalGuesses":3,"won":true,"word":"WACHS","date":"2022-03-23T23:04:00.543Z","wortspielNumber":40}',
    40: '{"round":40,"totalGuesses":2,"won":true,"word":"HARFE","date":"2022-03-24T23:22:44.138Z","wortspielNumber":41}',
    41: '{"round":41,"totalGuesses":4,"won":true,"word":"LESBE","date":"2022-03-26T16:02:47.090Z","wortspielNumber":42}',
    42: '{"round":42,"totalGuesses":5,"won":true,"word":"BÜGEL","date":"2022-03-26T23:57:33.687Z","wortspielNumber":43}',
    43: '{"round":43,"totalGuesses":6,"won":true,"word":"BÜGEL","date":"2022-03-27T22:27:13.857Z","wortspielNumber":44}',
};

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
            wortspielNumber: i + 1,
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

export const newStreakFunctionTest = () => {
    const games = Object.values(data).map((gameString) =>
        JSON.parse(gameString)
    );
    console.log("current streak", currentWinStreak(games));
    console.log("longest streak", hightestWinStreak(games));
};
