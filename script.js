document.addEventListener("DOMContentLoaded", function() {
    const ageVerification = document.getElementById('age-verification');
    const mainPage = document.getElementById('main-page');

    document.getElementById('yes-button').addEventListener('click', function() {
        ageVerification.style.display = 'none';
        mainPage.style.display = 'flex';
    });

    document.getElementById('no-button').addEventListener('click', function() {
        alert('Você precisa ser maior de idade para acessar este site.');
        window.location.href = 'https://www.google.com';
    });
});

// Função para enviar mensagem
function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        const chatBox = document.getElementById("chat-box");
        const messageBubble = document.createElement("div");
        messageBubble.className = "message-bubble";
        messageBubble.textContent = messageText;
        chatBox.appendChild(messageBubble);
        chatBox.scrollTop = chatBox.scrollHeight;
        messageInput.value = "";
        sendMessageToServer(messageText); // Simular envio da mensagem
    }
}

// Simular envio de mensagem para o servidor
function sendMessageToServer(message) {
    // Simulação de envio da mensagem para o servidor
}

// Função para alternar a câmera
function toggleCamera() {
    const videoStream = document.getElementById("local-video-stream");
    const cameraButton = document.getElementById("camera-button");

    if (videoStream.srcObject) {
        videoStream.srcObject.getTracks().forEach(track => track.stop());
        videoStream.srcObject = null;
        cameraButton.src = "D:/Documentos/Desktop/Migo/imagens/cam_off.png";
    } else {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoStream.srcObject = stream;
                cameraButton.src = "D:/Documentos/Desktop/Migo/imagens/cam_on.png";
            })
            .catch(error => {
                console.error("Erro ao acessar a câmera: ", error);
            });
    }
}

// Função para alternar o microfone
function toggleMic() {
    const micButton = document.getElementById("mic-button");
    const videoStream = document.getElementById("local-video-stream");

    if (videoStream.srcObject) {
        const audioTracks = videoStream.srcObject.getAudioTracks();
        if (audioTracks.length > 0) {
            const isEnabled = audioTracks[0].enabled;
            audioTracks.forEach(track => track.enabled = !isEnabled);
            micButton.src = isEnabled ? "D:/Documentos/Desktop/Migo/imagens/mic_off.png" : "D:/Documentos/Desktop/Migo/imagens/mic_on.png";
        }
    }
}

// Função para pular usuário
function changeUser() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ""; // Limpa o chat
    // Simular procura por um novo usuário
    const searchingMessage = document.createElement("div");
    searchingMessage.textContent = "Procurando alguém para conversar...";
    searchingMessage.style.textAlign = "center";
    searchingMessage.style.marginTop = "20px";
    chatBox.appendChild(searchingMessage);
    setTimeout(() => {
        // Simula encontrar um novo usuário
        chatBox.innerHTML = ""; // Limpa o chat após encontrar o usuário
    }, 3000);
}

// Função para denunciar usuário
function reportUser() {
    alert("Usuário denunciado. Você será redirecionado para o próximo usuário.");
    changeUser(); // Redireciona para o próximo usuário
}

// Função para lidar com a entrada no campo de texto
function handleInput(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        const messageInput = document.getElementById("
