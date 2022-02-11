import { ShareButtonProps } from "../interfaces/interfaces";
import styles from "../styles/Scores.module.css";

const ShareButton = ({ message }: ShareButtonProps) => {
    const handleClick = () => {
        console.log(message.split(""));
        navigator.clipboard.writeText(message);
    };
    return (
        <button className={styles.shareButton} onClick={handleClick}>
            Teilen
        </button>
    );
};

export default ShareButton;
