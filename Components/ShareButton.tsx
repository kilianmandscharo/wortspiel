import { MouseEvent } from "react";
import { ShareButtonProps } from "../interfaces/interfaces";
import styles from "../styles/Scores.module.css";

const ShareButton = ({ message, setCopied }: ShareButtonProps) => {
    const handleClick = (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        e.stopPropagation();
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };
    return (
        <button className={styles.shareButton} onClick={handleClick}>
            Teilen
        </button>
    );
};

export default ShareButton;
