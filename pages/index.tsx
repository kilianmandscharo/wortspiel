import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame, { LetterCell } from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Scores from "../Components/Scores";

interface Game {
    round: number;
    totalGuesses: number;
    won: boolean;
}

const Home = () => {
    const [instructionsActive, setInstructionsActive] = useState(false);
    const [scoresActive, setScoresActive] = useState(false);
    const [guesses, setGuesses] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    });
    const [highestStreak, setHighestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [winPercentage, setWinPercentage] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);

    useEffect(() => {
        const games = getGamesFromStorage();
        if (!games.length) {
            return;
        }
        console.log(games);
        updateStats(games);
    }, []);

    const updateStats = (games: Game[]) => {
        setGuesses(getNumberOfGuessesForEachNumber(games));
        setHighestStreak(getHighestWinStreak(games));
        setCurrentStreak(getCurrentWinStreak(games));
        setWinPercentage(getWinPercentage(games));
        setGamesPlayed(games.length);
    };

    const getNumberOfGuessesForEachNumber = (games: Game[]) => {
        const totalGuessesForAllGames = games
            .filter((game) => game.won)
            .map((game) => game.totalGuesses);
        const guessesForEachNumber: any = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        };
        for (const totalGuesses of totalGuessesForAllGames) {
            guessesForEachNumber[totalGuesses] += 1;
        }
        return guessesForEachNumber;
    };

    const getWinPercentage = (games: Game[]) => {
        const wins = games.filter((game) => game.won).length;
        return Math.round((wins / games.length) * 100);
    };

    const getCurrentWinStreak = (games: Game[]) => {
        let currentStreak = 0;
        let gameNumber = games.length - 1;
        while (gameNumber > 0) {
            if (!games[gameNumber].won) {
                break;
            }
            currentStreak++;
            gameNumber--;
        }
        return currentStreak;
    };

    const getHighestWinStreak = (games: Game[]) => {
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

    const saveRound = (
        totalGuesses: number,
        guesses: LetterCell[][],
        word: string,
        won: boolean
    ) => {
        const keys = getSortedStorageKeys();
        let gameNumber;
        gameNumber = !keys.length ? 1 : parseInt(keys[keys.length - 1]) + 1;
        localStorage.setItem(
            `${gameNumber}`,
            JSON.stringify({
                round: gameNumber,
                totalGuesses,
                won,
            })
        );
        const games = getGamesFromStorage();
        updateStats(games);
        setTimeout(() => {
            setScoresActive(true);
        }, 3000);
    };

    const getSortedStorageKeys = () => {
        return Object.keys(localStorage)
            .filter((key) => Number.isInteger(parseInt(key)))
            .sort((a: string, b: string) => parseInt(a) - parseInt(b));
    };

    const getGamesFromStorage = () => {
        const keys = getSortedStorageKeys();
        const games: Game[] = keys.map((key) => JSON.parse(localStorage[key]));
        return games;
    };

    return (
        <div>
            <Head>
                <title>Wortspiel</title>
                <meta charSet="utf-8" />
                <meta name="author" content="KilianMandscharo" />
                <meta
                    name="description"
                    content="Deutsche Version des Spiels WORDLE. Errate das gesuchte Wort in sechs Versuchen."
                />
                <meta name="keywords" content="wordle, deutsch, wortspiel" />
                <link rel="shortcut icon" href="favicon.ico" />
            </Head>
            <div className={styles.home}>
                <div className={styles.headerSection}>
                    <div
                        className={styles.menuButton}
                        onClick={() => setInstructionsActive((prev) => !prev)}
                    >
                        <InstructionButton />
                    </div>
                    <h1 className={styles.header}>Wortspiel</h1>
                    <div
                        className={styles.menuButton}
                        onClick={() => setScoresActive((prev) => !prev)}
                    >
                        <ScoreButton />
                    </div>
                </div>
                <WordGame saveRound={saveRound} />
                {instructionsActive && (
                    <Instructions
                        handleClick={() => setInstructionsActive(false)}
                    />
                )}
                {scoresActive && (
                    <Scores
                        guessesForEachNumber={guesses}
                        handleClick={() => setScoresActive(false)}
                        highestStreak={highestStreak}
                        currentStreak={currentStreak}
                        winPercentage={winPercentage}
                        gamesPlayed={gamesPlayed}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
