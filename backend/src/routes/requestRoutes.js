import express from 'express';
import { create, getAll, getById, update, remove, getStats, getResponse } from '../controllers/requestController.js';
import { getMonitor } from '../controllers/monitorController.js';
import { validateCreateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.get('/estadisticas', getStats);
router.get('/monitor', getMonitor);
router.get('/solicitudes', getAll);
router.get('/solicitudes/:id/respuesta', getResponse);
router.get('/solicitudes/:id', getById);
router.post('/solicitudes', validateCreateRequest, create);
router.put('/solicitudes/:id', update);
router.delete('/solicitudes/:id', remove);

export default router;