/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import { Player } from "../../Types/Types";
import {useEffect, useState, useRef } from "react";
import socket from "../../Hooks/WebsocketHook";
import ChatTextBox from "./ChatTextBox";  
import { ChatData } from "../../Types/Types";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";
import styles from "./Chat.module.css";

const verifyDeath = async (payload : {playerId: number}): Promise<boolean> => postData("/chat/verifyDeath", payload);
const GhostChat = ({sender, activeChat, setNotificationCount, notificationCount}: {sender: Player, activeChat: string, setNotificationCount : React.Dispatch<React.SetStateAction<number>>, notificationCount : number}) => {
	const array : Array<ChatData> = [];
	const [messages, setMessages] = useState(array);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [showMessages, setShowMessages] = useState(false);
	const verifyDeathMutation = useMutation(verifyDeath, {
		onSuccess: (result : boolean) => {
			result ? setShowMessages(true) : setShowMessages(false);
		},
		onError: (error) => {
			if (error instanceof Error) {
				const chatData : ChatData = {message: error.toString(), senderId: 0, senderName: "Error"};
				setMessages((messages : Array<ChatData>) => [...messages, chatData]);
			}
		}
	});
	useEffect(() => {
		messagesRef.current?.scrollIntoView({ behavior: "smooth" });
		if(activeChat !== "ghost" && messages.length >= 1){
			const newNumber = notificationCount + 1;
			setNotificationCount(newNumber);
		}
	}, [messages]);
	useEffect(() => {
		verifyDeathMutation.mutate({playerId : sender.id});
	}, []);
	useEffect(() => {
		if(activeChat === "ghost") {
			messagesRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [activeChat]);
	useEffect(() => {
		socket.on("ghost_chat_message", (message: string, senderId : number, senderName : string) => {
			if(sender.status === "murdered" || sender.status === "terminated") {
				setMessages(messages => [...messages, {message: message, senderId: senderId, senderName: senderName}]);
			}
		});
		return () => { 
			socket.off("ghost_chat_message");
		};
	});
	return (
		<div className={(activeChat === "ghost")? styles.ghostChatContainer : styles.hideGhostChatContainer}>
			<div className={styles.chatGhostBodyContainer}>
				{showMessages && 
        messages.map((message: ChatData, index: number) =>
        	(message.senderId === 0) ? 
        		<p className={styles.errorChatMessage} key={index}> {message.message}</p> 
        		: (message.senderId === -1) ? <p className={styles.waringChatMessage} key={index}> {message.message}</p> 
        			:
        			<p className={styles.chatMessage} key={index}>{<span className={(message.senderId === sender.id) ? styles.yourNameBadge : styles.nameBadge}>{message.senderName}</span>} : {message.message}</p>
    
        )
				}
				<div ref={messagesRef} />
			</div>
			<ChatTextBox senderId={sender.id} senderStatus={sender.status} chat="ghost" setMessages={setMessages} />
		</div>
	);
};

export default GhostChat;