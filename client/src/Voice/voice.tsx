import socket from "../Hooks/WebsocketHook";

// Probably needs to be array or set to handle group calls
let peerConnection: RTCPeerConnection;
let roomId: number;

const audioHTML = document.getElementsByTagName("audio")[0];

// Audio only
const mediaConstraints: MediaStreamConstraints = {
	audio: true,
	video: false
};

type VCMessage = {
	target: number
	type: string
	data: any
}

socket.on("voice-offer", (message: VCMessage) => { console.log("recieved offer"); handleConnectionOfferMessage(message); });
socket.on("voice-answer", (message: VCMessage) => { console.log("recieved answer"); handleConnectionAnswerMessage(message); });
socket.on("new-ice-candidate", (message: VCMessage) => { console.log("recieved ice"); handleNewICECandidateMessage(message); });
socket.on("hang-up", (message: VCMessage) => { console.log("recieved hang-up"); handleHangUpMessage(message); });

const setRoomId = (id: number) => {
	roomId = id;
};

const sendToServer = (message: VCMessage) => {
	console.log("vc_message", message);
	socket.emit("vc_message", message);
};

const createRTCPeerConnection = () => {
	peerConnection = new RTCPeerConnection({
		iceServers: [
			{
				urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
			}
		],
		iceCandidatePoolSize: 10
	});

	peerConnection.onicecandidate = handleICECandidateEvent;
	peerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
	peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
	peerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
	peerConnection.ontrack = handleTrackEvent;
};

const handleNegotiationNeededEvent = async () => {
	peerConnection.createOffer()
		.then((offer: RTCSessionDescriptionInit) => peerConnection.setLocalDescription(offer))
		.then(() => {
			sendToServer({
				target: roomId,
				type: "voice-offer",
				data: peerConnection.localDescription
			});
		})
		.catch(reportError);
};

const handleICECandidateEvent = (event: any) => {
	if (event.candidate) {
		sendToServer({
			type: "new-ice-candidate",
			target: roomId,
			data: event.candidate
		});
	}
};

const handleICEConnectionStateChangeEvent = (event: any) => {
	switch(peerConnection.iceConnectionState) {
		case "closed":
		case "failed":
		case "disconnected":
			closeCall();
			break;
	}
};

const handleSignalingStateChangeEvent = (event: any) => {
	switch(peerConnection.signalingState) {
		case "closed":
			closeCall();
			break;
	}
};

const handleConnectionOfferMessage = (message: VCMessage) => {
	let localStream: MediaStream;
	createRTCPeerConnection();

	const desc = new RTCSessionDescription(message.data);

	peerConnection.setRemoteDescription(desc)
		.then(() => navigator.mediaDevices.getUserMedia(mediaConstraints))
		.then((stream) => {
			localStream = stream;
			localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
		})
		.then(() => peerConnection.createAnswer())
		.then((answer) => peerConnection.setLocalDescription(answer))
		.then(() => {
			const message = {
				target: roomId,
				type: "voice-answer",
				data: peerConnection.localDescription
			};

			console.log("target: ", message.target);
			sendToServer(message);
		})
		.catch(handleGetUserMediaError);
};

const handleConnectionAnswerMessage = async (message: VCMessage) => {
	const desc = new RTCSessionDescription(message.data);
	await peerConnection.setRemoteDescription(desc).catch(reportError);
};

const handleNewICECandidateMessage = async (message: VCMessage) => {
	const candidate = new RTCIceCandidate(message.data);

	try {
		await peerConnection.addIceCandidate(candidate);
	} catch(error) {
		reportError(error);
	}
};

const closeCall = () => {
	if (peerConnection) {
		peerConnection.onicecandidate = null;
		peerConnection.oniceconnectionstatechange = null;
		peerConnection.onsignalingstatechange = null;
		peerConnection.onnegotiationneeded	= null;

		peerConnection.getTransceivers().forEach(transceiver => {
			transceiver.stop();
		});

		if (audioHTML.srcObject) {
			audioHTML.pause();
			(audioHTML.srcObject as MediaStream).getTracks().forEach((track) => {
				track.stop();
			});
		}

		peerConnection.close();
	}
};

const handleHangUpMessage = (message: VCMessage) => {
	closeCall();
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

	closeCall();
};

const handleTrackEvent = (event: any) => {
	if (audioHTML.srcObject !== event.streams[0])
		audioHTML.srcObject = event.streams[0];
	console.log("Got remote stream");
	audioHTML.play();
};

const initiateConnectionToCall = () => {
	createRTCPeerConnection();

	navigator.mediaDevices.getUserMedia(mediaConstraints)
		.then((localStream: MediaStream) => {
			audioHTML.srcObject = localStream;
			localStream.getTracks().forEach((track: MediaStreamTrack) => {
				peerConnection.addTrack(track, localStream);
			});
		})
		.catch(handleGetUserMediaError);
};

const hangUpCall = () => {
	closeCall();

	sendToServer({
		target: roomId,
		type: "hang-up",
		data: null
	});
};

export { initiateConnectionToCall, hangUpCall, setRoomId };