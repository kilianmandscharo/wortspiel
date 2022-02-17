import { InstructionProps } from "../interfaces/interfaces";
import styles from "../styles/Instructions.module.css";
import BackButton from "./BackButton";

const Instructions = ({ handleClick }: InstructionProps) => {
    return (
        <div className={styles.backDrop} onClick={handleClick}>
            <div className={styles.instructions}>
                <h1 className={styles.header}>Anleitung</h1>
                <div className={styles.close}>
                    <BackButton />
                </div>
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
                    Orange bedeutet, dass M zwar im Wort enthalten ist, jedoch
                    an anderer Stelle.
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
                <div className={styles.text} style={{ marginBottom: "-0.4em" }}>
                    Grün bedeutet, dass L richtig im Wort positioniert wurde.
                    Die dunkel hinterlegten Felder markieren in beiden
                    Beispielen die Buchstaben, die nicht im gesuchten Wort
                    enthalten sind.
                </div>
                <footer className={styles.footer}>
                    This is a private project. Code by{" "}
                    <a
                        href="https://github.com/kilianmandscharo"
                        target="blank"
                        className={styles.a}
                    >
                        Dominik Heller
                    </a>
                    , based on the idea for WORDLE by{" "}
                    <a
                        href="https://twitter.com/powerlanguish"
                        target="blank"
                        className={styles.a}
                    >
                        Josh Wardle.
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default Instructions;
