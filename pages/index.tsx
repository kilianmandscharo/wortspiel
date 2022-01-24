import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame, { LetterCell } from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import Cookies from "universal-cookie";

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
    );
};

export default Home;
