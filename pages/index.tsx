import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame, { LetterCell } from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import Cookies from "universal-cookie";
import Head from "next/head";
import Scores from "../Components/Scores";

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
    const cookies = new Cookies();

    useEffect(() => {
        const games = cookies.getAll();
        const keys = Object.keys(games);
        if (!keys.length) {
            return;
        }
        updateStats(games);
    }, []);

    const updateStats = (games: any) => {
        setGuesses(getNumberOfGuessesForEachNumber(games));
        setHighestStreak(getHighestWinStreak(games));
        setCurrentStreak(getCurrentWinStreak(games));
        setWinPercentage(getWinPercentage(games));
        setGamesPlayed(getGamesPlayed(games));
    };

    const getGamesPlayed = (games: any) => {
        return Object.keys(games).length;
    };

    const getNumberOfGuessesForEachNumber = (games: any) => {
        const totalGuessesPerGame: any = [];
        for (const key of Object.keys(games)) {
            if (games[key].won) {
                totalGuessesPerGame.push(games[key].totalGuesses);
            }
        }
        const guessesForEachNumber: any = { ...guesses };
        for (const numberOfGuesses of totalGuessesPerGame) {
            guessesForEachNumber[numberOfGuesses] += 1;
        }
        return guessesForEachNumber;
    };

    const getWinPercentage = (games: any) => {
        let wins = 0;
        let numberOfGames = 0;
        for (const key of Object.keys(games)) {
            numberOfGames += 1;
            if (games[key].won) {
                wins += 1;
            }
        }
        return Math.round((wins / numberOfGames) * 100);
    };

    const getCurrentWinStreak = (games: any) => {
        let currentStreak = 0;
        const keys = Object.keys(games);
        let gameNumber = parseInt(keys[keys.length - 1]);
        while (gameNumber > 0) {
            if (!games[gameNumber].won) {
                break;
            }
            currentStreak += 1;
            gameNumber -= 1;
        }
        return currentStreak;
    };

    const getHighestWinStreak = (games: any) => {
        let streak = 0;
        const winStreaks: number[] = [];
        for (const key of Object.keys(games)) {
            if (games[key].won) {
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
        const gameStats = {
            totalGuesses,
            won,
        };

        const allCookies = cookies.getAll();
        const keys = Object.keys(allCookies);
        let gameNumber;
        if (keys.length === 0) {
            gameNumber = 1;
        } else {
            gameNumber =
                Math.max(...keys.map((number) => parseInt(number))) + 1;
        }

        cookies.set(`${gameNumber}`, JSON.stringify(gameStats), { path: "/" });
        const games = cookies.getAll();
        updateStats(games);
        setTimeout(() => {
            setScoresActive(true);
        }, 1500);
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
