export default function indexForTodayTest() {
    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}` : i;
        const date = `31 Mar 2022 ${hour}:00:00`;
        console.log(date, getIndexForTodaysWordTest(date));
    }
}

const getIndexForTodaysWordTest = (today: string) => {
    const now = new Date(today);
    const start = new Date("11 Feb 2022 23:00:00");
    const listLength = 1237;
    return (
        Math.floor((now.getTime() - start.getTime()) / 1000 / 60 / 60 / 24) %
        listLength
    );
};
