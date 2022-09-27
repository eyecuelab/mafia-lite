import { Socket } from "socket.io";
import app from "./app";
import { setPlayerSocketId, getPlayerBySocketId, changeConnectionStatus } from "./Models/player";
import { reassignHost, getAllGameDetails, deletePlayerFromGame } from "./Models/game";

/*** Socket setup ***/
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
			'http://localhost:5173',
			'https://nameless-terror-client.fly.dev',
			'https://nameless-terror-api.fly.dev',
		],
    methods: ['GET', 'POST']
  }
});

const getSocketRooms = (socket: Socket) => {
	let rooms: string[] = [];
	socket.rooms.forEach((room) => {
		if (room !== socket.id) {
			rooms.push(room);
		}
	});

	return rooms;
};
const handleJoinGame = (socket: any, gameId: number, playerId: any) => {
  console.log("join game", socket.id);
  setPlayerSocketId(playerId, socket.id);
  if (socket.rooms.size > 0) {
    const rooms = getSocketRooms(socket);
    rooms.forEach((room) => {
      socket.leave(room);
    });
  }
  socket.join(gameId.toString());
}
io.sockets.on('connection', (socket: Socket) => {
	socket.on("join", (gameId: number, playerId: number)  => {
			handleJoinGame(socket, gameId, playerId);
	});

	socket.on("leave_game", (gameId: number) => {
		console.log("Leave Game Hit", gameId);
		// io.socketsLeave(gameId.toString());
		socket.leave(gameId.toString());
		// const rooms = getSocketRooms(socket);
	});

	socket.on("reconnect", async (gameId: number, playerId: number) => {
		console.log(gameId);
		console.log(playerId);
		console.log("reconnecting");
		handleJoinGame(socket, gameId, playerId);
		await changeConnectionStatus(playerId, true)
		socket.in(gameId.toString()).emit('game_player_disconnect');
  })

	socket.on("disconnect", async () => {
		console.log("disconnect", socket.id);
		const player = await getPlayerBySocketId(socket.id);
		if(player) {
			const disconnectedPlayer = await changeConnectionStatus(player.id, player.isDisconnected);
			const game = await getAllGameDetails(player.gameId);
			if(game) {
				if(player.isHost &&  game.players.length > 1) {
					const newHost = await reassignHost(player.gameId, player.id);
					socket.in(player.gameId.toString()).emit('lobby_host_change', newHost.name);
				}
				if(game.rounds.length === 0) {
					deletePlayerFromGame(player.id);
					socket.in(player.gameId.toString()).emit('player_left_chat', player.name);
					socket.in(player.gameId.toString()).emit('player_left', player.id);
				}else {
					socket.in(player.gameId.toString()).emit('game_player_disconnect');
					socket.in(player.gameId.toString()).emit('game_player_disconnect_chat', disconnectedPlayer.name);
				}
			}else {
				socket.in(player.gameId.toString()).emit('game_player_disconnect');
				socket.in(player.gameId.toString()).emit('game_player_disconnect_chat', disconnectedPlayer.name);
			}
		}
	})
	socket.on("start_new_game", () => {
		const rooms = getSocketRooms(socket);
		console.log("starting game...");
		if (rooms.length !== 1) { 
			if (rooms.length === 0)
				throw new Error("Start game on unassigned socket");
			else
				throw new Error("Socket joined multiple games");
		} else {
			io.in(rooms[0]).emit("game_start");
		}
	});

	/************************** Voice Chat **************************/

	socket.on("vc_message", (message: { target: number, type: string, data: any }) => {
		const { target, type } = message;
		console.log("vc_message: ", type, socket.id);
		socket.to(target.toString()).emit(type, message);
	});
});

export default io;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
)