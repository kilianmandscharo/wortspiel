import { useState } from "react";
import { ScoreProps } from "../interfaces/interfaces";
import styles from "../styles/Scores.module.css";
import BackButton from "./BackButton";
import ShareButton from "./ShareButton";
import Timer from "./Timer";

const Scores = ({
    guessesForEachNumber,
    handleClick,
    highestStreak,
    currentStreak,
    winPercentage,
    gamesPlayed,
    alreadyPlayed,
    message,
}: ScoreProps) => {
    const [copied, setCopied] = useState(false);

    const highestNumberOfGuesses = Math.max(
        ...Object.values(guessesForEachNumber).map((num: any) => parseInt(num))
    );

    const ratio = highestNumberOfGuesses ? 250 / highestNumberOfGuesses : 250;

    return (
        <div className={styles.backDrop} onClick={handleClick}>
            <div className={styles.scores}>
                {copied && (
                    <div className={styles.copiedMessage}>
                        Wortspiel in die Zwischenablage kopiert!
                    </div>
                )}
                {alreadyPlayed && (
                    <div className={styles.timerShareSection}>
                        <ShareButton message={message} setCopied={setCopied} />
                        <Timer />
                    </div>
                )}
                <div>
                    <BackButton />
                    <h1 className={styles.header}>Scores</h1>
                </div>
                <div className={styles.content}>
                    <div className={styles.barChart}>
                        {Object.entries(guessesForEachNumber).map(
                            ([key, value]: [string, any]) => (
                                <div
                                    key={key}
                                    className={styles.bar}
                                    style={{
                                        width: `${20 + value * ratio}px`,
                                    }}
                                >
                                    <div className={styles.number}>{key}</div>
                                    <div className={styles.guess}>{value}</div>
                                </div>
                            )
                        )}
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statEntry}>
                            Spiele: {gamesPlayed}
                        </div>
                        <div className={styles.statEntry}>
                            Höchste Gewinnserie: {highestStreak}
                        </div>
                        <div className={styles.statEntry}>
                            Aktuelle Gewinnserie: {currentStreak}
                        </div>
                        <div className={styles.statEntry}>
                            Gewinnanteil: {winPercentage}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scores;
