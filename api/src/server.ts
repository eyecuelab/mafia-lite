import { Socket } from "socket.io";
import app from "./app";
import { setPlayerSocketId, getPlayerBySocketId, changeConnectionStatus, getPlayerById } from "./Models/player";
import { reassignHost, getAllGameDetails, deletePlayerFromGame, getGameById } from "./Models/game";

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
  try {
		setPlayerSocketId(playerId, socket.id);
		if (socket.rooms.size > 0) {
			const rooms = getSocketRooms(socket);
			rooms.forEach((room) => {
				socket.leave(room);
			});
		}
		socket.join(gameId.toString());
	} catch (error) {
		console.log(error instanceof Error ? error.message : error);
	}
}

io.sockets.on('connection', (socket: Socket) => {
	socket.on("join", (gameId: number, playerId: number)  => {
			handleJoinGame(socket, gameId, playerId);
	});

	socket.on('leave_game', (gameId: number) => {
		socket.leave(gameId.toString());
	});

	socket.on("reconnect", async (gameId: number, playerId: number) => {
		handleJoinGame(socket, gameId, playerId);
		await changeConnectionStatus(playerId, true)
		socket.in(gameId.toString()).emit('game_player_disconnect');
});

	socket.on("disconnect", async () => {
		console.log("disconnect", socket.id);
		const player = await getPlayerBySocketId(socket.id);
		if (player) {
			const disconnectedPlayer = await changeConnectionStatus(player.id, player.isDisconnected);
			const game = await getAllGameDetails(player.gameId);
			if (game) {
				if (player.isHost &&  game.players.length > 1) {
					setTimeout(async () => {
						const refreshedPlayer = await getPlayerById(player.id);
						try {
							const refreshedGame = await getGameById(game.id);
							if ((!refreshedPlayer || refreshedPlayer.isDisconnected) && refreshedGame) {
								const newHost = await reassignHost(refreshedGame.id, player.id);
								socket.in(player.gameId.toString()).emit('lobby_host_change', newHost.name);
							}
						} catch (error) {
							console.log(error instanceof Error ? error.message : error);
						}
					}, 5500);
				}
				if(game.rounds.length === 0) {
					socket.in(player.gameId.toString()).emit('player_left_chat', player.name);
					socket.in(player.gameId.toString()).emit('player_left', player.id);

					setTimeout(async () => {
						const refreshedPlayer = await getPlayerById(player.id);
						if (!refreshedPlayer || refreshedPlayer.isDisconnected) {
							await deletePlayerFromGame(refreshedPlayer.id);
						}
					}, 5000);
				} else {
					socket.in(player.gameId.toString()).emit('game_player_disconnect');
					socket.in(player.gameId.toString()).emit('game_player_disconnect_chat', disconnectedPlayer.name);
				}
			} else {
				socket.in(player.gameId.toString()).emit('game_player_disconnect');
				socket.in(player.gameId.toString()).emit('game_player_disconnect_chat', disconnectedPlayer.name);
			}
		}
	});

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

	socket.on("vc_message", (message: { target: number, type: string, data: any }) => {
		const { target, type } = message;
		console.log("vc_message: ", type, socket.id);
		if (message && target && type) {
			socket.to(target.toString()).emit(type, message);
		}
	});
});

export default io;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
)