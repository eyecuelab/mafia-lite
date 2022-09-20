import React, { useState } from "react";
import { GameData, Player } from "../../Types/Types";
import { GhostFrame, GhostImages } from "../../assets/images/Images";
import GenericButton from "../../Components/GenericButton";
import { useModal } from "../../ModalContext";
import { getData, postData } from "../../ApiHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "./GhostView.module.css";

const sendGhostImage = (imgIndexPayload: {imgIndex: number}) => postData("/image", imgIndexPayload);
const getGhostTarget = (): Promise<Player> => getData("/image");

const GhostView = ({ gameData }: { gameData: GameData }) => {
	const { callModal } = useModal();
	const [imageIndex, setImageIndex] = useState(0);
	const [showControls, setShowControls] = useState(true);
	const { isLoading, error, data } = useQuery(["ghost"], getGhostTarget);

	const ghostImageMutation = useMutation(sendGhostImage, {
		onSuccess: () => {
			setShowControls(false);
		},
		onError: (error) => {
			if (error instanceof Error) {
				callModal(error.message);
			}
		}
	});

	const filterImages = (ghostImages: string[], indices: number[]) => {
		return ghostImages.filter((image, index) => indices.includes(index));
	};

	const isNight = gameData.currentRound.currentPhase === "night";
	const images = isNight ? GhostImages : filterImages(GhostImages, gameData.ghostImages);

	const targetName = data && isNight ? `Target: ${data.name}` : null;

	return (
		<React.Fragment>
			<div className={styles.ghostViewContainer}>
				{<p className={styles.targetName}>{targetName}</p>}
				<img className={styles.ghostImage} src={images[imageIndex]} />
				{showControls && <div className={styles.ghostButtonControl}>
					{imageIndex > 0 && <GenericButton
						className={styles.arrowButton}
						onClick={() => { setImageIndex(imageIndex - 1); }}
						text={"<-"}
					/>}
					{isNight && <GenericButton
						className={styles.sendButton}
						onClick={() => { ghostImageMutation.mutate({ imgIndex: imageIndex }); }}
						text={"Send"}
					/>}
					{imageIndex < (images.length - 1) && <GenericButton
						className={styles.arrowButton}
						onClick={() => { setImageIndex(imageIndex + 1); }}
						text={"->"}
					/>}
					
				</div>}
			</div>
		</React.Fragment>
	);
};

export default GhostView;