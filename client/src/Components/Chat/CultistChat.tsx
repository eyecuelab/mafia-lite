/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { Player } from "../../Types/Types";
import {useEffect, useState, useRef } from "react";
import socket from "../../Hooks/WebsocketHook";
import ChatTextBox from "./ChatTextBox";  
import { ChatData } from "../../Types/Types";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";
import styles from "./Chat.module.css";

const verifyRole = async (payload : {playerId: number}): Promise<boolean> => postData("/chat/verifyRole", payload);
const CultistChat = ({sender, activeChat, setNotificationCount, notificationCount}: {sender: Player, activeChat : string, setNotificationCount: React.Dispatch<React.SetStateAction<number>>, notificationCount: number}) => {
	const array : Array<ChatData> = [];
	const [messages, setMessages] = useState(array);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [showMessages, setShowMessages] = useState(false);
	const verifyRoleMutation = useMutation(verifyRole, {
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
		if(activeChat !== "cultist" && messages.length >= 1){
			const newNumber = notificationCount + 1;
			setNotificationCount(newNumber);
		}
	}, [messages]);
	useEffect(() => {
		if(activeChat === "cultist") {
			messagesRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [activeChat]);
	useEffect(() => {
		verifyRoleMutation.mutate({playerId : sender.id});
	}, []);
	useEffect(() => {
		socket.on("cultist_chat_message", (message: string, senderId : number, senderName : string) => {
			if(sender.team === "cultist") {
				setMessages(messages => [...messages, {message: message, senderId: senderId, senderName: senderName}]);
			}
		});
		return () => { 
			socket.off("cultist_chat_message");
		};
	});
	return (
		<div className={(activeChat === "cultist")  ? styles.cultistChatContainer : styles.hideCultistChatContainer}>
			<div className={styles.chatCultistBodyContainer}>
				{showMessages && 
          messages.map((message: ChatData, index: number) =>
          	(message.senderId === 0) ? 
          		<p className={styles.errorChatMessage} key={index}>{message.message}</p> 
          		: (message.senderId === -1) ? <p className={styles.waringChatMessage} key={index}>{message.message}</p> 
          			:
          			<p className={styles.chatMessage} key={index}>{<span className={(message.senderId === sender.id) ? styles.yourNameBadge : styles.nameBadge}>{message.senderName}</span>} : {message.message}</p>
          )
				}
				<div ref={messagesRef} />
			</div>
			<ChatTextBox senderId={sender.id} senderStatus={sender.status} chat="cultist" setMessages={setMessages} />
		</div>
	);
};

export default CultistChat;