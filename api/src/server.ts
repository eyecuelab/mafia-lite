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
  console.log('a user connected');
});
/***/


const port = 3000;
server.listen(port, () => //Change server to app to toggle between REST and web sockets
  console.log(`🚀 Server ready at: http://localhost:3000`)
)