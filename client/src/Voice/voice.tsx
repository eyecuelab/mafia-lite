import socket from "../Hooks/WebsocketHook";

type VCMessage = {
	to: number
	from: number
	target: number
	type: string
	data: any
}

type Connection = {
	peerConnection: RTCPeerConnection
	audioTag: HTMLAudioElement
}

const connections: Map<number, Connection> = new Map<number, Connection>();

let roomId: number;
let playerId: number;

let handleError: (error: Error) => void;

// Audio only
const mediaConstraints: MediaStreamConstraints = {
	audio: true,
	video: false
};

const setRoomId = (id: number) => {
	roomId = id;
};

const setPlayerId = (id: number) => {
	playerId = id;
};

const handleIncomingMessage = (message: VCMessage, handler: (message: VCMessage) => any) => {
	if (message.type !== "new-ice-candidate")
		console.log(`recieved ${message.type}: ${message.from}`);
	if (message.to === playerId /*&& ((message.type === "voice-offer") === (!connections.has(message.from)))*/) {
		console.log(`handling ${message.type}: ${message.from}`);
		handler(message);
	}
};

socket.on("voice-offer", (message: VCMessage) => handleIncomingMessage(message, handleConnectionOfferMessage));
socket.on("voice-answer", (message: VCMessage) => handleIncomingMessage(message, handleConnectionAnswerMessage));
socket.on("new-ice-candidate", (message: VCMessage) => handleIncomingMessage(message, handleNewICECandidateMessage));
socket.on("hang-up", (message: VCMessage) => handleIncomingMessage(message, handleHangUpMessage));

const sendToServer = (message: VCMessage) => {
	if (message.type !== "new-ice-candidate")
		console.log("vc_message", message);

	socket.emit("vc_message", message);
};

const createRTCPeerConnection = (id: number) => {
	console.log(connections);
	const peerConnection = new RTCPeerConnection({
		iceServers: [
			{
				urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
			}
		],
		iceCandidatePoolSize: 10
	});

	peerConnection.oniceconnectionstatechange = () => handleICEConnectionStateChangeEvent(id);
	peerConnection.onsignalingstatechange =  () => handleSignalingStateChangeEvent(id);
	peerConnection.onnegotiationneeded = () => handleNegotiationNeededEvent(id);

	peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
		if (event.candidate) {
			sendToServer({
				to: id,
				from: playerId,
				type: "new-ice-candidate",
				target: roomId,
				data: event.candidate
			});
		}
	};

	peerConnection.ontrack = (event: RTCTrackEvent) => {
		const audioTag = connections.get(id)?.audioTag;
		if (audioTag) {
			if (audioTag.srcObject !== event.streams[0]) {
				audioTag.srcObject = event.streams[0];
			}
			console.log("Got remote stream");
			audioTag.play();
		}
	};

	const audioTag = new Audio();
	connections.set(id, {peerConnection, audioTag});
};

const handleNegotiationNeededEvent = async (id: number) => {
	const peerConnection = connections.get(id)?.peerConnection;
	peerConnection?.createOffer()
		.then((offer: RTCSessionDescriptionInit) => peerConnection.setLocalDescription(offer))
		.then(() => {
			sendToServer({
				to: id,
				from: playerId,
				target: roomId,
				type: "voice-offer",
				data: peerConnection.localDescription
			});
		})
		.catch(reportError);
};

const handleICEConnectionStateChangeEvent = (id: number) => {
	const peerConnection = connections.get(id)?.peerConnection;
	switch(peerConnection?.iceConnectionState) {
		case "failed": handleError(new Error("Unable to connect to voice call")); break;
		case "closed":
		case "disconnected": closeCall(id); break;
	}
};

const handleSignalingStateChangeEvent = (id: number) => {
	const peerConnection = connections.get(id)?.peerConnection;
	switch(peerConnection?.signalingState) {
		case "closed":
			closeCall(id);
			break;
	}
};

