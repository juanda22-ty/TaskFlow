import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import connectDB from './config/db.js';
import { redisSubscriber } from './config/redis.js';
import requestRoutes from './routes/requestRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Inyectar io en las peticiones HTTP
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Definición de Rutas
app.use('/api', requestRoutes);

// Manejo de rutas inexistentes y errores
app.use(notFound);
app.use(errorHandler);

// CONEXIÓN SOCKET.IO CON VUE
io.on('connection', (socket) => {
  console.log('📡 Cliente Vue conectado:', socket.id);
  socket.on('disconnect', () => console.log('❌ Cliente desconectado:', socket.id));
});

// ESCUCHAR AL WORKER MEDIANTE REDIS PUB/SUB
// El worker publicará en el canal 'worker_events' y Express lo enviará a Vue
redisSubscriber.subscribe('worker_events', (err) => {
  if (err) console.error('Error suscribiéndose a eventos del Worker:', err);
  else console.log("✅ Suscrito al canal Redis 'worker_events'");
});

redisSubscriber.on('message', (channel, message) => {
  if (channel === 'worker_events') {
    const data = JSON.parse(message);
    console.log(`🔔 Evento del Worker recibido: ${data.evento}`);

    // Express avisa al Frontend (Vue 3) en tiempo real
    io.emit(data.evento, data.solicitud);
    io.emit('monitor-actualizado'); // Dispara recarga de stats en Vue
  }
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Backend Express ejecutándose en el puerto ${PORT}`);
  });
};

start();
