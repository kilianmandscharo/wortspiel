import React, { useEffect, useState } from "react";
import styles from "../styles/WordGame.module.css";
import Keypad from "./Keypad";

export enum Status {
    neutral,
    false,
    correctLetter,
    correctPositon,
}

const WORD = "HELLO";

const WordGame = () => {
    const [guesses, setGuesses] = useState(
        new Array(6)
            .fill(0)
            .map((row) => new Array(5).fill(0).map((entry) => LetterCell("0")))
    );
    const [currentWord, setCurrentWord] = useState(0);
    const [currentLetter, setCurrentLetter] = useState(0);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        console.log(guesses);
    }, [guesses]);

    useEffect(() => {
        console.log(currentLetter);
    }, [currentLetter]);

    const handleKeyDown = (event: any) => {
        const val = event.keyCode;
        if (
            (val >= 65 && val <= 90) ||
            (val >= 97 && val <= 122) ||
            val === 186 ||
            val === 219 ||
            val === 222
        ) {
            handleLetterPress(event.key.toUpperCase());
        }
    };

    const handleLetterPress = (letter: string) => {
        setGuesses((guesses) =>
            guesses.map((word, i) =>
                word.map((letterCell, j) =>
                    i === currentWord && j === currentLetter
                        ? { ...letterCell, letter }
                        : { ...letterCell }
                )
            )
        );
        if (currentLetter < 5) {
            setCurrentLetter((prevLetterCount) => prevLetterCount + 1);
        }
    };

    const handleBackPress = () => {
        if (currentLetter > 0) {
            setCurrentLetter((prevLetterCount) => prevLetterCount - 1);
        }
        setGuesses(
            guesses.map((word, i) =>
                word.map((letterCell, j) =>
                    i === currentWord && j === currentLetter
                        ? { ...letterCell, letter: "0" }
                        : { ...letterCell }
                )
            )
        );
    };

    const handleSubmit = () => {
        if (currentLetter < 4) {
            return;
        }
        setCurrentLetter((prevLetterCount) => prevLetterCount + 1);
        setGuesses(
            guesses.map((word, i) =>
                word.map((letterCell, j) => determineStatus(letterCell, i, j))
            )
        );
        setCurrentLetter(0);
        setCurrentWord((prevWordCount) => prevWordCount + 1);
    };

    const determineStatus = (
        letterCell: LetterCell,
        wordLevel: number,
        letterPosition: number
    ) => {
        const wordToGuess = WORD.split("");
        if (wordLevel !== currentWord) {
            return { ...letterCell };
        }
        if (letterCell.letter === wordToGuess[letterPosition]) {
            return { ...letterCell, status: Status.correctPositon };
        }
        if (wordToGuess.includes(letterCell.letter)) {
            return { ...letterCell, status: Status.correctLetter };
        }
        return { ...letterCell, status: Status.false };
    };

    const determineClassName = (letterCell: LetterCell) => {
        if (letterCell.letter === "0") {
            return `${styles.letter} ${styles.empty}`;
        }
        if (letterCell.status === Status.correctPositon) {
            return `${styles.letter} ${styles.correctPosition}`;
        }
        if (letterCell.status === Status.correctLetter) {
            return `${styles.letter} ${styles.correctLetter}`;
        }
        if (letterCell.status === Status.false) {
            return `${styles.letter} ${styles.false}`;
        }
        if (letterCell.status === Status.neutral) {
            return `${styles.letter}`;
        }
    };

    return (
        <div>
            <div className={styles.guesses}>
                {guesses.map((guess, i) => (
                    <div key={i} className={styles.row}>
                        {guess.map((letterCell, j) => (
                            <div
                                key={`${i}${j}`}
                                className={determineClassName(letterCell)}
                            >
                                {letterCell.letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Keypad
                handleLetterPress={handleLetterPress}
                handleBackPress={handleBackPress}
                handleSubmit={handleSubmit}
                letterPosition={currentLetter}
            />
        </div>
    );
};

interface LetterCell {
    letter: string;
    status: Status;
}

export const LetterCell = (letter: string): LetterCell => {
    return {
        letter,
        status: Status.neutral,
    };
};

export default WordGame;
