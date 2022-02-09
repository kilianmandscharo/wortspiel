import { useEffect, useState } from "react";
import styles from "../styles/Keypad.module.css";
import { KeypadProps, LetterCell, Status } from "../interfaces/interfaces";
import { makeLetterCell } from "./WordGame";

const ALPHABET = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
    ["Y", "X", "C", "V", "B", "N", "M"],
];

const newAlphabet = () => {
    return ALPHABET.map((row) => row.map((letter) => makeLetterCell(letter)));
};

const Keypad = ({
    handleLetterPress,
    handleBackPress,
    handleSubmit,
    letterPosition,
    correctPositions,
    correctLetters,
    falseLetters,
    finished,
    disabled,
}: KeypadProps) => {
    const [keys, setKeys] = useState(newAlphabet());

    useEffect(() => {
        console.log("correct positions", correctPositions);
        for (const letter of correctPositions) {
            setKeys(
                keys.map((row) =>
                    row.map((letterCell) =>
                        letterCell.letter === letter
                            ? { ...letterCell, status: Status.correctPositon }
                            : { ...letterCell }
                    )
                )
            );
        }
    }, [correctPositions]);

    useEffect(() => {
        console.log("correct letters", correctLetters);
        for (const letter of correctLetters) {
            setKeys(
                keys.map((row) =>
                    row.map((letterCell) =>
                        letterCell.letter === letter
                            ? { ...letterCell, status: Status.correctLetter }
                            : { ...letterCell }
                    )
                )
            );
        }
    }, [correctLetters]);

    useEffect(() => {
        console.log("false letters", falseLetters);
        for (const letter of falseLetters) {
            setKeys(
                keys.map((row) =>
                    row.map((letterCell) =>
                        letterCell.letter === letter
                            ? { ...letterCell, status: Status.false }
                            : { ...letterCell }
                    )
                )
            );
        }
    }, [falseLetters]);

    const determineClassName = (letterCell: LetterCell) => {
        if (letterCell.status === Status.correctPositon) {
            return `${styles.key} ${styles.correctPosition}`;
        }
        if (letterCell.status === Status.correctLetter) {
            return `${styles.key} ${styles.correctLetter}`;
        }
        if (letterCell.status === Status.false) {
            return `${styles.key} ${styles.false}`;
        }
        return `${styles.key}`;
    };

    return (
        <div className={styles.keypad}>
            <div className={styles.row}>
                {keys[0].map((letterCell, i) => (
                    <button
                        key={`0 ${i}`}
                        className={determineClassName(letterCell)}
                        onClick={() => handleLetterPress(letterCell.letter)}
                        disabled={disabled}
                    >
                        {letterCell.letter}
                    </button>
                ))}
            </div>
            <div className={styles.row}>
                {keys[1].map((letterCell, i) => (
                    <button
                        key={`1 ${i}`}
                        className={determineClassName(letterCell)}
                        onClick={() => handleLetterPress(letterCell.letter)}
                        disabled={disabled}
                    >
                        {letterCell.letter}
                    </button>
                ))}
            </div>
            <div className={styles.row}>
                <button
                    disabled={letterPosition < 5 || disabled}
                    className={styles.button}
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                {keys[2].map((letterCell, i) => (
                    <button
                        key={`2 ${i}`}
                        className={determineClassName(letterCell)}
                        onClick={() => handleLetterPress(letterCell.letter)}
                        disabled={disabled}
                    >
                        {letterCell.letter}
                    </button>
                ))}
                <button
                    className={styles.button}
                    onClick={handleBackPress}
                    disabled={disabled}
                >
                    <svg
                        width="44"
                        height="16"
                        viewBox="0 0 44 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM44 7L1 7L1 9L44 9L44 7Z"
                            fill="rgba(255, 255, 255, 0.9)"
                        />
                    </svg>
                </button>
            </div>
            {/* <button
                className={styles.playAgain}
                disabled={!finished}
                onClick={playAgain}
            >
                Neues Spiel
            </button> */}
        </div>
    );
};

export default Keypad;
