import React from "react";
import styles from "../styles/WordGame.module.css";
import Keypad from "./Keypad";
import {
    Game,
    LastGame,
    LetterCell,
    Status,
    WordGameProps,
    WordGameState,
} from "../interfaces/interfaces";
import checkIfAlreadyPlayedToday, {
    checkDatesForSameDay,
} from "../functions/checkIfPlayed";
import words from "../public/words_to_guess.json";
import data from "../public/words.json";
import startingDate from "../public/startingDate";
import { getGamesFromStorage } from "../functions/getGames";
import determineClassForLetter from "../functions/determineClassForLetter";

const wordDict = data.words;

const messages = [
    "Transzendental!",
    "Unglaublich!",
    "Sehr gut!",
    "Par.",
    "Solide.",
    "Puh...",
];

class WordGame extends React.Component<WordGameProps, WordGameState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentWord: 0,
            currentLetter: 0,
            won: false,
            falseLetters: [],
            correctPositions: [],
            correctLetters: [],
            guesses: this.newEmptyGuesses(),
            wordNotInList: false,
            showLossMessage: false,
            wordToGuess: "",
            showWinMessage: false,
            alreadyPlayed: false,
            animationRowNumber: -1,
            borderAnimation: false,
            animateOnReload: false,
            keysLocked: false,
        };
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
        this.setupGame();
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    setupGame = () => {
        const games = getGamesFromStorage();
        const gamesInStorage = this.handleIfNoGamesInStorage(games);
        if (gamesInStorage) {
            const alreadyPlayed = checkIfAlreadyPlayedToday(games);
            this.handleIfAlreadyPlayed(alreadyPlayed);
        }
    };

    handleIfNoGamesInStorage = (games: Game[]) => {
        if (!games.length) {
            this.setWordForTheDay();
            this.handleIfActiveGuesses();
            return false;
        }
        return true;
    };

    handleIfAlreadyPlayed = (alreadyPlayed: boolean) => {
        if (alreadyPlayed) {
            const lastGameString = localStorage.getItem("last");
            if (lastGameString) {
                const lastGame: LastGame = JSON.parse(lastGameString);
                this.setState(
                    {
                        alreadyPlayed: true,
                        guesses: lastGame.guesses,
                        won: lastGame.won,
                        wordToGuess: lastGame.word,
                        animateOnReload: true,
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({ animateOnReload: false });
                        }, 2600);
                        this.updateLetterStatesFromAllGuesses();
                        if (!lastGame.won) {
                            this.setState({ showLossMessage: true });
                            setTimeout(() => {
                                this.setState({ showLossMessage: false });
                            }, 4000);
                        }
                    }
                );
            }
        } else {
            this.setWordForTheDay();
            this.handleIfActiveGuesses();
        }
    };

    handleIfActiveGuesses = () => {
        const lastSaveAsString = localStorage.getItem("activeGuesses");
        if (lastSaveAsString) {
            const lastSave = JSON.parse(lastSaveAsString);
            const guesses: LetterCell[][] = lastSave.guesses;
            const dateOfLastSave = new Date(lastSave.date);
            const today = new Date();
            if (checkDatesForSameDay(dateOfLastSave, today)) {
                this.setState(
                    { guesses: guesses, currentWord: lastSave.currentWord },
                    () => {
                        this.updateLetterStatesFromAllGuesses();
                    }
                );
            }
        }
    };

    setWordForTheDay = () => {
        const randomWords = words.words;
        const word = randomWords[this.getIndexForTodaysWord()];
        this.setState({ wordToGuess: word });
    };

    getIndexForTodaysWord = () => {
        const now = new Date();
        const start = new Date(startingDate);
        const listLength = words.words.length;
        return (
            Math.floor(
                (now.getTime() - start.getTime()) / 1000 / 60 / 60 / 24
            ) % listLength
        );
    };

    handleKeyDown = (event: any) => {
        if (this.state.alreadyPlayed || this.state.keysLocked) {
            return;
        }
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
            val === 59 ||
            val === 219 ||
            val === 222
        ) {
            this.handleLetterPress(event.key.toUpperCase());
        }
    };

    handleLetterPress = (letter: string) => {
        if (this.state.alreadyPlayed) {
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
        const guess = this.state.guesses[this.state.currentWord];
        const guessString = guess
            .map((letterCell) => letterCell.letter)
            .join("");
        if (checkIfWordInDict(guessString)) {
            const updatedGuess = this.updateAndSetCurrentGuess(guess);
            this.updateLetterStatesFromCurrentGuess(updatedGuess);
            const won = this.checkForEndOfGame(guessString);
            this.setState((prev) => ({
                animationRowNumber: prev.currentWord,
                keysLocked: true,
            }));
            if (!won) {
                this.setState(
                    (state) => ({
                        currentLetter: 0,
                        currentWord: state.currentWord + 1,
                    }),
                    () => {
                        setTimeout(() => {
                            this.setState({ keysLocked: false });
                        }, 2600);
                        localStorage.setItem(
                            "activeGuesses",
                            JSON.stringify({
                                guesses: this.state.guesses,
                                currentWord: this.state.currentWord,
                                date: new Date(),
                            })
                        );
                    }
                );
            }
        } else {
            this.setState({ wordNotInList: true });
            setTimeout(() => {
                this.setState({ wordNotInList: false });
            }, 1000);
        }
    };

    checkForEndOfGame = (guess: string) => {
        if (guess === this.state.wordToGuess) {
            this.setState({ borderAnimation: true, keysLocked: true });
            setTimeout(() => {
                this.setState({
                    alreadyPlayed: true,
                    won: true,
                    showWinMessage: true,
                });
                this.saveRound(true);
                setTimeout(() => {
                    this.setState({ showWinMessage: false });
                }, 3000);
            }, 3500);
            return true;
        }
        if (this.state.currentWord === 5 && guess !== this.state.wordToGuess) {
            this.setState({ borderAnimation: true });
            setTimeout(() => {
                this.setState({
                    alreadyPlayed: true,
                    showLossMessage: true,
                });
                this.saveRound(false);
                setTimeout(() => {
                    this.setState({ showLossMessage: false });
                }, 4000);
                return false;
            }, 4000);
        }
        return false;
    };

    saveRound = (won: boolean) => {
        localStorage.setItem("activeGuesses", "");
        this.props.saveRound(
            this.state.currentWord + 1,
            this.state.guesses,
            this.state.wordToGuess,
            won,
            this.getIndexForTodaysWord()
        );
    };

    updateLetterStatesFromAllGuesses = () => {
        let correctPositions = [...this.state.correctPositions];
        let correctLetters = [...this.state.correctLetters];
        let falseLetters = [...this.state.falseLetters];
        for (const guess of this.state.guesses) {
            for (const letterCell of guess) {
                [correctPositions, correctLetters, falseLetters] =
                    this.updateFromSingleLetterCell(
                        letterCell,
                        correctPositions,
                        correctLetters,
                        falseLetters
                    );
            }
        }
        this.setState({ correctPositions, correctLetters, falseLetters });
    };

    updateLetterStatesFromCurrentGuess = (guess: LetterCell[]) => {
        let correctPositions = [...this.state.correctPositions];
        let correctLetters = [...this.state.correctLetters];
        let falseLetters = [...this.state.falseLetters];
        for (const letterCell of guess) {
            [correctPositions, correctLetters, falseLetters] =
                this.updateFromSingleLetterCell(
                    letterCell,
                    correctPositions,
                    correctLetters,
                    falseLetters
                );
        }
        this.setState({ correctPositions, correctLetters, falseLetters });
    };

    updateFromSingleLetterCell = (
        letterCell: LetterCell,
        correctPositions: string[],
        correctLetters: string[],
        falseLetters: string[]
    ) => {
        if (
            letterCell.status === Status.correctPositon &&
            !correctPositions.includes(letterCell.letter)
        ) {
            correctPositions.push(letterCell.letter);
            correctLetters = correctLetters.filter(
                (letter) => letter !== letterCell.letter
            );
            falseLetters = falseLetters.filter(
                (letter) => letter !== letterCell.letter
            );
        }
        if (
            letterCell.status === Status.correctLetter &&
            !correctLetters.includes(letterCell.letter) &&
            !correctPositions.includes(letterCell.letter)
        ) {
            correctLetters.push(letterCell.letter);
            falseLetters = falseLetters.filter(
                (letter) => letter !== letterCell.letter
            );
        }
        if (
            letterCell.status === Status.false &&
            !falseLetters.includes(letterCell.letter) &&
            !correctPositions.includes(letterCell.letter) &&
            !correctLetters.includes(letterCell.letter)
        ) {
            falseLetters.push(letterCell.letter);
        }
        return [correctPositions, correctLetters, falseLetters];
    };

    updateAndSetCurrentGuess = (currentGuess: LetterCell[]) => {
        const newGuesses: LetterCell[][] = this.state.guesses.map((row) =>
            row.map((letterCell) => ({ ...letterCell }))
        );
        const letterCounts = this.countLettersInWord(this.state.wordToGuess);
        const lettersGuessed =
            this.getLettersInGuessWithoutDuplicates(currentGuess);
        const correctlyPositionedLetters =
            this.getCorrectlyPositionedLetters(currentGuess);
        const wordToGuess = this.state.wordToGuess.split("");
        const updatedGuess = currentGuess.map((letterCell, i) => {
            const letter = letterCell.letter;
            if (letter === wordToGuess[i]) {
                return { ...letterCell, status: Status.correctPositon };
            }
            if (wordToGuess.includes(letter)) {
                if (
                    lettersGuessed[letter] +
                        correctlyPositionedLetters[letter] <
                    letterCounts[letter]
                ) {
                    lettersGuessed[letter] += 1;
                    return { ...letterCell, status: Status.correctLetter };
                } else {
                    lettersGuessed[letter] += 1;
                    return { ...letterCell, status: Status.false };
                }
            }
            return { ...letterCell, status: Status.false };
        });
        newGuesses[this.state.currentWord] = updatedGuess;
        this.setState({ guesses: newGuesses });
        return updatedGuess;
    };

    getCorrectlyPositionedLetters = (guess: LetterCell[]) => {
        const letters: any = {};
        const word = this.state.wordToGuess.split("");
        for (let i = 0; i < 5; i++) {
            const letter = guess[i].letter;
            if (letter === word[i]) {
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

    determineBorderColor = () => {
        if (this.state.alreadyPlayed && this.state.won) {
            return !this.state.borderAnimation
                ? `${styles.guesses} ${styles.wonWithoutAnim}`
                : `${styles.guesses} ${styles.won}`;
        }
        if (this.state.alreadyPlayed && !this.state.won) {
            return !this.state.borderAnimation
                ? `${styles.guesses} ${styles.lostWithoutAnim}`
                : `${styles.guesses} ${styles.lost}`;
        }
        return `${styles.guesses}`;
    };

    newEmptyGuesses = () => {
        return new Array(6)
            .fill(0)
            .map((row) =>
                new Array(5).fill(0).map((entry) => makeLetterCell("0"))
            );
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
                                    className={determineClassForLetter(
                                        letterCell,
                                        i,
                                        j,
                                        this.state.animationRowNumber,
                                        this.state.animateOnReload
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
                    disabled={this.state.alreadyPlayed ? true : false}
                />
                {this.state.wordNotInList && (
                    <div className={`${styles.errorMessage} ${styles.message}`}>
                        Wort nicht in der Liste enthalten
                    </div>
                )}
                {this.state.showLossMessage && (
                    <div className={`${styles.lossMessage} ${styles.message}`}>
                        <div>Verloren. Das gesuchte Wort ist: </div>
                        <div className={styles.correctWord}>
                            {this.state.wordToGuess}
                        </div>
                    </div>
                )}
                {this.state.showWinMessage && (
                    <div className={`${styles.winMessage} ${styles.message}`}>
                        {this.state.currentWord
                            ? messages[this.state.currentWord]
                            : messages[0]}
                    </div>
                )}
            </div>
        );
    }
}

export const makeLetterCell = (letter: string): LetterCell => {
    return {
        letter,
        status: Status.neutral,
    };
};

const getRandomWordFromDict = () => {
    const keys = Object.keys(wordDict);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomWords = wordDict[randomKey as keyof typeof wordDict];
    return randomWords[Math.floor(Math.random() * randomWords.length)];
};

const checkIfWordInDict = (word: string) => {
    const firstLetter = word.split("")[0];
    const possibleWords = wordDict[firstLetter as keyof typeof wordDict];
    console.log(possibleWords);
    return possibleWords.includes(word) ? true : false;
};

export default WordGame;
