require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
        ].filter(Boolean),
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const requestRoutes = require('./routes/requestRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const matchRoutes = require('./routes/matchRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            process.env.CLIENT_URL,         // e.g. https://skillswap.vercel.app
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
        ].filter(Boolean);

        // Allow requests with no origin (e.g. mobile apps, Postman, server-to-server)
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: ${origin} is not allowed`));
        }
    },
    credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/requests', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/skills/matches', matchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', paymentRoutes);

// Make the uploads folder statically available
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Running Status
app.get('/', (req, res) => {
    res.send(`SkillSwap API Running in ${process.env.NODE_ENV || 'development'} mode`);
});

// Socket.io Connection Lifecycle
io.on('connection', (socket) => {
    socket.on('join_room', (requestId) => {
        socket.join(requestId);
    });

    socket.on('send_message', async ({ requestId, senderId, text }) => {
        try {
            const { saveMessage } = require('./controllers/messageController');
            const savedMsg = await saveMessage(requestId, senderId, text);
            io.to(requestId).emit('receive_message', savedMsg);
        } catch (error) {
            console.error('Socket error saving message:', error);
            socket.emit('error_message', { message: 'Failed to send message.' });
        }
    });

    socket.on('typing', ({ requestId, senderId, isTyping }) => {
        socket.to(requestId).emit('user_typing', { senderId, isTyping });
    });

    socket.on('disconnect', () => {
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
