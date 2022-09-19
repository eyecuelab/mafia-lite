import React, { useState } from "react";
import { GameData, Player } from "../../Types/Types";
import { GhostFrame, GhostImages } from "../../assets/images/Images";
import GenericButton from "../../Components/GenericButton";
import { useModal } from "../../ModalContext";
import { getData, postData } from "../../ApiHelper";
import { useMutation, useQuery } from "@tanstack/react-query";

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

	return (
		<React.Fragment>
			<div style={{ background: `url(${GhostFrame})`, width: "100%" }}>
				{data && isNight && <p>Target: {data.name}</p>}
				<img src={images[imageIndex]} />
				{showControls && <div>
					{imageIndex > 0 && <GenericButton
						onClick={() => { setImageIndex(imageIndex - 1); }}
						text={"<-"}
					/>}
					{imageIndex < (images.length - 1) && <GenericButton
						onClick={() => { setImageIndex(imageIndex + 1); }}
						text={"->"}
					/>}
					{isNight && <GenericButton
						onClick={() => { ghostImageMutation.mutate({ imgIndex: imageIndex }); }}
						text={"Send"}
					/>}
				</div>}
			</div>
		</React.Fragment>
	);
};

export default GhostView;