/**
 * WebSocketService.js
 * Handles WebSocket connections for the Journal Entry Component with automatic reconnection,
 * message handling, and connection status management.
 */

class WebSocketService {
    constructor(url = 'ws://localhost:8080') {
        this.url = url;
        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.baseReconnectDelay = 1000; // Start with 1 second delay
        this.messageCallbacks = new Set();
        this.statusCallbacks = new Set();
    }

    /**
     * PUBLIC_INTERFACE
     * Initializes the WebSocket connection
     */
    connect() {
        try {
            this.ws = new WebSocket(this.url);
            this.setupEventHandlers();
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.handleReconnection();
        }
    }

    /**
     * Sets up WebSocket event handlers
     * @private
     */
    setupEventHandlers() {
        this.ws.onopen = () => {
            console.log('WebSocket connection established');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.notifyStatusChange(true);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            this.isConnected = false;
            this.notifyStatusChange(false);
            this.handleReconnection();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.notifyStatusChange(false);
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.notifyMessageReceived(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
    }

    /**
     * Implements exponential backoff for reconnection attempts
     * @private
     */
    handleReconnection() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
            console.log(`Attempting to reconnect in ${delay}ms...`);
            
            setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
            this.notifyStatusChange(false);
        }
    }

    /**
     * PUBLIC_INTERFACE
     * Sends a message through the WebSocket connection
     * @param {Object} message - The message to send
     * @returns {boolean} - Whether the message was sent successfully
     */
    sendMessage(message) {
        if (!this.isConnected) {
            console.error('Cannot send message: WebSocket is not connected');
            return false;
        }

        try {
            this.ws.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }

    /**
     * PUBLIC_INTERFACE
     * Registers a callback for receiving messages
     * @param {Function} callback - Function to be called when a message is received
     */
    onMessage(callback) {
        this.messageCallbacks.add(callback);
    }

    /**
     * PUBLIC_INTERFACE
     * Removes a message callback
     * @param {Function} callback - The callback to remove
     */
    removeMessageCallback(callback) {
        this.messageCallbacks.delete(callback);
    }

    /**
     * PUBLIC_INTERFACE
     * Registers a callback for connection status changes
     * @param {Function} callback - Function to be called when connection status changes
     */
    onStatusChange(callback) {
        this.statusCallbacks.add(callback);
    }

    /**
     * PUBLIC_INTERFACE
     * Removes a status change callback
     * @param {Function} callback - The callback to remove
     */
    removeStatusCallback(callback) {
        this.statusCallbacks.delete(callback);
    }

    /**
     * Notifies all registered callbacks about received messages
     * @private
     * @param {Object} message - The received message
     */
    notifyMessageReceived(message) {
        this.messageCallbacks.forEach(callback => {
            try {
                callback(message);
            } catch (error) {
                console.error('Error in message callback:', error);
            }
        });
    }

    /**
     * Notifies all registered callbacks about connection status changes
     * @private
     * @param {boolean} isConnected - The current connection status
     */
    notifyStatusChange(isConnected) {
        this.statusCallbacks.forEach(callback => {
            try {
                callback(isConnected);
            } catch (error) {
                console.error('Error in status callback:', error);
            }
        });
    }

    /**
     * PUBLIC_INTERFACE
     * Gets the current connection status
     * @returns {boolean} - Whether the WebSocket is currently connected
     */
    getConnectionStatus() {
        return this.isConnected;
    }

    /**
     * PUBLIC_INTERFACE
     * Closes the WebSocket connection
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
        this.isConnected = false;
        this.messageCallbacks.clear();
        this.statusCallbacks.clear();
    }
}

export default WebSocketService;
