import { getRolesbyType } from "../Models/role";
import Utility from "./Utility";

const investCultRatio = 3;

async function assignRoles(numPlayers: number): Promise<number[]> {
	const cultRoles = await getRolesbyType("cultist");
	console.log("🚀 ~ file: assignRoles.ts ~ line 8 ~ assignRoles ~ cultRoles", cultRoles)
	const investRoles = await getRolesbyType("investigator");
	console.log("🚀 ~ file: assignRoles.ts ~ line 10 ~ assignRoles ~ investRoles", investRoles)

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
