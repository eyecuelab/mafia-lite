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


let listOfAccused = <Array<number>>[]; //Mock storage, need to replace with controller method later!

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

  socket.on("accuse_player", (accusation: number) => { //Emit client selection to server
    console.log(accusation)
    listOfAccused.push(accusation) //dev/test only, will change! Aggregate client selection on server

    console.log(`listOfAcc`, listOfAccused)
    let counted = countVotes();

    socket.emit("update_accused_players", { listOfAccused, counted }) //Broadcast accused player to client
    //socket.on(`end_of_day`, () => accusedPlayers.splice(0); )

  })

  const countVotes = () => {
    return listOfAccused.reduce((acc: any, cur: any) => {
      cur in acc ? acc[cur] = acc[cur] + 1 : acc[cur] = 1
      return acc
    }, {});
  }

});
export default io;

const port = 3000;
server.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
)