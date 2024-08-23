let cameraOn = true;
let microphoneOn = true;
let localStream = null;
let peerConnection = null;
const socket = new WebSocket('ws://seu-servidor-de-sinalizacao'); // Substitua pelo URL do seu servidor WebSocket
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } // Servidor STUN padrão
    ]
};

// Solicitar permissão para câmera e microfone
function startLocalStream() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            localStream = stream;
            document.getElementById('local-video-stream').srcObject = stream;
            document.getElementById('local-video-stream').play();
            
            // Iniciar a conexão P2P quando o stream local estiver pronto
            createPeerConnection();
        })
        .catch(function(err) {
            console.log('Erro ao acessar a câmera ou microfone:', err);
        });
}

function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    // Adicionar o stream local à conexão
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Manipular eventos de ICE Candidate
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            socket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };

    // Manipular eventos de recebimento de stream remoto
    peerConnection.ontrack = function(event) {
        const remoteVideoElement = document.getElementById('remote-video-stream');
        remoteVideoElement.srcObject = event.streams[0];
        remoteVideoElement.play();

        // Remove a mensagem "Procurando usuário" se o stream estiver disponível
        document.getElementById('remote-message').style.display = 'none';
        document.getElementById('remote-video').style.backgroundColor = 'transparent';
    };

    // Quando receber uma oferta, responda com uma resposta
    socket.onmessage = async function(event) {
        const message = JSON.parse(event.data);

        if (message.type === 'offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.send(JSON.stringify({
                type: 'answer',
                answer: answer
            }));

            // Atualizar o cabeçalho com o nome do usuário remoto
            updateConversationHeader(message.username); // Supondo que o nome do usuário seja enviado como parte da mensagem de oferta
        } else if (message.type === 'answer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
        } else if (message.type === 'candidate') {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else if (message.type === 'no_user') {
            updateConversationHeader(null); // Esconder a mensagem quando não há usuários disponíveis
        }
    };
}

// Função para alternar a câmera
function toggleCamera() {
    cameraOn = !cameraOn;
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = cameraOn;

    const localVideoElement = document.getElementById('local-video-stream');
    const localMessageElement = document.querySelector('#local-video .message-placeholder');
    const cameraButton = document.getElementById('camera-button');

    if (cameraOn) {
        localVideoElement.style.display = 'block';
        localMessageElement.style.display = 'none';
        cameraButton.src = 'imagens/cam_on.png';
    } else {
        localVideoElement.style.display = 'none';
        localMessageElement.style.display = 'flex';
        localMessageElement.innerText = 'Estou tímido.';
        cameraButton.src = 'imagens/cam_off.png';
    }
}

// Função para alternar o microfone
function toggleMicrophone() {
    microphoneOn = !microphoneOn;
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = microphoneOn;

    // Alterar o ícone do microfone
    const microphoneButton = document.getElementById('microphone-button');
    microphoneButton.src = microphoneOn ? 'imagens/mic_on.png' : 'imagens/mic_off.png';
}

// Função para mostrar a mensagem "Procurando usuário."
function showSearchingMessage() {
    const remoteVideo = document.getElementById('remote-video');
    const messagePlaceholder = document.getElementById('remote-message');

    remoteVideo.style.backgroundColor = '#333';
    messagePlaceholder.style.display = 'flex'; // Mostrar a mensagem
}

// Verificar se o stream remoto está disponível
function checkRemoteStream() {
    const remoteVideoElement = document.getElementById('remote-video-stream');
    if (!remoteVideoElement.srcObject) {
        showSearchingMessage();
    }
}

// Iniciar a transmissão local e verificar o stream remoto quando a página carrega
window.onload = function() {
    startLocalStream();
    checkRemoteStream();
    setInterval(checkRemoteStream, 3000); // Verifica a cada 3 segundos se o stream remoto está conectado
};

// Manipular o envio de mensagens
document.getElementById('send-button').onclick = sendMessage;
document.getElementById('message-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = document.getElementById('message-input').value;
    if (message) {
        document.getElementById('chat-box').innerHTML += `<div class="message-bubble">${message}</div>`;
        document.getElementById('message-input').value = '';
        // Enviar a mensagem para o servidor ou outro usuário
        socket.send(JSON.stringify({ type: 'message', text: message }));
    }
}

// Função para manipular o botão "Pular"
function skipUser() {
    document.getElementById('chat-box').innerHTML = '';
    socket.send(JSON.stringify({ type: 'skip' }));

    // Limpar o cabeçalho da conversa
    updateConversationHeader(null);
}

document.getElementById('skip-button').onclick = skipUser;
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        skipUser();
    }
});

// Manipular o botão "Denunciar"
document.getElementById('report-button').onclick = function() {
    // Função para denunciar o usuário
    socket.send(JSON.stringify({ type: 'report' }));
};

function updateConversationHeader(username) {
    const headerElement = document.getElementById('conversation-header');
    const usernameElement = document.getElementById('remote-user-name');
    if (username) {
        usernameElement.textContent = username;
        headerElement.style.display = 'block';
    } else {
        headerElement.style.display = 'none';
    }
}
