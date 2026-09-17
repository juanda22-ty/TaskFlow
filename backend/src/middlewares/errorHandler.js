export function notFound(req, res) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
}
