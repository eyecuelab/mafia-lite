import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../ApiHelper";
import { ChatData } from "../../Types/Types";
import styles from "./Chat.module.css";

type ChatPayload = {
	senderId: number,
  message: string,
  chat: string
}
const sendChat = async (chat: ChatPayload): Promise<string> => postData("/chat/sendChat", chat);
const ChatTextBox = ({senderId, senderStatus, chat, setMessages} : {senderId : number, senderStatus: string | undefined, chat: string, setMessages: any }) => {
	const textRef = useRef<HTMLTextAreaElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const sendChatMutation = useMutation(sendChat, {
		onError: (error) => {
			if (error instanceof Error) {
				const chatData : ChatData = {message: error.toString(), senderId: 0, senderName: "Error"};
				setMessages((messages : Array<ChatData>) => [...messages, chatData]);
			}
		}
	});
	const onEnterPress = (e : any) => {
		if(e.keyCode == 13 && e.shiftKey == false) {
			e.preventDefault();
			formRef.current?.requestSubmit();
		}
	};
	const onSend = (e : any) => {
		e.preventDefault();
		if(textRef.current?.innerText === "" || textRef.current?.innerText === undefined) return;
		if(senderStatus === "alive" || senderStatus === undefined) {
			sendChatMutation.mutate({
				senderId: senderId,
				message: (textRef.current?.innerText) ? textRef.current?.innerText : "",
				chat: chat
			});
		}else if(senderStatus === "jailed") {
			const chatData : ChatData = {message: "You are jailed, you cannot chat!", senderId: -1, senderName: "Guard"};
			setMessages((messages : Array<ChatData>) => [...messages, chatData]);
		} else {
			if(chat !== "ghost"){
				if(senderStatus === "murdered" || senderStatus === "terminated") {
					const chatData : ChatData = {message: "You are dead, you cannot chat!", senderId: -1, senderName: "Higher Power"};
					setMessages((messages : Array<ChatData>) => [...messages, chatData]);
				} 
			} else if(senderStatus === "murdered" || senderStatus === "terminated") {
				sendChatMutation.mutate({
					senderId: senderId,
					message: (textRef.current?.innerText) ? textRef.current?.innerText : "",
					chat: chat
				});
			}
		}
		if(textRef.current) textRef.current.innerText = "";
	};
	return (
		<form ref={formRef} onSubmit={onSend} className={styles.chatTextBar}>
			<span contentEditable="true" className={styles.chatTextInput} onKeyDown={onEnterPress} ref={textRef}></span>
			<button type="submit" className={styles.chatTextButton}>Send</button>
		</form>
	);
};
export default ChatTextBox;