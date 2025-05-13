// Required packages
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CryptoJS = require("crypto-js");
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
const SECRET_KEY = process.env.SECRET_KEY || 'development';

// Utility function
const encryptField = (value) => {
    return CryptoJS.AES.encrypt(value.toString(), SECRET_KEY).toString();
  };


const decrypt = (value) => {
    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

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
        const { userId, latitude, longitude } = locationData
        
        const cipheredData = {
            ...locationData,
            latitude: encryptField(latitude),
            longitude: encryptField(longitude),
        }

        console.log(cipheredData)
        await LocationModel.findOneAndUpdate(
            { userId },
            cipheredData,
            { upsert: true }
        )
        socket.broadcast.emit('location_update', cipheredData)
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