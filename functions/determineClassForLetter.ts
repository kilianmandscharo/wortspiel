import { LetterCell, Status } from "../interfaces/interfaces";
import styles from "../styles/WordGame.module.css";

const determineClassForLetter = (
    letterCell: LetterCell,
    row: number,
    col: number,
    animationRowNumber: number,
    animateOnReload: boolean
) => {
    if (letterCell.letter === "0") {
        return `${styles.letter} ${styles.empty}`;
    }
    if (letterCell.status === Status.neutral) {
        return `${styles.letter} ${styles.neutral}`;
    }
    if (animateOnReload) {
        return determineAnimationClassByColumn(col, letterCell.status);
    }
    if (row !== animationRowNumber) {
        if (letterCell.status === Status.correctPositon) {
            return `${styles.letter} ${styles.correctPosition}`;
        } else if (letterCell.status === Status.correctLetter) {
            return `${styles.letter} ${styles.correctLetter}`;
        } else if (letterCell.status === Status.false) {
            return `${styles.letter} ${styles.false}`;
        }
    } else {
        return determineAnimationClassByColumn(col, letterCell.status);
    }
};

const determineAnimationClassByColumn = (col: number, status: Status) => {
    if (status === Status.correctPositon) {
        if (col === 0) {
            return `${styles.letter} ${styles.greenAnimation} ${styles.zero}`;
        }
        if (col === 1) {
            return `${styles.letter} ${styles.greenAnimation} ${styles.one}`;
        }
        if (col === 2) {
            return `${styles.letter} ${styles.greenAnimation} ${styles.two}`;
        }
        if (col === 3) {
            return `${styles.letter} ${styles.greenAnimation} ${styles.three}`;
        }
        if (col === 4) {
            return `${styles.letter} ${styles.greenAnimation} ${styles.four}`;
        }
    }
    if (status === Status.correctLetter) {
        if (col === 0) {
            return `${styles.letter} ${styles.orangeAnimation} ${styles.zero}`;
        }
        if (col === 1) {
            return `${styles.letter} ${styles.orangeAnimation} ${styles.one}`;
        }
        if (col === 2) {
            return `${styles.letter} ${styles.orangeAnimation} ${styles.two}`;
        }
        if (col === 3) {
            return `${styles.letter} ${styles.orangeAnimation} ${styles.three}`;
        }
        if (col === 4) {
            return `${styles.letter} ${styles.orangeAnimation} ${styles.four}`;
        }
    }
    if (status === Status.false) {
        if (col === 0) {
            return `${styles.letter} ${styles.blackAnimation} ${styles.zero}`;
        }
        if (col === 1) {
            return `${styles.letter} ${styles.blackAnimation} ${styles.one}`;
        }
        if (col === 2) {
            return `${styles.letter} ${styles.blackAnimation} ${styles.two}`;
        }
        if (col === 3) {
            return `${styles.letter} ${styles.blackAnimation} ${styles.three}`;
        }
        if (col === 4) {
            return `${styles.letter} ${styles.blackAnimation} ${styles.four}`;
        }
    }
};

export default determineClassForLetter;
