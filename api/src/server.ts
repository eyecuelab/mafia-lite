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
		socket.join(gameId.toString());
		console.log(socket.id + " joined " + gameId);
	});

	socket.on("start_new_game", () => {
		const rooms = getSocketRooms(socket);
		if (rooms.length !== 1) { 
			if (rooms.length === 0)
				throw new Error("Start game on unassigned socket");
			else
				throw new Error("Socket joined multiple games");
		} else {
			io.in(rooms[0]).emit("game_start");
		}
	});
});
export default io;

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
)