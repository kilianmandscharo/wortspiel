import styles from "../styles/Scores.module.css";
import BackButton from "./BackButton";

interface ScoreProps {
    guessesForEachNumber: any;
    handleClick: () => void;
}

const Scores = ({ guessesForEachNumber, handleClick }: ScoreProps) => {
    const highestNumberOfGuesses = Math.max(
        ...Object.values(guessesForEachNumber).map((num: any) => parseInt(num))
    );

    const ratio = 250 / highestNumberOfGuesses;

    return (
        <div className={styles.backDrop} onClick={handleClick}>
            <div className={styles.scores}>
                <div>
                    <BackButton />
                    <h1 className={styles.header}>Scores</h1>
                </div>
                <div className={styles.barChart}>
                    {Object.entries(guessesForEachNumber).map(
                        ([key, value]: [string, any]) => (
                            <div
                                key={key}
                                className={styles.bar}
                                style={{ width: `${20 + value * ratio}px` }}
                            >
                                <div className={styles.number}>{key}</div>
                                <div className={styles.guess}>{value}</div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Scores;
