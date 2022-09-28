/* eslint-disable react-hooks/exhaustive-deps */
import { Player } from "../../Types/Types";
import {useEffect, useState, useRef } from "react";
import socket from "../../Hooks/WebsocketHook";
import ChatTextBox from "./ChatTextBox";  
import { ChatData } from "../../Types/Types";
import styles from "./Chat.module.css";
const AllChat = ({sender, activeChat, setNotificationCount, notificationCount}: {sender: Player, activeChat: string, setNotificationCount: React.Dispatch<React.SetStateAction<number>>, notificationCount: number}) => {
	const array : Array<ChatData> = [];
	const messagesRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState(array);
	useEffect(() => {
		messagesRef.current?.scrollIntoView({ behavior: "smooth" });
		if(activeChat !== "all" && messages.length >= 1){
			console.log(messages[messages.length - 1]);
			if(messages[messages.length - 1].senderId !== 0) {
				const newNumber = notificationCount + 1;
				setNotificationCount(newNumber);
			}
		}
	}, [messages]);
	useEffect(() => {
		if(activeChat === "all") {
			messagesRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [activeChat]);
	useEffect(() => {
		socket.on("all_chat_message", (message: string, senderId : number, senderName : string) => {
			setMessages(messages => [...messages, {message: message, senderId: senderId, senderName: senderName}]);
		});
		socket.on("game_player_disconnect_chat", (name: string) => {
			setMessages(messages => [...messages, {message: `${name} has left`, senderId: -1, senderName: name}]);
		});
		socket.on("vote_results_tie_chat", () => {
			setMessages(messages => [...messages, {message: "Tie: No one is jailed/terminated", senderId: 0, senderName: "server"}]);
		});
		socket.on("vote_results_chat_tie_night", (name: string, team: string) => {
			setMessages(messages => [...messages, {message: `${name} (${team}) has been murdered by Cthulhu`, senderId: 0, senderName: "server"}]);
		});
		socket.on("vote_results_chat", (name: string, status: string) => {
			setMessages(messages => [...messages, {message: `${name} has been ${status}`, senderId: 0, senderName: "server"}]);
		});
		return () => { 
			socket.off("all_chat_message");
			socket.off("game_player_disconnect_chat");
			socket.off("vote_results_tie_chat");
			socket.off("vote_results_chat_tie_night");
			socket.off("vote_results_chat");
		};
	}, []);
	return (
		<div className={(activeChat === "all")? styles.allChatContainer : styles.hideAllChatContainer}>
			<div className={styles.chatBodyContainer}>
				{messages.map((message: ChatData, index: number) =>
					(message.senderId === 0) ? 
						<p className={styles.errorChatMessage} key={index}> {message.message}</p> 
						: (message.senderId === -1) ? <p className={styles.waringChatMessage} key={index}>{message.message}</p> 
							:
							<p className={styles.chatMessage} key={index}>{<span className={(message.senderId === sender.id) ? styles.yourNameBadge : styles.nameBadge}>{message.senderName}</span>} : {message.message}</p>

				)
				}
				<div ref={messagesRef} />
			</div>
			<ChatTextBox senderId={sender.id} senderStatus={sender.status} chat="all" setMessages={setMessages} />
		</div>
	);
};

export default AllChat;