require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const requestRoutes = require('./routes/requestRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

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
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Make the uploads folder statically available
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Running Status
app.get('/', (req, res) => {
    res.send(`SkillSwap API Running in ${process.env.NODE_ENV || 'development'} mode`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
