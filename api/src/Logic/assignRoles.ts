import { getRolesbyType } from "../Models/role";
import Utility from "./Utility";

const investCultRatio = 3;

async function assignRoles(numPlayers: number): Promise<number[]> {
	const cultRoles = await getRolesbyType("cultist");
	const investRoles = await getRolesbyType("investigator");

	let roleAssignments: number[] = [];
	for (let i = 0; i < numPlayers; i++) {
		if (i % investCultRatio === 0) {
			roleAssignments.push(getRandomRole(cultRoles).id);
		} else {
			roleAssignments.push(getRandomRole(investRoles).id);
		}
	}

	return Utility.shuffleArray(roleAssignments);
}

function getRandomRole(roles: any[]) {
	return roles[Utility.getRandomRange(0, roles.length)];
}



export default assignRoles;
