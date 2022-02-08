import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Scores from "../Components/Scores";
import { Game, LetterCell } from "../interfaces/interfaces";
import checkIfAlreadyPlayedToday from "../functions/checkIfPlayed";
import {
    getCurrentWinStreak,
    getHighestWinStreak,
    getWinPercentage,
} from "../functions/statFunctions";
import { getGameNumber, getGamesFromStorage } from "../functions/getGames";

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
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);

    useEffect(() => {
        const games = getGamesFromStorage();
        if (!games.length) {
            return;
        }
        updateStats(games);
        setAlreadyPlayed(checkIfAlreadyPlayedToday(games));
        console.log(games);
    }, []);

    const updateStats = (games: Game[]) => {
        // The win streak function need adjusting for the case, that a player
        // misses a day.
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

    const saveRound = (
        totalGuesses: number,
        guesses: LetterCell[][],
        word: string,
        won: boolean
    ) => {
        const gameNumber = getGameNumber();
        localStorage.setItem(
            `${gameNumber}`,
            JSON.stringify({
                round: gameNumber,
                totalGuesses,
                won,
                word,
                date: new Date(),
            })
        );
        localStorage.setItem("last", JSON.stringify(guesses));
        const games = getGamesFromStorage();
        setAlreadyPlayed(true);
        updateStats(games);
        setTimeout(() => {
            setScoresActive(true);
        }, 3000);
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
                        alreadyPlayed={alreadyPlayed}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
