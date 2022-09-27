const Timer = ({timeRemaining} : {timeRemaining: number}) => {

	return (
		<h1 style={{
			fontSize: "55px",
			fontFamily: "Bebas Neue",
			fontWeight: 400,
			padding: 0,
			margin: 0,
			color: (timeRemaining <= 5 ? "red" : "green" && timeRemaining <= 10 ? "Orange" : "green")
		}}>
			Timer: {timeRemaining || "Round Over"}</h1>
	);
};

export default Timer;