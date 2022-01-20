import { useEffect, useState } from "react";
import { LetterCell, Status } from "./WordGame";
import styles from "../styles/Keypad.module.css";

const ALPHABET = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
    ["Y", "X", "C", "V", "B", "N", "M"],
];

interface KeypadProps {
    handleLetterPress: (letter: string) => void;
    handleBackPress: () => void;
    handleSubmit: () => void;
    letterPosition: number;
    correctPositions: string[];
    correctLetters: string[];
    falseLetters: string[];
}

const Keypad = ({
    handleLetterPress,
    handleBackPress,
    handleSubmit,
    letterPosition,
    correctPositions,
    correctLetters,
    falseLetters,
}: KeypadProps) => {
    const [keys, setKeys] = useState(
        ALPHABET.map((row) => row.map((letter) => LetterCell(letter)))
    );

    useEffect(() => {
        //console.log(correctPositions);
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
        //console.log(correctLetters);
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
        //console.log(falseLetters);
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
            return `${styles.letter} ${styles.correctPosition}`;
        }
        if (letterCell.status === Status.correctLetter) {
            return `${styles.letter} ${styles.correctLetter}`;
        }
        if (letterCell.status === Status.false) {
            return `${styles.letter} ${styles.false}`;
        }
        return `${styles.letter}`;
    };

    return (
        <div className={styles.keypad}>
            <div className={styles.row}>
                {keys[0].map((letterCell, i) => (
                    <button
                        key={`0 ${i}`}
                        className={determineClassName(letterCell)}
                        onClick={() => handleLetterPress(letterCell.letter)}
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
                    >
                        {letterCell.letter}
                    </button>
                ))}
            </div>
            <div className={styles.row}>
                <button
                    disabled={letterPosition < 5}
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
                    >
                        {letterCell.letter}
                    </button>
                ))}
                <button className={styles.button} onClick={handleBackPress}>
                    <svg
                        width="57"
                        height="30"
                        viewBox="0 0 57 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.585786 13.5858C-0.195262 14.3668 -0.195262 15.6332 0.585786 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857864C15.3611 0.0768158 14.0948 0.0768158 13.3137 0.857864L0.585786 13.5858ZM57 13L2 13V17L57 17V13Z"
                            fill="white"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Keypad;
