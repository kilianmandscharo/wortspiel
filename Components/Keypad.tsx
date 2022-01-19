import { useState } from "react";
import { LetterCell } from "./WordGame";
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
}

const Keypad = ({
    handleLetterPress,
    handleBackPress,
    handleSubmit,
}: KeypadProps) => {
    const [keys, setKeys] = useState(
        ALPHABET.map((row) => row.map((letter) => LetterCell(letter)))
    );

    return (
        <div className={styles.keypad}>
            {keys.map((row, i) => (
                <div key={i} className={styles.row}>
                    {row.map((letterCell, j) => (
                        <button
                            key={`${i}${j}`}
                            className={styles.letter}
                            onClick={() => handleLetterPress(letterCell.letter)}
                        >
                            {letterCell.letter}
                        </button>
                    ))}
                </div>
            ))}
            <button className={styles.submit} onClick={handleSubmit}>
                Submit
            </button>
            <button className={styles.back} onClick={handleBackPress}>
                {"<-"}
            </button>
        </div>
    );
};

export default Keypad;
