// Load environment variables
require('dotenv').config();

// Import required packages
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize express app
const app = express();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.PORT || '3001', 10);

// Validate port number
if (isNaN(PORT) || PORT <= 0 || PORT > 65535) {
    console.error('Invalid port number specified');
    process.exit(1);
}

// Middleware configuration
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined')); // Request logging
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ 
    server,
    handleProtocols: (protocols, request) => {
        return protocols[0]; // Accept first protocol
    },
    verifyClient: (info) => {
        // Add any client verification logic here if needed
        return true;
    }
});

wss.on('connection', function connection(ws, req) {
    const clientIp = req.socket.remoteAddress;
    console.log(`New client connected from ${clientIp}`);

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

// Validation middleware
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access token is required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

// Authentication routes
app.post('/api/auth/register', registerValidation, async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;

        // In production, check if user already exists in database
        // const existingUser = await User.findOne({ email });
        // if (existingUser) throw new Error('User already exists');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // In production, save user to database
        // const user = await User.create({
        //     name,
        //     email,
        //     password: hashedPassword
        // });

        // Generate JWT token
        const token = jwt.sign(
            { userId: 'demo-user-id', email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                name,
                email,
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

app.post('/api/auth/login', loginValidation, async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // In production, verify user credentials from database
        // const user = await User.findOne({ email });
        // if (!user) throw new Error('Invalid credentials');
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (!isValidPassword) throw new Error('Invalid credentials');

        // For demo, we'll skip password verification
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: 'demo-user-id', email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                email
            }
        });
    } catch (error) {
        next(error);
    }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
    // In production, you might want to invalidate the token or add it to a blacklist
    res.json({
        status: 'success',
        message: 'Logout successful'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Error handling middleware - should be last
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({ 
        error: message,
        status: 'error',
        ...(NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server with proper error handling
const startServer = async () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
            console.log(`WebSocket server is available`);
            console.log(`Health check endpoint: http://localhost:${PORT}/health`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();