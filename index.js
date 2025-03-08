// Required packages
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LocationModel = require('./models/location')

// Load environment variables
dotenv.config();

// Express app setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins in development
        methods: ["GET", "POST"]
    }
});

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/socketio_app';

mongoose.connect(MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining a room
    socket.on('offer', (data) => {
        console.log(data)
        // io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id })
    })


    socket.on('update_location', async (locationData) => {
        console.log('updating location', locationData)

        const { userId } = locationData


        await LocationModel.findOneAndUpdate(
            { userId },
            locationData,
            { upsert: true }
        )

        socket.broadcast.emit('location_update', locationData)
    })


    socket.emit('message', { message: `Welcome on this server.` })
    socket.on('disconnect', () => {
        console.log('User has left')
    })
});

// Basic routes
app.get('/', (req, res) => {
    res.send('Socket.IO server is running');
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});