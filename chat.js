const socket = io("http://127.0.0.1:3000");

document.addEventListener("DOMContentLoaded", function () {
    console.log("JS yüklendi ve çalışıyor!");

    const sendButton = document.getElementById("sendButton");
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const messagesDiv = document.getElementById("messages");
    const typingStatus = document.getElementById("typingStatus");

    if (!sendButton || !nameInput || !messageInput || !messagesDiv || !typingStatus) {
        console.error("HATA: HTML elemanları bulunamadı!");
        return;
    }

    sendButton.addEventListener("click", function () {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (name === "" || message === "") {
            alert("Lütfen adınızı ve mesajınızı girin!");
            return;
        }

        const chatMessage = { name, message };
        socket.emit("chatMessage", chatMessage);
        messageInput.value = ""; // Mesaj gönderildikten sonra kutuyu temizle
        socket.emit("stopTyping"); // Mesaj gönderildiğinde "yazıyor..." kaldır
    });

    // Kullanıcı yazarken "yazıyor..." mesajı gönder
    messageInput.addEventListener("input", () => {
        socket.emit("typing", nameInput.value);
    });

    // Mesaj gönderilince "yazıyor..." mesajını kaldır
    messageInput.addEventListener("blur", () => {
        socket.emit("stopTyping");
    });

    // Sunucudan gelen mesajları dinle
    socket.on("chatMessage", function (data) {
        const newMessage = document.createElement("p");
        newMessage.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
        messagesDiv.appendChild(newMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Otomatik kaydırma
    });

    // Başkası yazarken "yazıyor..." bilgisini göster
    socket.on("typing", (name) => {
        typingStatus.innerText = `${name} yazıyor...`;
    });

    // Yazma durduğunda mesajı kaldır
    socket.on("stopTyping", () => {
        typingStatus.innerText = "";
    });

    // Bağlantı kontrolü
    socket.on("connect", function () {
        console.log("Socket.io bağlantısı başarılı! ID: ", socket.id);
    });

    socket.on("disconnect", function () {
        console.log("Bağlantı kesildi!");
    });
});
