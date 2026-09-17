import requestService from '../services/requestService.js';

export const create = async (req, res) => {
  try {
    const request = await requestService.createRequest(req.body);
    // Emitir evento en tiempo real
    req.io.emit('solicitud-encolada', request);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await requestService.getAllRequests();
    res.set('X-Cache-Status', result.source);
    res.json({ source: result.source, data: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const request = await requestService.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ error: 'No encontrada' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResponse = async (req, res) => {
  try {
    const request = await requestService.getRequestResponse(req.params.id);
    if (!request) return res.status(404).json({ error: 'No encontrada' });
    res.json({
      estado: request.estado,
      respuesta: request.respuesta,
      mensajeError: request.mensajeError,
      fechaProcesamiento: request.fechaProcesamiento,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const request = await requestService.updateRequest(req.params.id, req.body);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await requestService.deleteRequest(req.params.id);
    res.json({ message: 'Eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const result = await requestService.getDashboardStats();
    res.json({ source: result.source, data: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};