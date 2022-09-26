import { PrismaClient, Vote } from '@prisma/client';
import { FilteredPlayer, filterPlayerData } from '../Controllers/player';
import io from '../server';
import { getPlayerById } from './player';
import { getRoundById } from './round';
const prisma = new PrismaClient();

type VoteResults = {
  result: 'tie' | 'success',
  player: FilteredPlayer | null,
}

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

const emitVoteResult = async (gameId: number, playerId?: number, randomKill?: boolean) => {
  const results: VoteResults = {
    result: (!playerId || randomKill) ? 'tie' : 'success',
    player: null,
  }

  if (playerId) {
    const player = await getPlayerById(playerId);
		const filteredPlayer = await filterPlayerData(player.id, player);
    results.player = filteredPlayer;
  }

  io.in(gameId.toString()).emit('vote_results', results);
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