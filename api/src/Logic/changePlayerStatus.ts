import { Player } from "@prisma/client";
import { getJailedPlayer, getPlayerById, updatePlayerStatus, getLivingPlayersByGameId } from "../Models/player";
import { getRoleById } from "../Models/role";
import { getCurrentRoundByGameId } from "../Models/round";
import Utility from "../Logic/Utility";

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

const randomlyKillPlayer = async (gameId: number) => {
	const players = await getLivingPlayersByGameId(gameId);
	const eligiblePlayers = players.filter((player : Player) => {
		return player.status !== "jailed"
	})
	const shuffledPlayers = Utility.shuffleArray(eligiblePlayers);
	updatePlayerStatus(shuffledPlayers[0].id, "murdered")
	return shuffledPlayers[0];
}

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

export { updateEndOfRoundStatus, unjailPrevJailedPlayer, randomlyKillPlayer };