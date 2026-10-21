
import { io } from "socket.io-client";

const UrlApi = import.meta.env.VITE_URL_API;

export const WebSocketComedor = io(UrlApi, {
    autoConnect: true,
    transports: ["websocket"] ,
    reconnection: true
});
