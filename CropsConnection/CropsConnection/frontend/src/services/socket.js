import { io } from 'socket.io-client';

const SOCKET_URL = window.location.origin.includes('5173')
  ? 'http://localhost:5000'
  : window.location.origin;

export const socket = io(SOCKET_URL, {
  autoConnect: false
});
