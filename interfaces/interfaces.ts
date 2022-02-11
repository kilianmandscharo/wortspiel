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
        won: boolean,
        wortspielNumber: number
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
    disabled: boolean;
}

export interface ScoreProps {
    guessesForEachNumber: any;
    handleClick: () => void;
    highestStreak: number;
    currentStreak: number;
    winPercentage: number;
    gamesPlayed: number;
    alreadyPlayed: boolean;
    message: string;
}

export interface InstructionProps {
    handleClick: () => void;
}

export interface ShareButtonProps {
    message: string;
}

export interface Game {
    round: number;
    totalGuesses: number;
    won: boolean;
    date: Date;
    word: string;
    wortspielNumber: number;
}

export interface LastGame extends Game {
    guesses: LetterCell[][];
}
