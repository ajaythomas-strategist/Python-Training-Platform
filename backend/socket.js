import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", // Using standard wildcard for dev. In prod, restrict this.
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id}`);

        // Trainers and students join a specific session room to broadcast/receive attendance
        socket.on('join_session', (sessionId) => {
            socket.join(sessionId);
            console.log(`[Socket.io] Socket ${socket.id} joined session room: ${sessionId}`);
        });

        // Leave session room
        socket.on('leave_session', (sessionId) => {
            socket.leave(sessionId);
            console.log(`[Socket.io] Socket ${socket.id} left session room: ${sessionId}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket.io] Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
