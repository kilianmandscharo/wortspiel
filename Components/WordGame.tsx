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
    const [finished, setFinished] = useState(false);
    const [falseLetters, setFalseLetters] = useState<string[]>([]);
    const [correctPositions, setCorrectPositions] = useState<string[]>([]);
    const [correctLetters, setCorrectLetters] = useState<string[]>([]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        updateGuesses();
        checkForWin();
        updateLetterStates();
    }, [currentWord]);

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
        if (finished) {
            return;
        }
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
        if (currentLetter < 5) {
            return;
        }
        setCurrentLetter(0);
        setCurrentWord((prevWordCount) => prevWordCount + 1);
    };

    const checkForWin = () => {
        for (const guess of guesses) {
            let word = "";
            for (const letterCell of guess) {
                word += letterCell.letter;
            }
            if (word === WORD) {
                setFinished(true);
            }
        }
    };

    const updateLetterStates = () => {
        if (currentWord === 0) {
            return;
        }
        for (const letterCell of guesses[currentWord - 1]) {
            if (
                letterCell.status === Status.correctPositon &&
                !correctPositions.includes(letterCell.letter)
            ) {
                setCorrectPositions((prev) => [...prev, letterCell.letter]);
            }
            if (
                letterCell.status === Status.correctLetter &&
                !correctLetters.includes(letterCell.letter)
            ) {
                setCorrectLetters((prev) => [...prev, letterCell.letter]);
            }
            if (
                letterCell.status === Status.false &&
                !falseLetters.includes(letterCell.letter)
            ) {
                setFalseLetters((prev) => [...prev, letterCell.letter]);
            }
        }
    };

    const updateGuesses = () => {
        if (currentWord === 0) {
            return;
        }
        const wordToGuess = WORD.split("");
        const wordLevel = currentWord - 1;

        const letterCounts = countLettersInWord(WORD);

        const updatedGuesses: LetterCell[][] = [];

        for (let i = 0; i < 6; i++) {
            const oldGuess = guesses[i];
            const updatedGuess: LetterCell[] = [];

            // These objects are needed later to limit the number of
            // letters marked correctLetter, for example: The word to
            // guess is HELLO, and the guess, for the sake of argument,
            // is LLLLL, then the third and fourth L should be marked
            // as correctPositon, the other Ls as false and not as
            // correctLetter, even thoug they are contained in the correct
            // word; in the same vein, if the guess is LLXXL, only the first
            // two Ls should be marked as correctLetter, the third L in
            // the fifth position as false
            const lettersGuessed = getLettersInGuessWithoutDuplicates(oldGuess);
            const correctlyPositionedLetters =
                getCorrectlyPositionedLetters(oldGuess);

            for (let j = 0; j < 5; j++) {
                const letterCell = oldGuess[j];
                const letter = letterCell.letter;
                if (i !== wordLevel) {
                    updatedGuess.push({ ...letterCell });
                } else if (letter === wordToGuess[j]) {
                    updatedGuess.push({
                        ...letterCell,
                        status: Status.correctPositon,
                    });
                } else if (wordToGuess.includes(letter)) {
                    // Here the aforementioned ceck comes into play:
                    // if a letter is contained in the correct word,
                    // it is only marked as correctLetter, if the number
                    // of times, that the letter is in the correct
                    // position in the guess, plus the number of already
                    // as correctLetter marked instances of the letter
                    // in the guess is less than the instances of the
                    // letter in the correct word, else it is marked false
                    if (
                        lettersGuessed[letter] +
                            correctlyPositionedLetters[letter] <
                        letterCounts[letter]
                    ) {
                        updatedGuess.push({
                            ...letterCell,
                            status: Status.correctLetter,
                        });
                    } else {
                        updatedGuess.push({
                            ...letterCell,
                            status: Status.false,
                        });
                    }
                    lettersGuessed[letter] += 1;
                } else {
                    updatedGuess.push({ ...letterCell, status: Status.false });
                }
            }
            updatedGuesses.push(updatedGuess);
        }
        setGuesses(updatedGuesses);
    };

    const getCorrectlyPositionedLetters = (guess: LetterCell[]) => {
        const letters: any = {};
        for (let i = 0; i < 5; i++) {
            const letter = guess[i].letter;
            if (letter === WORD.split("")[i]) {
                if (!Object.keys(letters).includes(letter)) {
                    letters[letter] = 1;
                } else {
                    letters[letter] += 1;
                }
            } else {
                if (!Object.keys(letters).includes(letter)) {
                    letters[letter] = 0;
                }
            }
        }
        return letters;
    };

    const getLettersInGuessWithoutDuplicates = (guess: LetterCell[]) => {
        const letters: any = {};
        for (const letterCell of guess) {
            const letter = letterCell.letter;
            if (!Object.keys(letters).includes(letter)) {
                letters[letter] = 0;
            }
        }
        return letters;
    };

    const countLettersInWord = (word: string) => {
        const letters = word.split("");
        const letterCounts: any = {};
        for (const letter of letters) {
            const letterOccurences = letters.filter(
                (currentLetter) => currentLetter === letter
            ).length;
            letterCounts[letter] = letterOccurences;
        }
        return letterCounts;
    };

    const determineClassName = (letterCell: LetterCell) => {
        if (letterCell.letter === "0") {
            return `${styles.letter} ${styles.empty}`;
        }
        if (letterCell.status === Status.neutral) {
            return `${styles.letter} ${styles.neutral}`;
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
                correctPositions={correctPositions}
                correctLetters={correctLetters}
                falseLetters={falseLetters}
            />
        </div>
    );
};

export interface LetterCell {
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
