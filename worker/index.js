import 'dotenv/config';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import Request from './models/Request.js';

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

// Conexión dedicada a la cola (BRPOP es bloqueante, no puede compartirse)
const queue = new Redis(redisConfig);

// Conexión para publicar eventos, heartbeat y limpiar caché
const bus = new Redis(redisConfig);

const RESPUESTAS = {
  'Información': 'El horario de atención es de lunes a viernes, de 8:00 a. m. a 5:00 p. m.',
  'Soporte': 'Tu reporte fue registrado. Reinicia tu sesión; si el problema persiste, contacta al canal de soporte técnico.',
  'Documento': 'Para solicitar tu certificado debes diligenciar el formulario y adjuntar tu documento de identidad.',
  'Consulta': 'Tu trámite se encuentra en revisión. Consulta nuevamente en 24 horas para conocer su estado.',
  'Actualización': 'Para actualizar tus datos debes enviar la solicitud de cambio junto con el soporte correspondiente.',
};

const RESPUESTA_GENERICA = 'Tu solicitud fue recibida. Un agente la revisará y te responderá a la mayor brevedad.';

function generarRespuesta(solicitud) {
  return RESPUESTAS[solicitud.categoria] || RESPUESTA_GENERICA;
}

async function invalidarCache() {
  await bus.del('cache:solicitudes');
  await bus.del('cache:estadisticas');
}

async function publicarEvento(evento, solicitud) {
  await bus.publish('worker_events', JSON.stringify({ evento, solicitud }));
}

async function procesarSolicitud(taskId) {
  let solicitud;
  try {
    solicitud = await Request.findById(taskId);
    if (!solicitud) throw new Error('Solicitud no encontrada en MongoDB');

    solicitud.estado = 'PROCESANDO';
    solicitud.mensajeError = null;
    await solicitud.save();
    await publicarEvento('solicitud-procesando', solicitud);
    await invalidarCache();

    // Simulación de trabajo pesado (ej. generación de reporte)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Error controlado para la prueba HU-11: escribir "simular error" en la descripción
    if (solicitud.descripcion.toLowerCase().includes('simular error')) {
      throw new Error('Error simulado durante el procesamiento');
    }

    solicitud.respuesta = generarRespuesta(solicitud);
    solicitud.estado = 'RESPONDIDA';
    solicitud.fechaProcesamiento = new Date();
    await solicitud.save();
    await publicarEvento('solicitud-respondida', solicitud);
    await invalidarCache();
  } catch (error) {
    console.error('❌ Error procesando solicitud:', error.message);
    if (solicitud) {
      solicitud.estado = 'ERROR';
      solicitud.mensajeError = error.message;
      await solicitud.save();
      await publicarEvento('solicitud-error', solicitud);
      await invalidarCache();
    }
  }
}

async function startWorker() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Worker: Conectado a MongoDB');
    console.log('👷 Worker: Esperando tareas en "taskflow_queue"...');

    setInterval(() => {
      bus.set('worker:heartbeat', String(Date.now()), 'EX', 10);
    }, 5000);

    while (true) {
      const task = await queue.brpop('taskflow_queue', 0);
      if (!task) continue;

      const taskId = task[1];
      console.log(`⏳ Procesando solicitud ID: ${taskId}`);
      await procesarSolicitud(taskId);
      console.log(`✅ Solicitud ${taskId} finalizada.`);
    }
  } catch (error) {
    console.error('❌ Error crítico en el Worker:', error);
  }
}

startWorker();
