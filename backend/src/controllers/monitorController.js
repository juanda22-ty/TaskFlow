import mongoose from 'mongoose';
import { redisClient } from '../config/redis.js';
import requestService from '../services/requestService.js';

export const getMonitor = async (req, res) => {
  try {
    const mongoDisponible = mongoose.connection.readyState === 1;

    let redisDisponible = true;
    try {
      await redisClient.ping();
    } catch {
      redisDisponible = false;
    }

    const heartbeat = await redisClient.get('worker:heartbeat');
    const workerDisponible = Boolean(heartbeat);

    const enCola = await redisClient.llen('taskflow_queue');
    const { data: estadisticas } = await requestService.getDashboardStats();

    res.json({
      servicios: {
        express: 'disponible',
        mongodb: mongoDisponible ? 'disponible' : 'no disponible',
        redis: redisDisponible ? 'disponible' : 'no disponible',
        worker: workerDisponible ? 'disponible' : 'no disponible',
      },
      cola: enCola,
      estadisticas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
