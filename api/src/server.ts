import app from "./app";
import { getGameById } from "./Models/game";

/*** Socket setup ***/
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket: any) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('socket closed');
  })

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId)
    socket.to(roomId).emit('message', `player joined room ${roomId}`)
  })

  //When client emits a "startGame", join a room, and emit to client the room.id
  socket.on("new_game_clicked", ({ user, roomId, socketId }: { user: object, roomId: string, socketId: number }) => {
    console.log("new game started, room ID:", user, roomId, socketId)
    socket.emit("new_game_start", { user: user, roomId: roomId, socketId: socketId });
    socket.join(roomId)
  })

});

const port = 3000;
server.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
)