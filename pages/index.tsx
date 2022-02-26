import { useEffect, useState } from "react";
import InstructionButton from "../components/InstructionButton";
import Instructions from "../components/Instructions";
import ScoreButton from "../components/ScoreButton";
import WordGame from "../components/WordGame";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Scores from "../components/Scores";
import { Game, LastGame, LetterCell, Status } from "../interfaces/interfaces";
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
    const [shareMessage, setShareMessage] = useState("");

    useEffect(() => {
        const games = getGamesFromStorage();
        if (!games.length) {
            return;
        }
        updateStats(games);
        setAlreadyPlayed(checkIfAlreadyPlayedToday(games));
        updateShareMessage();
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

    const saveRound = (
        totalGuesses: number,
        guesses: LetterCell[][],
        word: string,
        won: boolean,
        wortspielNumber: number
    ) => {
        const gameNumber = getGameNumber();
        const gameWithoutGuesses: Game = {
            round: gameNumber,
            totalGuesses,
            won,
            word,
            date: new Date(),
            wortspielNumber,
        };
        localStorage.setItem(
            `${gameNumber}`,
            JSON.stringify(gameWithoutGuesses)
        );
        localStorage.setItem(
            "last",
            JSON.stringify({ ...gameWithoutGuesses, guesses })
        );
        const games = getGamesFromStorage();
        setAlreadyPlayed(true);
        updateStats(games);
        updateShareMessage();
        setTimeout(() => {
            setScoresActive(true);
        }, 5000);
    };

    const updateShareMessage = () => {
        const lastString = localStorage.getItem("last");
        if (lastString) {
            const last: LastGame = JSON.parse(lastString);
            const { won, totalGuesses, guesses, wortspielNumber } = last;
            let message = `Wortspiel ${wortspielNumber + 1} ${
                won ? totalGuesses : "X"
            }/6\n`;
            for (const guess of guesses) {
                if (guess[0].letter === "0") {
                    continue;
                }
                const colors = guess
                    .map((letterCell) => getColor(letterCell.status))
                    .join("");
                message += `${colors}\n`;
            }
            setShareMessage(message);
        }
    };

    const getColor = (status: Status) => {
        if (status === Status.false) {
            return "⬜️";
        }
        if (status === Status.correctPositon) {
            return "🟩​";
        }
        if (status === Status.correctLetter) {
            return "🟨​";
        }
    };

    return (
        <div>
            <Head>
                <title>Wortspiel</title>
                <meta charSet="utf-8" />
                <meta name="author" content="KilianMandscharo" />
                <meta
                    name="description"
                    content="Deutsche Version des Spiels WORDLE."
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
                        message={shareMessage}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
