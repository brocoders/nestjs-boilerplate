import { io, Socket } from 'socket.io-client';

// Your JWT token
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6eyJpZCI6MiwibmFtZSI6IlVzZXIiLCJfX2VudGl0eSI6IlJvbGVFbnRpdHkifSwic2Vzc2lvbklkIjo1NywiaWF0IjoxNzQ5NjE1ODE5LCJleHAiOjE3NDk2MTYxMDN9.vUIeCQE34Xo_A1EAwWH6fKmduLyEVGiJOBVakr02N5o';
const socket: Socket = io('http://localhost:3000', {
  auth: {
    token,
  },
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);

  // Send a ping every 3 seconds
  setInterval(() => {
    console.log('Sending: ping');
    socket.emit('ping');
  }, 3000);
});

socket.on('pong', () => {
  console.log('Received: pong');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (err: Error) => {
  console.error('Connection error:', err.message);
});

socket.on('exception', (error) => {
  console.error('Socket Exception:');
  if (typeof error === 'object') {
    console.error(`Status: ${error.status}`);
    console.error(`Message: ${error.message}`);
    if (error.guard) console.error(`Guard: ${error.guard}`);
    if (error.handler) console.error(`Handler: ${error.handler}`);
    if (error.code) console.error(`Code: ${error.code}`);
    if (error.cause)
      console.error(`Cause: ${JSON.stringify(error.cause, null, 2)}`);
  } else {
    console.error(error);
  }
});
