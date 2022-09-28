import { PrismaClient, Vote } from '@prisma/client';
import { filterPlayerData } from '../Controllers/player';
import io from '../server';
import { getPlayerById } from './player';
import { getRoundById } from './round';
const prisma = new PrismaClient();

const playerVote = async (gameId: number, phase: string, candidateId: number, voterId: number, roundNumber: number) => {
	const oldVote = await prisma.vote.findFirst({
		where: {
			gameId: gameId,
			roundNumber: roundNumber,
			voterId: voterId,
			phase: phase
		}
	});

	let vote: Vote;
	if (oldVote) {
		vote = await prisma.vote.update({
			where: {
				gameId_roundNumber_voterId_phase: {
					gameId: gameId,
					roundNumber: roundNumber,
					voterId: voterId,
					phase: phase
				}
			},
			data: {
				candidateId: candidateId,
			}
		});

		const oldVoteTally = await prisma.vote.count({
			where: {
				gameId: gameId,
				candidateId: oldVote.candidateId,
				roundNumber: roundNumber,
				phase: phase
			}
		});

		io.in(gameId.toString()).emit('vote_cast', oldVote.candidateId, oldVoteTally);
	} else {
		vote = await prisma.vote.create({
			data:{
				gameId: gameId,
				roundNumber: roundNumber,
				voterId: voterId,
				candidateId: candidateId,
				phase: phase
			}
		});
	}

  const newVoteTally = await prisma.vote.count({
    where: {
			gameId: gameId,
			candidateId: candidateId,
			roundNumber: roundNumber,
			phase: phase
    }
  });

	io.in(gameId.toString()).emit('vote_cast', candidateId, newVoteTally);

	return vote;
}

const emitVoteResult = async(gameId: number, playerId?: number, randomKill?: boolean) => {
  if (!playerId) {
		io.in(gameId.toString()).emit('vote_results_tie');
		io.in(gameId.toString()).emit('vote_results_tie_chat');
  } else if(randomKill) {
    const player = await getPlayerById(playerId);
		const filteredPlayer = await filterPlayerData(player.id, player);
		io.in(gameId.toString()).emit('vote_results_tie_night', filteredPlayer);
		io.in(gameId.toString()).emit('vote_results_chat_tie_night', filteredPlayer.name, filteredPlayer.team);
  } else {
		const player = await getPlayerById(playerId);
		const filteredPlayer = await filterPlayerData(player.id, player);
		io.in(gameId.toString()).emit('vote_results', filteredPlayer);
		io.in(gameId.toString()).emit('vote_results_chat', filteredPlayer.name, filteredPlayer.status);
  }
}

const getAllVotes = async (gameId: number, roundId: number, phase: string) => {
  const round = await getRoundById(roundId)
  return await prisma.vote.findMany({
    where :{
      gameId : Number(gameId),
      roundNumber : round.roundNumber,
      phase : phase
    }
  })
}

export { playerVote, getAllVotes, emitVoteResult };