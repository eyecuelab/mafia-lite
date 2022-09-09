import { Socket } from "socket.io";
import app from "./app";
import { getGameById } from "./Models/game";
import { getPlayersByGameId } from "./Models/player";

/*** Socket setup ***/
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

/**
 *  .on() is an event listener for socket.io
 *  .emit() is to emit data to all sockets listening with the same label
 **/


// let listOfAccused = <Array<number>>[]; //Mock storage, need to replace with controller method later!

/*
	let voteMap = new Map<number, number>();
	listOfAccused.forEach((candidateId) => {
		if (voteMap.has(candidateId)) {
			voteMap.set(candidateId, voteMap.get(candidateId) + 1);
		} else {
			voteMap.set(candidateId, 1);
		}
	});

	return voteMap;
*/

// const countVotes = () => {
//   // return listOfAccused.reduce((acc: any, cur: any) => {
//   //   cur in acc ? acc[cur] = acc[cur] + 1 : acc[cur] = 1
//   //   return acc
//   // }, new Map);
  
//   let voteMap = new Map<number, number>();
// 	listOfAccused.forEach((candidateId) => {
// 		if (voteMap.has(candidateId)) {
// 			let voteCount = voteMap.get(candidateId);
// 			if (!voteCount) {
// 				voteCount = 0;
// 			}

// 			voteMap.set(candidateId, voteCount + 1);
// 		} else {
// 			voteMap.set(candidateId, 1);
// 		}
// 	});

// 	return voteMap;
// }

io.sockets.on('connection', (socket: Socket) => {
  // socket.on('disconnect', () => {
  //   console.log(socket.id + ' socket disconnected');
  // })

  // socket.on("join_room", async (gameId: number) => {
  //   socket.join(`${gameId}`);
  //   console.log(`end of join_room`, gameId)
  // })

  // socket.emit("emit_voting_tally", countVotes(listOfAccused );

  // socket.on("all_votes_casted", () => {
  //   console.log("ALL VOTES CAST")
  // })

	socket.on("join", (gameId: number) => {
		socket.join(gameId.toString());
		console.log(socket.id + " joined " + gameId);
	});

});
export default io;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
)