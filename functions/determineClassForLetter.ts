import { LetterCell, Status } from "../interfaces/interfaces";
import styles from "../styles/WordGame.module.css";

const determineClassForLetter = (
    letterCell: LetterCell,
    row: number,
    col: number,
    animationRowNumber: number
) => {
    if (letterCell.letter === "0") {
        return `${styles.letter} ${styles.empty}`;
    }
    if (letterCell.status === Status.neutral) {
        return `${styles.letter} ${styles.neutral}`;
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
        if (letterCell.status === Status.correctPositon) {
            if (row === animationRowNumber && col === 0) {
                return `${styles.letter} ${styles.greenAnimation} ${styles.zero}`;
            }
            if (row === animationRowNumber && col === 1) {
                return `${styles.letter} ${styles.greenAnimation} ${styles.one}`;
            }
            if (row === animationRowNumber && col === 2) {
                return `${styles.letter} ${styles.greenAnimation} ${styles.two}`;
            }
            if (row === animationRowNumber && col === 3) {
                return `${styles.letter} ${styles.greenAnimation} ${styles.three}`;
            }
            if (row === animationRowNumber && col === 4) {
                return `${styles.letter} ${styles.greenAnimation} ${styles.four}`;
            }
        }
        if (letterCell.status === Status.correctLetter) {
            if (row === animationRowNumber && col === 0) {
                return `${styles.letter} ${styles.orangeAnimation} ${styles.zero}`;
            }
            if (row === animationRowNumber && col === 1) {
                return `${styles.letter} ${styles.orangeAnimation} ${styles.one}`;
            }
            if (row === animationRowNumber && col === 2) {
                return `${styles.letter} ${styles.orangeAnimation} ${styles.two}`;
            }
            if (row === animationRowNumber && col === 3) {
                return `${styles.letter} ${styles.orangeAnimation} ${styles.three}`;
            }
            if (row === animationRowNumber && col === 4) {
                return `${styles.letter} ${styles.orangeAnimation} ${styles.four}`;
            }
        }
        if (letterCell.status === Status.false) {
            if (row === animationRowNumber && col === 0) {
                return `${styles.letter} ${styles.blackAnimation} ${styles.zero}`;
            }
            if (row === animationRowNumber && col === 1) {
                return `${styles.letter} ${styles.blackAnimation} ${styles.one}`;
            }
            if (row === animationRowNumber && col === 2) {
                return `${styles.letter} ${styles.blackAnimation} ${styles.two}`;
            }
            if (row === animationRowNumber && col === 3) {
                return `${styles.letter} ${styles.blackAnimation} ${styles.three}`;
            }
            if (row === animationRowNumber && col === 4) {
                return `${styles.letter} ${styles.blackAnimation} ${styles.four}`;
            }
        }
    }
};

export default determineClassForLetter;
