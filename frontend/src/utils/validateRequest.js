export function validateRequest(form) {
  const errors = {}

  if (!form.titulo || !form.titulo.trim()) {
    errors.titulo = 'El título es obligatorio'
  }

  if (!form.descripcion || !form.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria'
  }

  if (!form.categoria) {
    errors.categoria = 'Debes seleccionar una categoría'
  }

  if (!form.prioridad) {
    errors.prioridad = 'Debes seleccionar una prioridad'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
