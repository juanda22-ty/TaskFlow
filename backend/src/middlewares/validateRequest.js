const CATEGORIAS = ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'];
const PRIORIDADES = ['Baja', 'Media', 'Alta'];

export function validateCreateRequest(req, res, next) {
  const { titulo, descripcion, categoria, prioridad } = req.body || {};
  const errores = [];

  if (!titulo || !String(titulo).trim()) {
    errores.push('El título es obligatorio.');
  }

  if (!descripcion || !String(descripcion).trim()) {
    errores.push('La descripción es obligatoria.');
  }

  if (!categoria || !CATEGORIAS.includes(categoria)) {
    errores.push(`La categoría debe ser una de: ${CATEGORIAS.join(', ')}.`);
  }

  if (prioridad && !PRIORIDADES.includes(prioridad)) {
    errores.push(`La prioridad debe ser una de: ${PRIORIDADES.join(', ')}.`);
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
  }

  next();
}
