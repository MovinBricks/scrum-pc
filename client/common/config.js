const serverHost = process.env.NODE_ENV === 'production' ? "wss://mtools.vip/websocket" : "ws://127.0.0.1:9000";

export default serverHost;
