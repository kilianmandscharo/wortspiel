import { useEffect, useState } from "react";
import styles from "../styles/Timer.module.css";

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(1);

    useEffect(() => {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const differenceInSeconds = Math.round(
            (tomorrow.getTime() - now.getTime()) / 1000
        );
        setTimeLeft(differenceInSeconds);

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div className={styles.timer}>New game in: {parseTime(timeLeft)}</div>
    );
};

const parseTime = (time: number) => {
    let seconds: number | string = time;
    let hours: number | string = Math.floor(seconds / 60 / 60);
    seconds -= hours * 3600;
    let minutes: number | string = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
};

export default Timer;
