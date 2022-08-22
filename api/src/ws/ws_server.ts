// //Will DRY and optimize later, to avoid conflicts this file will be all-encompassing

// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// //Communicate with Express
// app.get('/', (req: any, res: any) => {
//   res.sendFile(__dirname + '/index.html');
// });

// //Type of socket TBD
// io.on('connection', (socket: any) => {
//   console.log('a user connected');
// });

// //Listening on a different port unnecessary?
// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });