import styles from "./PlayerStatusOverlay.module.css";

const PlayerStatusOverlay = ({ playerStatus, isMain }: { playerStatus: string, isMain: boolean | null }) => {

	//Pass string to tell which badge to render
	const updatePlayerStatusBadge = (status: string | null) => {

		//Placeholder for now, get array of paths correlated by index
		const arrayOfImages = [
			"assets/The Nameless Terror Images/UI/image\ 104.png",
			"assets/The Nameless Terror Images/UI/image\ 35.png",
			"assets/The Nameless Terror Images/UI/image\ 105.png",
			"assets/The Nameless Terror Images/UI/image\ 180.png"
		];

		//return image by assigned index
		const setImgPath = (badgePath: string) => {
			return <img className={isMain ? styles["main-player-card-badge"] : styles["player-card-badge"]} src={`./src/${badgePath}`} alt={"Player Status Badge"} />;
		};

		//make selection here
		switch (status) {
		case "murdered":
			return setImgPath(arrayOfImages[0]);
		case "accused": //save image
			return setImgPath(arrayOfImages[1]);
		case "jailed":
			return setImgPath(arrayOfImages[2]);
		case "terminated":
			return setImgPath(arrayOfImages[3]);
		default:
			return null;
		}
	};

	return (
		<>
			<div className={isMain ? styles["main-player-status-overlay"] : styles["player-status-overlay"]}>
				{playerStatus && updatePlayerStatusBadge(playerStatus)}
			</div>
		</>
	);
};

export default PlayerStatusOverlay;