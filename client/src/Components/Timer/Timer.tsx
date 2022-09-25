import { useEffect, useState } from "react";
import styles from "./Timer.module.css";

const Timer = ({timer} : {timer: number}) => {
	const [time, setTime] = useState<number>(timer); //Max time limit
	const [startTimer, setStartTimer] = useState<boolean>(false);


	useEffect(() => {
		let timer = 0; //initialize 
		setStartTimer(true);

		if (time > 0) {
			timer = setTimeout(() => {
				setTime(prevTime => prevTime - 1);
			}, 1000);
		} else {
			clearTimeout(timer);
			setStartTimer(false);
		}
		return () => setStartTimer(false);

	}, [time]);


	return (
		<h1 style={{
			fontSize: "55px",
			fontFamily: "Bebas Neue",
			fontWeight: 400,
			color: (time <= 5 ? "red" : "green" && time <= 10 ? "Orange" : "green")
		}}>
			Timer: {startTimer? time : "Round Over"}</h1>
	);
};

export default Timer;