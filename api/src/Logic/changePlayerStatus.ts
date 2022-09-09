import { Player } from "@prisma/client";
import { getJailedPlayer, updatePlayerStatus } from "../Models/player";
import { getRoleById } from "../Models/role";

const getSentence = async (player: Player) => {
	const role = await getRoleById(player.roleId);
	if (!role) {
		throw new Error("Role not found");
	}

	switch (role.type) {
		case "cultist": return "terminated";
		case "investigator": return "jailed";
		default: throw new Error("Unknown role type");
	}
};

const updateEndOfRoundStatus = async (gameId: number, accused: Player) => {
	const prevJailedPlayer = await getJailedPlayer(gameId);
	if (prevJailedPlayer) {
		updatePlayerStatus(prevJailedPlayer.id, "alive");
	}
	
	const sentence = await getSentence(accused);
	const player = await updatePlayerStatus(accused.id, (sentence));

	return { player, sentence };
}

export { updateEndOfRoundStatus };