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

const stylesDict = {
    0: styles.zero,
    1: styles.one,
    2: styles.two,
    3: styles.three,
    4: styles.four,
    5: styles.five,
};

const determineAnimationClassByColumn = (col: number, status: Status) => {
    if (status === Status.correctPositon) {
        return `${styles.letter} ${styles.greenAnimation} ${
            stylesDict[col as keyof typeof stylesDict]
        }`;
    }
    if (status === Status.correctLetter) {
        return `${styles.letter} ${styles.orangeAnimation} ${
            stylesDict[col as keyof typeof stylesDict]
        }`;
    }
    if (status === Status.false) {
        return `${styles.letter} ${styles.blackAnimation} ${
            stylesDict[col as keyof typeof stylesDict]
        }`;
    }
};

export default determineClassForLetter;
