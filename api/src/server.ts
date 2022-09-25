import { Socket } from "socket.io";
import app from "./app";
import { getPlayerById } from "./Models/player";

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

io.sockets.on('connection', (socket: Socket) => {
	socket.on("join", (gameId: number) => {
		console.log("join game", socket.id);
		console.log("Game id: ", gameId);
		if (socket.rooms.size > 0) {
			const rooms = getSocketRooms(socket);
			rooms.forEach((room) => {
				socket.leave(room);
			});
		}
		socket.join(gameId.toString());
	});

	socket.on("leave_game", (gameId: number) => {
		console.log("Leave Game Hit", gameId);
		console.log(socket.id);
		// io.socketsLeave(gameId.toString());
		socket.leave(gameId.toString());
		const rooms = getSocketRooms(socket);
		console.log(rooms);
	});

	socket.on("disconnect", () => {
		console.log("disconnect", socket.id);
		console.log("disconectRoom", socket.rooms)
	})
	socket.on("start_new_game", () => {
		const rooms = getSocketRooms(socket);
		console.log("starting game...");
		console.log(socket.id);
		console.log(rooms);
		if (rooms.length !== 1) { 
			if (rooms.length === 0)
				throw new Error("Start game on unassigned socket");
			else
				throw new Error("Socket joined multiple games");
		} else {
			io.in(rooms[0]).emit("game_start");
		}
	});
	// socket.on("send_chat", async (playerId: number, message: string) => {
	// 	// console.log("SEND CHAT HIT");
	// 	// console.log("message", message);
	// 	// console.log("playerId", playerId);
	// 	const player = await getPlayerById(playerId);
	// 	// console.log("player-name", player.name);
	// 	// let clientMessage = `${player.name} : ${message}`
	// 	console.log(player.id);
	// 	io.in(player.gameId.toString()).emit("all_chat_message", message, player);
	// })
	
});

export default io;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
)