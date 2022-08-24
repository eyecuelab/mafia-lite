import app from "./app";

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

    //Tell client what to listen for
    socket.emit("startGame");

    //When client emits a "startGame", join a room, and emit to client the room.id
    socket.on("newGameClicked", ({ userId, roomId }: { userId: object, roomId: string }) => {
      socket.join(roomId)
      console.log("new game started", userId, roomId)
      socket.emit("newGameStart", userId)
    })
  });
});

const port = 3000;
server.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
)