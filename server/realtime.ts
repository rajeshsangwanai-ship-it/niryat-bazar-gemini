import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import jwt from 'jsonwebtoken';

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN, methods: ['GET', 'POST'] },
});

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis Adapter connected successfully for Socket.io scaling.');
});

// Auth Guard Middleware for Sockets
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication Error'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Unauthorized Token'));
  }
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`User connected: ${user.userId} (${user.role})`);

  // Join private negotiation room for specific RFQ
  socket.on('join_rfq_room', (rfqId: string) => {
    const roomName = `rfq_${rfqId}`;
    socket.join(roomName);
    console.log(`User ${user.userId} joined room ${roomName}`);
  });

  // Handle B2B deal negotiation message
  socket.on('send_negotiation_message', async (data: { rfqId: string; message: string; proposedPrice?: number }) => {
    const roomName = `rfq_${data.rfqId}`;
    const payload = {
      senderId: user.userId,
      role: user.role,
      message: data.message,
      proposedPrice: data.proposedPrice,
      timestamp: new Date().toISOString(),
    };

    // Broadcast real-time message to room
    io.to(roomName).emit('receive_negotiation_message', payload);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${user.userId}`);
  });
});

server.listen(4000, () => console.log('Realtime Gateway listening on Port 4000'));