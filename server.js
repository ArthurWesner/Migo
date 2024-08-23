const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Map();

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'login') {
            clients.set(ws, data.category);
            ws.send(JSON.stringify({ type: 'welcome', text: 'Bem-vindo ao chat!' }));
        } else if (data.type === 'message') {
            // Envia mensagem para todos os clientes
            clients.forEach((_, client) => {
                if (client !== ws) {
                    client.send(JSON.stringify({ type: 'message', text: data.text }));
                }
            });
        } else if (data.type === 'skip') {
            // Lógica para pular para o próximo usuário
        } else if (data.type === 'report') {
            // Lógica para denunciar o usuário
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

console.log('Servidor WebSocket rodando na porta 8080');
