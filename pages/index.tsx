import { useEffect, useState } from "react";
import InstructionButton from "../Components/InstructionButton";
import Instructions from "../Components/Instructions";
import ScoreButton from "../Components/ScoreButton";
import WordGame from "../Components/WordGame";
import styles from "../styles/Home.module.css";
import { useCookies } from "react-cookie";

const Home = () => {
    const [instructionsActive, setInstructionsActive] = useState(false);
    const [cookies, setCookie] = useCookies(["game"]);

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
            <WordGame />
            {instructionsActive && (
                <Instructions
                    handleClick={() => setInstructionsActive(false)}
                />
            )}
        </div>
    );
};

export default Home;
