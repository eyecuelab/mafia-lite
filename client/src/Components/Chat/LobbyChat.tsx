/* eslint-disable react-hooks/exhaustive-deps */
import { Player } from "../../Types/Types";
import {useEffect, useState, useRef } from "react";
import socket from "../../Hooks/WebsocketHook";
import ChatTextBox from "./ChatTextBox";  
import { ChatData } from "../../Types/Types";
import styles from "./Chat.module.css";
const LobbyChat = ({sender}: {sender: Player}) => {
	const array : Array<ChatData> = [];
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [messages, setMessages] = useState(array);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [showLobbyChat, setShowLobbyChat] = useState(false);
	const [hideContent, setHideContent] = useState(true);
	const [notificationCount, setNotificationCount] = useState(0);
	useEffect(() => {
		if(!showLobbyChat){
			setHideContent(true);
		}else {
			setTimeout(() => {
				setHideContent(false);
			}, 500);
			setTimeout(() => {
				messagesRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 550);
		}
	}, [showLobbyChat]);
	useEffect(() => {
		messagesRef.current?.scrollIntoView({ behavior: "smooth" });
		if(!showLobbyChat && messages.length >= 1){
			const newNumber = notificationCount + 1;
			setNotificationCount(newNumber);
		}
	}, [messages]);
	const onShowLobbyClick = (showLobbyChat : boolean) => {
		setShowLobbyChat(!showLobbyChat);
		if(isFirstLoad) setIsFirstLoad(false);
		if(!showLobbyChat) {
			setNotificationCount(0);
		}
	};
	useEffect(() => {
		socket.on("lobby_chat_message", (message: string, senderId : number, senderName : string) => {
			setMessages(messages => [...messages, {message: message, senderId: senderId, senderName}]);
		});
		socket.on("player_joined_lobby_chat", (name: string) => {
			setMessages(messages => [...messages, {message: `${name} has joined`, senderId: -1, senderName: name}]);
		});
		return () => { 
			socket.off("lobby_chat_message");
			socket.off("player_joined_lobby_chat");
		};
	});
	return (
		<div className={styles.lobbyChatWrapper}>
			<button className={styles.showLobbyChatButton} onClick={() => onShowLobbyClick(showLobbyChat)}>{(showLobbyChat) ? "Hide Lobby Chat ∧" : "Show Lobby Chat ∨"}{notificationCount > 0 && <span className={styles.notificationSpan}>{notificationCount}</span>}</button>
			<div className={(showLobbyChat) ? `${styles.lobbyChatContainer} ${styles.showLobbyChatAnimation}` : (!isFirstLoad) ? `${styles.hideLobbyChatContainer} ${styles.hideLobbyChatAnimation}` : styles.hideLobbyChatContainer}>
				<div className={(hideContent) ? styles.hideChatContent : styles.lobbyChatContent}>
					<div className={styles.lobbyChatBodyContainer}>
						{messages.map((message: ChatData, index: number) => 
							(message.senderId === 0) ? 
								<p className={styles.errorChatMessage} key={index}>{message.message}</p> 
								: (message.senderId === -1) ? <p className={styles.waringChatMessage} key={index}>{message.message}</p> 
									:
									<p className={styles.chatMessage} key={index}>{<span className={(message.senderId === sender.id) ? styles.yourNameBadge : styles.nameBadge}>{message.senderName}</span>} : {message.message}</p>
						)}
						<div ref={messagesRef} />
					</div>
					<div className={styles.lobbyTextboxContainer}>
						<ChatTextBox senderId={sender.id} senderStatus={undefined} chat="lobby" setMessages={setMessages}/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LobbyChat;