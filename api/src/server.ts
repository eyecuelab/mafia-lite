import { Socket } from "socket.io";
import app from "./app";

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