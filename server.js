const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    ws.on('message', function incoming(message) {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('received:', parsedMessage);
            
            switch(parsedMessage.type) {
                case 'SAVE_ENTRY':
                    ws.send(JSON.stringify({
                        type: 'ENTRY_SAVED',
                        data: parsedMessage.data
                    }));
                    break;
                case 'GET_ENTRIES':
                    ws.send(JSON.stringify({
                        type: 'ENTRIES_LIST',
                        data: []
                    }));
                    break;
                default:
                    console.log('Unknown message type:', parsedMessage.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send(JSON.stringify({
        type: 'CONNECTED',
        message: 'Successfully connected to WebSocket server'
    }));
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});