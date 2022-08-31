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

io.on('connection', (socket: any) => {

  socket.on('disconnect', () => {
    console.log('socket disconnected')
  })

  socket.on("join_room", async (gameId: number) => {
    const playersInRoom = await getPlayersByGameId(gameId);
    socket.join(gameId)
    socket.to(gameId).emit("get_players_in_room", playersInRoom) //sends players in room data to front
    socket.to(gameId).emit("player_joined_msg", `player joined room ${gameId}`)
  })

  socket.on("new_game_clicked", ({ user, gameId, socketId }: { user: object, gameId: number, socketId: number }) => {
    socket.emit("new_game_start", { user: user, gameId: gameId, socketId: socketId });
  })

});
export default io;

const port = 3000;
server.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
)