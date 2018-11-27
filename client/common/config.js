const serverHost = process.env.NODE_ENV === 'production' ? "wss://mtools.vip" : "ws://127.0.0.1:9000";
module.exports = {
    serverHost
}