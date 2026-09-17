import express from 'express';
import { create, getAll, getById, update, remove, getStats } from '../controllers/requestController.js';

const router = express.Router();

router.get('/estadisticas', getStats);
router.get('/solicitudes', getAll);
router.get('/solicitudes/:id', getById);
router.post('/solicitudes', create);
router.put('/solicitudes/:id', update);
router.delete('/solicitudes/:id', remove);

export default router;