import { Player } from '@prisma/client';
import { FilteredPlayer, filterPlayersData } from '../Controllers/player';
import Utility from '../Logic/Utility';
import io from '../server';
import { getAlivePlayersByGameId, getLivingPlayersByGameId, getPlayersInGameByTeam } from './player';
import { getRoleById } from './role';

// if you are changing timer change on both Game Index and logic controller

const emitStartNight = (gameId: number) => {
	const timer = 20;
	io.in(gameId.toString()).emit('start_night', timer);
}
console.log("🚀 ~ file: logic.ts ~ line 14 ~ emitStartNight ~ emitStartNight", emitStartNight)

const emitStartDay = (gameId: number, ghostImages: number[]) => {
	const timer = 20;
	io.in(gameId.toString()).emit('start_day', timer);
}
console.log("🚀 ~ file: logic.ts ~ line 19 ~ emitStartDay ~ emitStartDay", emitStartDay)

const emitEndGame = (gameId: number, gameEndData: { cultistsWin: boolean, winners: FilteredPlayer[] }) => {
	io.in(gameId.toString()).emit('end_game', gameEndData );
}

const checkEndConditions = async (gameId: number) => {
	const livingPlayers = await getAlivePlayersByGameId(gameId);

	let numCultists = 0;
	for (let i = 0; i < livingPlayers.length; i++) {
		const role = await getRoleById(livingPlayers[i].roleId);
		if (role?.type === "cultist") {
			numCultists++;
		}
	}

	// return `gameOver = true` if no living cultists or if investigators do not outnumber cultists
	const cultistsWin = numCultists >= (livingPlayers.length - numCultists);
	const investWin = numCultists === 0;
	const gameOver = investWin || cultistsWin;

	if (gameOver) {
		const playersByTeam = await getPlayersInGameByTeam(gameId);
		const winners = cultistsWin ? playersByTeam.cultists : playersByTeam.investigators;

		const filteredWinners = await filterPlayersData(winners[0].id, winners);
		return { gameOver, cultistsWin, winners: filteredWinners }
	} else {
		return null;
	}
}

const getRandomLivingCultist = async (gameId: number): Promise<Player> => {
	const livingPlayers = await getLivingPlayersByGameId(gameId);
	const cultists = [];
	for (let i = 0; i < livingPlayers.length; i++) {
		const role = await getRoleById(livingPlayers[i].roleId);
		if (role?.type === "cultist") {
			cultists.push(livingPlayers[i]);
		}
	}
	const shuffled = Utility.shuffleArray(cultists);
	return shuffled[0];
}

export { emitStartNight, emitStartDay, checkEndConditions, emitEndGame, getRandomLivingCultist };