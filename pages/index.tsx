import { useState } from "react";
import Instructions from "../Components/Instructions";
import WordGame from "../Components/WordGame";
import styles from "../styles/Home.module.css";

const Home = () => {
    const [instructionsActive, setInstructionsActive] = useState(false);

    return (
        <div className={styles.home}>
            <div className={styles.headerSection}>
                <div onClick={() => setInstructionsActive((prev) => !prev)}>
                    <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="12.5"
                            cy="12.5"
                            r="11.5"
                            stroke="white"
                            strokeOpacity="0.9"
                            strokeWidth="2"
                        />
                        <path
                            d="M11.5293 19.18C11.0893 19.18 10.7626 19.06 10.5493 18.82C10.336 18.58 10.2226 18.2467 10.2093 17.82C10.196 17.38 10.2693 16.8733 10.4293 16.3L11.2493 13.42C11.4493 12.74 11.5626 12.2467 11.5893 11.94C11.6293 11.6333 11.556 11.44 11.3693 11.36C11.196 11.28 10.8893 11.24 10.4493 11.24C10.436 11.0933 10.436 10.96 10.4493 10.84C10.476 10.7067 10.516 10.5867 10.5693 10.48C10.7826 10.4533 11.036 10.3933 11.3293 10.3C11.636 10.2067 11.9293 10.1 12.2093 9.98C12.4893 9.86 12.7093 9.75333 12.8693 9.66C13.2826 9.83333 13.5293 10.1267 13.6093 10.54C13.7026 10.94 13.636 11.5533 13.4093 12.38L12.3093 16.24C12.1226 16.8933 12.0426 17.3133 12.0693 17.5C12.1093 17.6867 12.2226 17.78 12.4093 17.78C12.5426 17.78 12.696 17.7333 12.8693 17.64C13.056 17.5467 13.2493 17.4 13.4493 17.2C13.556 17.2667 13.636 17.3533 13.6893 17.46C13.756 17.5667 13.796 17.6933 13.8093 17.84C13.4226 18.2533 13.036 18.58 12.6493 18.82C12.276 19.06 11.9026 19.18 11.5293 19.18ZM13.2693 7.46C12.9493 7.46 12.7093 7.35333 12.5493 7.14C12.4026 6.91333 12.3626 6.62667 12.4293 6.28C12.5093 5.90667 12.6693 5.61333 12.9093 5.4C13.1493 5.17333 13.4226 5.06 13.7293 5.06C14.0626 5.06 14.3093 5.17333 14.4693 5.4C14.6293 5.61333 14.6693 5.90667 14.5893 6.28C14.5226 6.62667 14.3693 6.91333 14.1293 7.14C13.8893 7.35333 13.6026 7.46 13.2693 7.46Z"
                            fill="white"
                            fillOpacity="0.9"
                        />
                    </svg>
                </div>
                <h1 className={styles.header}>Wortspiel</h1>
            </div>
            <WordGame />
            {instructionsActive && (
                <Instructions
                    handleClick={() => setInstructionsActive(false)}
                />
            )}
        </div>
    );
};

export default Home;
