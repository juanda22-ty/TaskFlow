import mongoose from 'mongoose';
import Redis from 'ioredis';

// 1. Conectarnos a Redis usando las variables del docker-compose
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

// 2. Definir el esquema de MongoDB aquí mismo
// Usamos strict: false para que no te borre otros campos que ya tengas en tu backend
const requestSchema = new mongoose.Schema({
  status: { type: String, default: 'EN COLA' }
}, { strict: false });

// OJO: Aquí NO exportamos nada. Solo creamos el modelo para usarlo aquí abajo.
const Request = mongoose.model('Request', requestSchema);

// 3. La lógica principal del Worker
async function startWorker() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Worker: Conectado a MongoDB');
    console.log('👷 Worker: Esperando tareas en "taskflow_queue"...');

    // Bucle infinito para procesar la cola
    while (true) {
      // blpop bloquea el código aquí hasta que llegue un nuevo trabajo a la cola
      const task = await redis.blpop('taskflow_queue', 0);
      
      if (task) {
        const taskId = task[1]; // El ID de la solicitud que el backend envió
        console.log(`⏳ Procesando solicitud ID: ${taskId}`);

        // Simulamos que el worker está haciendo un trabajo pesado (ej. generando un reporte) por 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Actualizamos el estado en MongoDB a RESPONDIDA
        await Request.findByIdAndUpdate(taskId, { status: 'RESPONDIDA' });
        console.log(`✅ Solicitud ${taskId} completada exitosamente.`);

        // Opcional: Publicar un evento en Redis para que el Backend se entere y le avise a Vue por Socket.io
        redis.publish('taskflow_notifications', JSON.stringify({ id: taskId, status: 'RESPONDIDA' }));
      }
    }
  } catch (error) {
    console.error('❌ Error crítico en el Worker:', error);
  }
}

// Encendemos el motor
startWorker();