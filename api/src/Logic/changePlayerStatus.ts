import { Player } from "@prisma/client";
import { getJailedPlayer, getPlayerById, updatePlayerStatus } from "../Models/player";
import { getRoleById } from "../Models/role";
import { getCurrentRoundByGameId } from "../Models/round";

const getSentence = async (player: Player, phase: string) => {
	const role = await getRoleById(player.roleId);
	if (!role) {
		throw new Error("Role not found");
	}

	if (phase === "night") {
		return "murdered";
	}

	switch (role.type) {
		case "cultist": return "terminated";
		case "investigator": return "jailed";
		default: throw new Error("Unknown role type");
	}
};

const updateEndOfRoundStatus = async (gameId: number, accusedId: number) => {
	const round = await getCurrentRoundByGameId(gameId);
	if (round.currentPhase === "day") {
		await unjailPrevJailedPlayer(gameId);
	}
	
	const accused = await getPlayerById(accusedId);
	const sentence = await getSentence(accused, round.currentPhase);
	const updatedPlayer = await updatePlayerStatus(accused.id, (sentence));

	return { updatedPlayer, sentence };
}

const unjailPrevJailedPlayer = async (gameId: number) => {
	const prevJailedPlayer = await getJailedPlayer(gameId);
	if (prevJailedPlayer) {
		updatePlayerStatus(prevJailedPlayer.id, "alive");
	}
}

export { updateEndOfRoundStatus, unjailPrevJailedPlayer };