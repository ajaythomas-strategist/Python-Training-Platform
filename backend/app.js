import app from './server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { initSocket } from './socket.js';

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/python-platform';

const server = http.createServer(app);
initSocket(server);

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log(`Connected to MongoDB: ${MONGO_URI}`);
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });
