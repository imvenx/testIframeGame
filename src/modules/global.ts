import { type Socket, io } from 'socket.io-client'
export const socket: Socket = io("192.168.1.140:3000")