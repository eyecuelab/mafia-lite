import { useEffect, useState } from "react";

const Timer = ({timer} : {timer: number}) => {
	console.log(timer);
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
			console.log("timer off");
		}
		return () => setStartTimer(false);

	}, [time]);

	console.log(time);

	return (
		<div className={"timer"} >
			<h1>{startTimer ? time : "Time over"}</h1>
		</div>
	);
};

export default Timer;