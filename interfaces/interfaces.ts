export interface WordGameState {
    currentWord: number;
    currentLetter: number;
    finished: boolean;
    won: boolean;
    falseLetters: string[];
    correctPositions: string[];
    correctLetters: string[];
    guesses: LetterCell[][];
    wordNotInList: boolean;
    showLossMessage: boolean;
    wordToGuess: string;
    showWinMessage: boolean;
    alreadyPlayed: boolean;
}

export interface WordGameProps {
    saveRound: (
        totalGuesses: number,
        guesses: LetterCell[][],
        word: string,
        won: boolean
    ) => void;
}

export interface LetterCell {
    letter: string;
    status: Status;
}

export enum Status {
    neutral,
    false,
    correctLetter,
    correctPositon,
}

export interface KeypadProps {
    handleLetterPress: (letter: string) => void;
    handleBackPress: () => void;
    handleSubmit: () => void;
    letterPosition: number;
    correctPositions: string[];
    correctLetters: string[];
    falseLetters: string[];
    finished: boolean;
    handlePlayAgain: () => void;
    disabled: boolean;
}

export interface Game {
    round: number;
    totalGuesses: number;
    won: boolean;
    date: Date;
    word: string;
}

export interface ScoreProps {
    guessesForEachNumber: any;
    handleClick: () => void;
    highestStreak: number;
    currentStreak: number;
    winPercentage: number;
    gamesPlayed: number;
    alreadyPlayed: boolean;
}

export interface InstructionProps {
    handleClick: () => void;
}