const handleConnectionOfferMessage = (message: VCMessage) => {
	createRTCPeerConnection(message.from);

	const desc = new RTCSessionDescription(message.data);
	const peerConnection = connections.get(message.from)?.peerConnection;

	peerConnection?.setRemoteDescription(desc)
		.then(() => navigator.mediaDevices.getUserMedia(mediaConstraints))
		.then((stream) => {
			const localStream = stream;
			localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
		})
		.then(() => peerConnection.createAnswer())
		.then((answer) => peerConnection.setLocalDescription(answer))
		.then(() => {
			const outMessage = {
				to: message.from,
				from: playerId,
				target: roomId,
				type: "voice-answer",
				data: peerConnection.localDescription
			};

			console.log("target: ", outMessage.target);
			sendToServer(outMessage);
		})
		.catch(handleGetUserMediaError);
};

const handleConnectionAnswerMessage = async (message: VCMessage) => {
	const desc = new RTCSessionDescription(message.data);
	const peerConnection = connections.get(message.from)?.peerConnection;
	await peerConnection?.setRemoteDescription(desc).catch(reportError);
};

const handleNewICECandidateMessage = async (message: VCMessage) => {
	const candidate = new RTCIceCandidate(message.data);
	const peerConnection = connections.get(message.from)?.peerConnection;

	try {
		await peerConnection?.addIceCandidate(candidate);
	} catch(error) {
		reportError(error);
	}
};

const closeCall = (id: number) => {
	const peerConnection = connections.get(id)?.peerConnection;
	const audioTag = connections.get(id)?.audioTag;

	if (peerConnection) {
		peerConnection.onicecandidate = null;
		peerConnection.oniceconnectionstatechange = null;
		peerConnection.onsignalingstatechange = null;
		peerConnection.onnegotiationneeded	= null;

		peerConnection.getTransceivers().forEach(transceiver => {
			transceiver.stop();
		});

		if (audioTag?.srcObject) {
			audioTag.pause();
			(audioTag.srcObject as MediaStream).getTracks().forEach((track) => {
				track.stop();
			});
		}

		peerConnection.close();
		console.log("Closed call: ", id);
	}
};

const handleHangUpMessage = (message: VCMessage) => {
	closeCall(message.from);
};

const handleGetUserMediaError = (error: Error) => {
	switch(error.name) {
		case "NotFoundError":
			alert("Unable to open your call because no microphone was found");
			break;
		case "SecurityError":
		case "PermissionDeniedError":
			break;
		default:
			alert("Error accessing your microphone: " + error.message);
			break;
	}

	connections.forEach((connection, key) => closeCall(key));
};

const initiateConnectionToCall = (id: number) => {
	createRTCPeerConnection(id);

	const audioTag = connections.get(id)?.audioTag;
	navigator.mediaDevices.getUserMedia(mediaConstraints)
		.then((localStream: MediaStream) => {
			localStream.getTracks().forEach((track: MediaStreamTrack) => {
				if (audioTag) {
					audioTag.srcObject = localStream;
				}
				connections.get(id)?.peerConnection.addTrack(track, localStream);
			});
		})
		.catch(handleGetUserMediaError);
};

const hangUpCall = (id: number) => {
	closeCall(id);

	sendToServer({
		to: id,
		from: playerId,
		target: roomId,
		type: "hang-up",
		data: null
	});
};

const hangUpAllCalls = () => {
	console.log("hang-up all");
	connections.forEach((connection, id) => {
		hangUpCall(id);
	});
};

const connectToRoom = (ids: number[]) => {
	ids.forEach((id) => {
		if (!connections.has(id)) {
			initiateConnectionToCall(id);
		}
	});
};

const setHandleError = (newHandleError: (error: Error) => void) => {
	handleError = newHandleError;
};

export { connectToRoom, initiateConnectionToCall, hangUpAllCalls, hangUpCall, setRoomId, setPlayerId, setHandleError };