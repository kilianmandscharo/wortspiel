import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame, { LetterCell } from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import Cookies from "universal-cookie";
import Head from "next/head";
import Scores from "../Components/Scores";

interface Game {
    totalGuesses: number;
    guesses: LetterCell[][];
    word: string;
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
    const cookies = new Cookies();

    useEffect(() => {
        const games = cookies.getAll();
        const keys = Object.keys(games);
        if (keys.length === 0) {
            return;
        }
        const lastRound = games[keys[keys.length - 1]];
        const totalGuessesPerGame = Object.entries(games).map(
            ([_, game]: [string, any]) => game.totalGuesses
        );
        const guessesForEachNumber: any = { ...guesses };
        for (const numberOfGuesses of totalGuessesPerGame) {
            guessesForEachNumber[numberOfGuesses] += 1;
        }
        setGuesses(guessesForEachNumber);
    }, []);

    const saveRound = (
        totalGuesses: number,
        guesses: LetterCell[][],
        word: string,
        won: boolean
    ) => {
        const gameStats = {
            totalGuesses,
            guesses,
            word,
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
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
