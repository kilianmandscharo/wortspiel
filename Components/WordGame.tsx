import React, { useEffect, useState } from "react";
import styles from "../styles/WordGame.module.css";
import Keypad from "./Keypad";
import data from "../core/words.json";

const wordDict = data.data;

export enum Status {
    neutral,
    false,
    correctLetter,
    correctPositon,
}

const getRandomWordFromDict = () => {
    const keys = Object.keys(wordDict);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomWords = wordDict[randomKey as keyof typeof wordDict];
    return randomWords[Math.floor(Math.random() * randomWords.length)];
};

const WORD = getRandomWordFromDict();

interface WordGameState {
    currentWord: number;
    currentLetter: number;
    finished: boolean;
    won: boolean;
    falseLetters: string[];
    correctPositions: string[];
    correctLetters: string[];
    guesses: LetterCell[][];
    wordNotInList: boolean;
}

interface WordGameProps {
    saveRound: (
        totalGuesses: number,
        guesses: LetterCell[][],
        word: string,
        won: boolean
    ) => void;
}

class WordGame extends React.Component<WordGameProps, WordGameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentWord: 0,
            currentLetter: 0,
            won: false,
            finished: false,
            falseLetters: [],
            correctPositions: [],
            correctLetters: [],
            guesses: new Array(6)
                .fill(0)
                .map((row) =>
                    new Array(5).fill(0).map((entry) => LetterCell("0"))
                ),
            wordNotInList: false,
        };
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event: any) => {
        const val = event.keyCode;
        if (val === 8) {
            this.handleBackPress();
        }
        if (val === 13) {
            this.handleSubmit();
        }
        if (
            (val >= 65 && val <= 90) ||
            (val >= 97 && val <= 122) ||
            val === 186 ||
            val === 219 ||
            val === 222
        ) {
            this.handleLetterPress(event.key.toUpperCase());
        }
    };

    handleLetterPress = (letter: string) => {
        if (this.state.finished) {
            return;
        }
        this.setState((state) => ({
            guesses: state.guesses.map((word, i) =>
                word.map((letterCell, j) =>
                    i === state.currentWord && j === state.currentLetter
                        ? { ...letterCell, letter }
                        : { ...letterCell }
                )
            ),
        }));
        if (this.state.currentLetter < 5) {
            this.setState((state) => ({
                currentLetter: state.currentLetter + 1,
            }));
        }
    };

    handleBackPress = () => {
        this.setState((state) => ({
            guesses: state.guesses.map((word, i) =>
                word.map((letterCell, j) =>
                    i === state.currentWord && j === state.currentLetter - 1
                        ? { ...letterCell, letter: "0" }
                        : { ...letterCell }
                )
            ),
            currentLetter:
                state.currentLetter > 0
                    ? state.currentLetter - 1
                    : state.currentLetter,
        }));
    };

    handleSubmit = () => {
        if (this.state.currentLetter < 5) {
            return;
        }
        const guess = this.state.guesses[this.state.currentWord]
            .map((letterCell) => letterCell.letter)
            .join("");
        if (this.checkIfWordInDict(guess)) {
            this.setState((state) => ({
                currentLetter: 0,
                currentWord: state.currentWord + 1,
            }));
            this.updateGuesses();
            this.checkForEndOfGame();
            this.updateLetterStates();
        } else {
            this.setState({ wordNotInList: true });
            setTimeout(() => {
                this.setState({ wordNotInList: false });
            }, 1000);
        }
    };

    checkIfWordInDict = (word: string) => {
        const firstLetter = word.split("")[0];
        const possibleWords = wordDict[firstLetter as keyof typeof wordDict];
        return possibleWords.includes(word) ? true : false;
    };

    checkForEndOfGame = () => {
        let word = "";
        for (const letterCell of this.state.guesses[
            this.state.currentWord - 1
        ]) {
            word += letterCell.letter;
        }
        if (word === WORD) {
            this.setState({ finished: true, won: true });
            this.props.saveRound(
                this.state.currentWord,
                this.state.guesses,
                WORD,
                true
            );
        }
        if (this.state.currentWord === 6 && !this.state.won) {
            this.setState({ finished: true });
            this.props.saveRound(
                this.state.currentWord,
                this.state.guesses,
                WORD,
                false
            );
        }
    };

    updateLetterStates = () => {
        if (this.state.currentWord === 0) {
            return;
        }
        for (const letterCell of this.state.guesses[
            this.state.currentWord - 1
        ]) {
            if (
                letterCell.status === Status.correctPositon &&
                !this.state.correctPositions.includes(letterCell.letter)
            ) {
                this.setState((state) => ({
                    correctPositions: [
                        ...state.correctPositions,
                        letterCell.letter,
                    ],
                }));
            }
            if (
                letterCell.status === Status.correctLetter &&
                !this.state.correctLetters.includes(letterCell.letter) &&
                !this.state.correctPositions.includes(letterCell.letter)
            ) {
                this.setState((state) => ({
                    correctLetters: [
                        ...state.correctLetters,
                        letterCell.letter,
                    ],
                }));
            }
            if (
                letterCell.status === Status.false &&
                !this.state.falseLetters.includes(letterCell.letter) &&
                !this.state.correctPositions.includes(letterCell.letter) &&
                !this.state.correctLetters.includes(letterCell.letter)
            ) {
                this.setState((state) => ({
                    falseLetters: [...state.falseLetters, letterCell.letter],
                }));
            }
        }
    };

    updateGuesses = () => {
        if (this.state.currentWord === 0) {
            return;
        }
        const wordToGuess = WORD.split("");
        const wordLevel = this.state.currentWord - 1;

        const letterCounts = this.countLettersInWord(WORD);

        const updatedGuesses: LetterCell[][] = [];

        for (let i = 0; i < 6; i++) {
            const oldGuess = this.state.guesses[i];
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
            const lettersGuessed =
                this.getLettersInGuessWithoutDuplicates(oldGuess);
            const correctlyPositionedLetters =
                this.getCorrectlyPositionedLetters(oldGuess);

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
        this.setState({ guesses: updatedGuesses });
    };

    getCorrectlyPositionedLetters = (guess: LetterCell[]) => {
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

    getLettersInGuessWithoutDuplicates = (guess: LetterCell[]) => {
        const letters: any = {};
        for (const letterCell of guess) {
            const letter = letterCell.letter;
            if (!Object.keys(letters).includes(letter)) {
                letters[letter] = 0;
            }
        }
        return letters;
    };

    countLettersInWord = (word: string) => {
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

    determineClassName = (letterCell: LetterCell) => {
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

    determineBorderColor = () => {
        if (this.state.finished && this.state.won) {
            return `${styles.guesses} ${styles.won}`;
        }
        if (this.state.finished && !this.state.won) {
            return `${styles.guesses} ${styles.lost}`;
        }
        return `${styles.guesses}`;
    };

    render() {
        return (
            <div className={styles.wordGame}>
                <div className={this.determineBorderColor()}>
                    {this.state.guesses.map((guess, i) => (
                        <div key={i} className={styles.row}>
                            {guess.map((letterCell, j) => (
                                <div
                                    key={`${i}${j}`}
                                    className={this.determineClassName(
                                        letterCell
                                    )}
                                >
                                    {letterCell.letter}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <Keypad
                    handleLetterPress={this.handleLetterPress}
                    handleBackPress={this.handleBackPress}
                    handleSubmit={this.handleSubmit}
                    letterPosition={this.state.currentLetter}
                    correctPositions={this.state.correctPositions}
                    correctLetters={this.state.correctLetters}
                    falseLetters={this.state.falseLetters}
                />
                {this.state.wordNotInList && (
                    <div className={styles.notInList}>
                        Wort nicht in der Liste enthalten
                    </div>
                )}
            </div>
        );
    }
}

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
