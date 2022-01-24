import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame, { LetterCell } from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import Cookies from "universal-cookie";
import Head from "next/head";

const Home = () => {
    const [instructionsActive, setInstructionsActive] = useState(false);
    const cookies = new Cookies();

    useEffect(() => {
        console.log(cookies.getAll());
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
        cookies.set("game", JSON.stringify(gameStats), { path: "/" });
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
                    <div className={styles.menuButton}>
                        <ScoreButton />
                    </div>
                </div>
                <WordGame saveRound={saveRound} />
                {instructionsActive && (
                    <Instructions
                        handleClick={() => setInstructionsActive(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
