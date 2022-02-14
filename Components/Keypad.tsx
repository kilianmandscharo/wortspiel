import { useEffect, useState } from "react";
import styles from "../styles/Keypad.module.css";
import { KeypadProps, LetterCell, Status } from "../interfaces/interfaces";
import { makeLetterCell } from "./WordGame";

const ALPHABET = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
    ["Y", "X", "C", "V", "B", "N", "M"],
];

const createNewAlphabet = () => {
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
    disabled,
}: KeypadProps) => {
    const [keys, setKeys] = useState(createNewAlphabet());
    const [keyPressed, setKeyPressed] = useState([-1, -1]);
    const [submitPressed, setSubmitPressed] = useState(false);
    const [backPressed, setBackPressed] = useState(false);
    const [newPageLoad, setNewPageLoad] = useState(true);

    useEffect(() => {
        const timeOutDuration = newPageLoad ? 0 : 2500;
        setTimeout(() => {
            let newAlphabet = createNewAlphabet();
            updateAlphabet(
                correctPositions,
                Status.correctPositon,
                newAlphabet
            );
            updateAlphabet(correctLetters, Status.correctLetter, newAlphabet);
            updateAlphabet(falseLetters, Status.false, newAlphabet);
            setKeys(newAlphabet);
            setNewPageLoad(false);
        }, timeOutDuration);
    }, [correctPositions, correctLetters, falseLetters]);

    const updateAlphabet = (
        letters: string[],
        status: Status,
        alphabet: LetterCell[][]
    ) => {
        for (const letter of letters) {
            const letterCell = getLetterCell(letter, alphabet);
            if (letterCell) {
                letterCell.status = status;
            }
        }
    };

    const getLetterCell = (letter: string, alphabet: LetterCell[][]) => {
        for (const row of alphabet) {
            for (const letterCell of row) {
                if (letterCell.letter === letter) {
                    return letterCell;
                }
            }
        }
    };

    const determineClassName = (
        letterCell: LetterCell,
        row: number,
        col: number
    ) => {
        if (row === keyPressed[0] && col === keyPressed[1]) {
            return `${styles.key} ${styles.pressed}`;
        }
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
                        className={determineClassName(letterCell, 0, i)}
                        onClick={() => handleLetterPress(letterCell.letter)}
                        onPointerDown={() => setKeyPressed([0, i])}
                        onPointerUp={() => setKeyPressed([-1, -1])}
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
                        className={determineClassName(letterCell, 1, i)}
                        onClick={() => handleLetterPress(letterCell.letter)}
                        onPointerDown={() => setKeyPressed([1, i])}
                        onPointerUp={() => setKeyPressed([-1, -1])}
                        disabled={disabled}
                    >
                        {letterCell.letter}
                    </button>
                ))}
            </div>
            <div className={styles.row}>
                <button
                    className={
                        submitPressed
                            ? `${styles.button} ${styles.buttonPressed}`
                            : styles.button
                    }
                    onClick={handleSubmit}
                    disabled={letterPosition < 5 || disabled}
                    onPointerDown={() => setSubmitPressed(true)}
                    onPointerUp={() => setSubmitPressed(false)}
                >
                    Submit
                </button>
                {keys[2].map((letterCell, i) => (
                    <button
                        key={`2 ${i}`}
                        className={determineClassName(letterCell, 2, i)}
                        onClick={() => handleLetterPress(letterCell.letter)}
                        onPointerDown={() => setKeyPressed([2, i])}
                        onPointerUp={() => setKeyPressed([-1, -1])}
                        disabled={disabled}
                    >
                        {letterCell.letter}
                    </button>
                ))}
                <button
                    className={
                        backPressed
                            ? `${styles.button} ${styles.buttonPressed}`
                            : styles.button
                    }
                    onClick={handleBackPress}
                    disabled={disabled}
                    onPointerDown={() => setBackPressed(true)}
                    onPointerUp={() => setBackPressed(false)}
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
        </div>
    );
};

export default Keypad;
