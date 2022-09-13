import io, { Socket } from "socket.io-client";
import { API_ENDPOINT } from "../ApiHelper";

const socket: Socket = io(API_ENDPOINT);

export default socket;