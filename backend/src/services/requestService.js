import Request from '../models/Request.js';
import { redisClient } from '../config/redis.js';

class RequestService {
  async createRequest(data) {
    // Guardar en MongoDB con estado PENDIENTE
    const newRequest = new Request(data);
    await newRequest.save();

    // Cambiar estado a EN COLA y actualizar
    newRequest.estado = 'EN COLA';
    await newRequest.save();

    // Enviar a Redis Queue para procesamiento asíncrono
    await redisClient.lpush('taskflow_queue', newRequest._id.toString());

    // Invalidar caché (HU-08)
    await redisClient.del('cache:solicitudes');
    await redisClient.del('cache:estadisticas');

    return newRequest;
  }

  async getAllRequests() {
    const cacheKey = 'cache:solicitudes';
    const cached = await redisClient.get(cacheKey);

    if (cached) return { data: JSON.parse(cached), source: 'CACHE HIT' };

    const requests = await Request.find().sort({ fechaCreacion: -1 });
    await redisClient.set(cacheKey, JSON.stringify(requests), 'EX', 60); 
    
    return { data: requests, source: 'CACHE MISS' };
  }

  async getRequestById(id) {
    return await Request.findById(id);
  }

  async updateRequest(id, data) {
    const updated = await Request.findByIdAndUpdate(id, data, { new: true });
    await redisClient.del('cache:solicitudes');
    return updated;
  }

  async deleteRequest(id) {
    const deleted = await Request.findByIdAndDelete(id);
    await redisClient.del('cache:solicitudes');
    await redisClient.del('cache:estadisticas');
    return deleted;
  }

  async getDashboardStats() {
    const cacheKey = 'cache:estadisticas';
    const cached = await redisClient.get(cacheKey);

    if (cached) return { data: JSON.parse(cached), source: 'CACHE HIT' };

    const stats = await Request.aggregate([
      { $group: { _id: '$estado', cantidad: { $sum: 1 } } }
    ]);

    const result = {
      total: stats.reduce((acc, curr) => acc + curr.cantidad, 0),
      pendientes: stats.find(s => s._id === 'PENDIENTE')?.cantidad || 0,
      enCola: stats.find(s => s._id === 'EN COLA')?.cantidad || 0,
      procesando: stats.find(s => s._id === 'PROCESANDO')?.cantidad || 0,
      respondidas: stats.find(s => s._id === 'RESPONDIDA')?.cantidad || 0,
      errores: stats.find(s => s._id === 'ERROR')?.cantidad || 0,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 30);
    return { data: result, source: 'CACHE MISS' };
  }
}

export default new RequestService();