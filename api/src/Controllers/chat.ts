import { send } from "process";
import { getPlayerById } from "../Models/player";
import { filterPlayerData } from "./player";
import { getRoleById } from "../Models/role";
import io from '../server';

const chatControllers = {
  async sendChat(req: any, res: any) {
    const {senderId, message, chat} = req.body;
    console.log("MESSAGE REVCIVED ON SERVER : ", message);
		const playerId = req.session.playerId;
		if(playerId !== senderId || playerId === undefined){
			res.status(401).json({error: 'You can only edit your own player'})
		}
    if(message === "" || message === undefined) res.status(200).json({message: 'You cant send empty messages'})
    const sender = await getPlayerById(playerId);
    const senderTeam = (await getRoleById(sender.roleId))?.type;
		switch(chat) {
      case "lobby" :
        io.in(sender.gameId.toString()).emit("lobby_chat_message", message, sender.id, sender.name);
        break;
      case "all" :
        if(sender.status === "alive") {
          io.in(sender.gameId.toString()).emit("all_chat_message", message, sender.id, sender.name);
        }
        break;
      case "cultist" :
        if(senderTeam === "cultist" &&  sender.status === "alive") {
          io.in(sender.gameId.toString()).emit("cultist_chat_message", message, sender.id, sender.name);
        }
        break;
      case "ghost" : 
        if(sender.status === "murdered" || sender.status === "terminated")
        io.in(sender.gameId.toString()).emit("ghost_chat_message", message, sender.id, sender.name);
        break;
    }
		res.status(200).json({message:"Message Sent"})
	},
  async verifyRole (req: any, res: any) {
    // const {senderId} = req.body;
    const playerId = req.session.playerId
    const player = await getPlayerById(playerId);
    const playerTeam = (await getRoleById(player.roleId))?.type;
    if(playerTeam === "cultist") {
      res.status(200).json({results : true})
    }else {
      res.status(200).json({results : false})
    }
  },
  async verifyDeath (req: any, res: any) {
    // const {senderId} = req.body;
    const playerId = req.session.playerId
    const player = await getPlayerById(playerId);
    if(player.status === "murdered" || player.status === "terminated") {
      res.status(200).json({results : true})
    }else {
      res.status(200).json({results : false})
    }
  }
}

export default chatControllers;