// import React, { useState } from 'react';
// import io from "socket.io-client";
// import { API_ENDPOINT, BASE_HEADERS, handleResponse } from "../../ApiHelper";

// const usePlayerStatusUpdates = () => {
//   const [socket, setSocket] = useState(io(API_ENDPOINT));
//   const [playerStatus, setPlayerStatus] = useState("");

//   const handleShowPlayerStatus = (playerIdInput: number, selectStatus: string) => {
//     setPlayerStatus(selectStatus)
//   }

//   //accuse() extends handleShowPlayerStatus(), it should only work for clickable accusations! But for test purposes we can change the second parameter to view different badges:
//   const accuse = (playerIdArg: number) => {
//     handleShowPlayerStatus(playerIdArg, "accused"); //To test: change the 2nd parameter to change badge on UI.
//     socket.emit(`accuse_player`, playerIdArg)
//   }

//   const isMurdered = (playerIdArg: number) => {
//     handleShowPlayerStatus(playerIdArg, "murdered");
//     socket.emit(`murdered_player`, playerIdArg)
//   }

//   console.log(playerStatus)

//   return {
//     handleShowPlayerStatus, accuse, isMurdered, playerStatus
//   }
// }

// export default usePlayerStatusUpdates