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
                return `${styles.letter} ${styles.zeroGreen}`;
            }
            if (row === animationRowNumber && col === 1) {
                return `${styles.letter} ${styles.oneGreen}`;
            }
            if (row === animationRowNumber && col === 2) {
                return `${styles.letter} ${styles.twoGreen}`;
            }
            if (row === animationRowNumber && col === 3) {
                return `${styles.letter} ${styles.threeGreen}`;
            }
            if (row === animationRowNumber && col === 4) {
                return `${styles.letter} ${styles.fourGreen}`;
            }
        }
        if (letterCell.status === Status.correctLetter) {
            if (row === animationRowNumber && col === 0) {
                return `${styles.letter} ${styles.zeroOrange}`;
            }
            if (row === animationRowNumber && col === 1) {
                return `${styles.letter} ${styles.oneOrange}`;
            }
            if (row === animationRowNumber && col === 2) {
                return `${styles.letter} ${styles.twoOrange}`;
            }
            if (row === animationRowNumber && col === 3) {
                return `${styles.letter} ${styles.threeOrange}`;
            }
            if (row === animationRowNumber && col === 4) {
                return `${styles.letter} ${styles.fourOrange}`;
            }
        }
        if (letterCell.status === Status.false) {
            if (row === animationRowNumber && col === 0) {
                return `${styles.letter} ${styles.zeroBlack}`;
            }
            if (row === animationRowNumber && col === 1) {
                return `${styles.letter} ${styles.oneBlack}`;
            }
            if (row === animationRowNumber && col === 2) {
                return `${styles.letter} ${styles.twoBlack}`;
            }
            if (row === animationRowNumber && col === 3) {
                return `${styles.letter} ${styles.threeBlack}`;
            }
            if (row === animationRowNumber && col === 4) {
                return `${styles.letter} ${styles.fourBlack}`;
            }
        }
    }
};

export default determineClassForLetter;
