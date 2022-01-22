import WordGame from "../Components/WordGame";
import styles from "../styles/Home.module.css";

const Home = () => {
    return (
        <div className={styles.home}>
            <h1 className={styles.header}>Wortspiel</h1>
            <WordGame />
        </div>
    );
};

export default Home;
