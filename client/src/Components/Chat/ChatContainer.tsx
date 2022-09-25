/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Player } from "../../Types/Types";
import AllChat from "./AllChat";
import CultistChat from "./CultistChat";
import GhostChat from "./GhostChat";
import styles from "./Chat.module.css";

const ChatContainer = ({sender} : {sender : Player}) => {
	const [showChat, setShowChat] = useState(false);
	const [activeChat, setActiveChat] = useState("none");
	const [hideContent, setHideContent] = useState(true);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [allNotificationCount, setAllNotificationCount] = useState(0);
	const [cultistNotificationCount, setCultistNotificationCount] = useState(0);
	const [ghostNotificationCount, setGhostNotificationCount] = useState(0);
	const [prevActiveChat, setPrevActiveChat] = useState("all");
	const isDead = sender.status === "murdered" || sender.status === "terminated" ? true : false;

	const allButtonHeaderClick = () => {
		if(!showChat) {
			setShowChat(true);
			setIsFirstLoad(false);
			setTimeout(() => {
				setActiveChat("all");
			}, 550);
		}else {
			setActiveChat("all");
		}
		setPrevActiveChat("all");
		setAllNotificationCount(0);
	};
	const cultistButtonHeaderClick = () => {
		if(!showChat) {
			setShowChat(true);
			setIsFirstLoad(false);
			setTimeout(() => {
				setActiveChat("cultist");
			}, 550);
		}else {
			setActiveChat("cultist");
		}
		setPrevActiveChat("cultist");
		setCultistNotificationCount(0);
	};
	const ghostButtonHeaderClick = () => {
		if(!showChat) {
			setShowChat(true);
			setIsFirstLoad(false);
			setTimeout(() => {
				setActiveChat("ghost");
			}, 550);
		}else {
			setActiveChat("ghost");
		}
		setPrevActiveChat("ghost");
		setGhostNotificationCount(0);
	};
	const onShowChatClick  = () => {
		setShowChat((prev) => !prev);
		if(isFirstLoad) setIsFirstLoad(false);
	};
	useEffect(() => {
		if(!showChat){
			setActiveChat("none");
			setHideContent(true);
		}else {
			setTimeout(() => {
				setHideContent(false);
				setActiveChat(prevActiveChat);
				switch(prevActiveChat) {
					case "all" :
						setAllNotificationCount(0);
						break;
					case "cultist" :
						setCultistNotificationCount(0);
						break;
					case "ghost" :
						setGhostNotificationCount(0);
						break;
				}
			}, 510);
		}
	}, [showChat]);
	return (
		<div className={styles.chatContainerWrapper}>
			<button className={styles.showChatButton} onClick={onShowChatClick}>{(showChat) ? "Hide Chats ∧" : "Show Chats ∨"}</button>
			<div className={styles.buttonHeaderContainer}>
				<button className={(activeChat === "all") ? styles.activeAllButtonHeader : styles.allButtonHeader} onClick={allButtonHeaderClick}>All{allNotificationCount > 0 && <span className={styles.notificationSpan}>{allNotificationCount}</span>}</button>
				{sender.team === "cultist" && 
        <button className={(activeChat === "cultist") ? styles.activeCultistButtonHeader : styles.cultistButtonHeader} onClick={cultistButtonHeaderClick}>Cultist{cultistNotificationCount > 0 && <span className={styles.notificationSpan}>{cultistNotificationCount}</span>}</button>}
				{isDead && 
        <button className={(activeChat === "ghost") ? styles.activeGhostButtonHeader : styles.ghostButtonHeader} onClick={ghostButtonHeaderClick}>Ghost{ghostNotificationCount > 0 && <span className={styles.notificationSpan}>{ghostNotificationCount}</span>}</button>}
			</div>
			<div className={(showChat) ? `${styles.chatContainer} ${styles.showChatAnimation}` : (!isFirstLoad) ? `${styles.hideChatContainer} ${styles.hideChatAnimation}` : styles.hideChatContainer}>
				<div className={(hideContent) ? styles.hideChatContent : styles.chatContainerContent}>
					<div className={styles.chatContainerBodyContainer}>
						{<AllChat activeChat={activeChat} sender={sender} setNotificationCount={setAllNotificationCount} notificationCount={allNotificationCount}/>}
						{sender.team === "cultist" && <CultistChat activeChat={activeChat} sender={sender} setNotificationCount={setCultistNotificationCount} notificationCount={cultistNotificationCount}/>}
						{isDead &&  <GhostChat activeChat={activeChat} sender={sender} setNotificationCount={setGhostNotificationCount} notificationCount={ghostNotificationCount}/>}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;
