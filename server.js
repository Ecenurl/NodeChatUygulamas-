const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // CORS hatası almamak için
});

// Sunucu başlat
server.listen(3000, () => {
    console.log("Socket.io sunucusu 3000 portunda çalışıyor...");
});

// Socket bağlantısı
io.on("connection", (socket) => {
    console.log(`Yeni kullanıcı bağlandı: ${socket.id}`);

    socket.on("chatMessage", (data) => {
        console.log("Mesaj alındı: ", data);
        io.emit("chatMessage", data); // Tüm istemcilere mesajı gönder
    });

    // Kullanıcı yazarken bildirim gönder
    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    // Kullanıcı yazmayı durdurduğunda
    socket.on("stopTyping", () => {
        socket.broadcast.emit("stopTyping");
    });

    socket.on("disconnect", () => {
        console.log(`Kullanıcı ayrıldı: ${socket.id}`);
    });
});
