import Redis from 'ioredis';
import Request from '../models/Request.js';
import { redisClient, redisConfig } from '../config/redis.js';

const queue = new Redis(redisConfig);
const QUEUE_NAME = 'taskflow_queue';

queue.on('error', (error) => console.error('❌ Error de conexión de la cola:', error.message));

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

async function publicarEvento(evento, solicitud) {
  await redisClient.publish('worker_events', JSON.stringify({ evento, solicitud }));
}

async function invalidarCache() {
  await redisClient.del('cache:solicitudes', 'cache:estadisticas');
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

    await new Promise((resolve) => setTimeout(resolve, 3000));

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
    if (!solicitud) return;

    try {
      solicitud.estado = 'ERROR';
      solicitud.mensajeError = error.message;
      await solicitud.save();
      await publicarEvento('solicitud-error', solicitud);
      await invalidarCache();
    } catch (saveError) {
      console.error('❌ No se pudo guardar el error de la solicitud:', saveError.message);
    }
  }
}

export async function startWorker() {
  console.log(`👷 Worker integrado: esperando tareas en "${QUEUE_NAME}"...`);

  const heartbeat = () => {
    redisClient
      .set('worker:heartbeat', String(Date.now()), 'EX', 10)
      .catch((error) => console.error('❌ Error actualizando heartbeat del Worker:', error.message));
  };

  heartbeat();
  setInterval(heartbeat, 5000);

  while (true) {
    try {
      const task = await queue.brpop(QUEUE_NAME, 5);
      if (!task) continue;

      const taskId = task[1];
      console.log(`⏳ Procesando solicitud ID: ${taskId}`);
      await procesarSolicitud(taskId);
      console.log(`✅ Solicitud ${taskId} finalizada.`);
    } catch (error) {
      console.error('❌ Error en el Worker integrado:', error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
