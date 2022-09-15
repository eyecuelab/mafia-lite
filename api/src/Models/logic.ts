import { FilteredPlayer, filterPlayersData } from '../Controllers/player';
import io from '../server';
import { getLivingPlayersByGameId, getPlayersInGameByTeam } from './player';
import { getRoleById } from './role';

const emitStartNight = (gameId: number) => {
	io.in(gameId.toString()).emit('start_night');
}

const emitStartDay = (gameId: number) => {
	io.in(gameId.toString()).emit('start_day');
}

const checkEndConditions = async (gameId: number) => {
	const livingPlayers = await getLivingPlayersByGameId(gameId);
	const roleIds = livingPlayers.map((player) => player.roleId);

	let numCultists = 0;
	for (let i = 0; i < roleIds.length; i++) {
		const role = await getRoleById(roleIds[i]);
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
		return { gameOver };
	}
}

const emitEndGame = (gameId: number, cultistsWin: boolean, winners: FilteredPlayer[]) => {
	io.in(gameId.toString()).emit('end_game', cultistsWin, winners );
}

export { emitStartNight, emitStartDay, checkEndConditions, emitEndGame };