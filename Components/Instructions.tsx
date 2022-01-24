import { Dispatch, SetStateAction } from "react";
import styles from "../styles/Instructions.module.css";

interface InstructionProps {
    handleClick: () => void;
}

const Instructions = ({ handleClick }: InstructionProps) => {
    return (
        <div className={styles.instructions} onClick={handleClick}>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1="0.646447"
                    y1="18.7886"
                    x2="18.3241"
                    y2="1.11091"
                    stroke="white"
                    strokeOpacity="0.9"
                />
                <line
                    x1="1.35355"
                    y1="0.646447"
                    x2="19.0312"
                    y2="18.3241"
                    stroke="white"
                    strokeOpacity="0.9"
                />
            </svg>

            <div className={styles.text}>
                Das gesuchte Wort besteht aus fünf Buchstaben. Errate es in
                sechs Versuchen. Jeder Rateversuch bringt neue Hinweise,
                dargestellt durch verschiedene Farben.
            </div>
            {["B", "Ä", "U", "M", "E"].map((letter, i) => (
                <div
                    className={
                        i === 3
                            ? `${styles.letter} ${styles.correctLetter}`
                            : styles.letter
                    }
                    key={`0 ${i}`}
                >
                    {letter}
                </div>
            ))}
            <div className={styles.text}>
                Orange bedeutet, dass M zwar im Wort enthalten ist, jedoch an
                anderer Stelle.
            </div>
            {["L", "E", "E", "R", "E"].map((letter, i) => (
                <div
                    className={
                        i === 0
                            ? `${styles.letter} ${styles.correctPosition}`
                            : styles.letter
                    }
                    key={`1 ${i}`}
                >
                    {letter}
                </div>
            ))}
            <div className={styles.text}>
                Grün bedeutet, dass L richtig im Wort positioniert wurde. Die
                dunkel hinterlegten Felder markieren in beiden Beispielen die
                Buchstaben, die nicht im gesuchten Wort enthalten sind.
            </div>
        </div>
    );
};

export default Instructions;
