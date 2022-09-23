import { Trait } from "@prisma/client";
import Utility from "./Utility";

/**
 * Assumes traits id's are not changed from how they are seeded, i.e. from one to the number of traits.
 * @param traits
 * @param numPlayers number of players in the game
 * @param numMaxRepeat number of times trait can be assigned in a game (2 if not specified) (Must be >= 2)
 * @param numTraitsPerPlayer number of traits assigned to a player
 * @returns Array of arrays with trait id's
 */
const getTraitsForGame = (traits: Trait[], numPlayers: number, numMaxRepeat?: number, numTraitsPerPlayer?: number) => {
	const numRepeat = numMaxRepeat ?? 2;
	const traitsPerPlayer = numTraitsPerPlayer ?? 3;
	if (numPlayers < 1 || numRepeat < 2 || traitsPerPlayer < 1) {
		throw new Error("Passed argument(s) below allowed minimum");
	} else if ((traits.length * numRepeat) < (numPlayers * traitsPerPlayer)) {
		throw new Error("Not enough traits to assign to players");
	}

	let usedTraits = new Map<number, number>();
	let assignedTraits: number[][] = [];

	for (let i = 0; i < numPlayers; i++) {
		assignedTraits[i] = []
		for (let j = 0; j < traitsPerPlayer; j++) {
			let traitIndex = Utility.getRandomRange(0, traits.length);
			let traitId = traits[traitIndex].id;
      while (assignedTraits[i].includes(traitId)) {
				traitIndex = Utility.getRandomRange(0, traits.length);
        traitId = traits[traitIndex].id;
      }
      
			if (usedTraits.has(traitId)) {
				const newCount = (usedTraits.get(traitId))! + 1;
				usedTraits.set(traitId, newCount);
				if (newCount >= numRepeat) {
					traits = Utility.removeElementFromArray(traits, traitIndex);
				}
			} else {
				usedTraits.set(traitId, 1);
			}
			assignedTraits[i][j] = traitId;
		}
	}

	return assignedTraits;
}



export { getTraitsForGame };