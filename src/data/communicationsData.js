// Sistema de gestión de comunicados dinámico
// Los comunicados se almacenan aquí y se pueden editar fácilmente

export const communicationsData = [
  // Ejemplo de comunicado - puedes agregar más aquí
  {
    id: 1,
    title: "NUEVO PRODUCTO ELMER",
    subtitle: "MEDICAMENTOS CONDUCTUALES",
    type: "producto-nuevo",
    description: "Descubre la nueva línea de productos para el manejo del comportamiento animal",
    image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    buttonText: "Ver Productos",
    buttonLink: "/veterinarios/productos",
    badge: "NUEVO",
    section: "veterinarios", // veterinarios, petshops, ambos
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true
  },
  {
    id: 2,
    title: "AUMENTO PRECIOS VACUNAS",
    subtitle: "VIGENTE DESDE 15/01",
    type: "aumento-precios",
    description: "Informamos los nuevos precios de la línea de vacunas e inmunológicos",
    image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    buttonText: "Ver Precios",
    buttonLink: "/veterinarios/productos",
    badge: "IMPORTANTE",
    section: "veterinarios",
    validFrom: "2024-01-15",
    validUntil: "2024-01-31",
    active: true
  },
  {
    id: 3,
    title: "ALIMENTOS PREMIUM",
    subtitle: "OLD PRINCE & COMPANY",
    type: "producto-nuevo",
    description: "Nueva llegada de alimentos premium para perros y gatos",
    image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    buttonText: "Ver Alimentos",
    buttonLink: "/petshops/productos",
    badge: "NUEVO",
    section: "petshops",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true
  }
]

// Función para obtener comunicados activos por sección
export const getActiveCommunications = (section) => {
  const now = new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
  
  return communicationsData.filter(comm => 
    comm.active && 
    (comm.section === section || comm.section === 'ambos') &&
    comm.validFrom <= now && 
    comm.validUntil >= now
  )
}

// Función para agregar un nuevo comunicado
export const addCommunication = (newComm) => {
  const maxId = Math.max(...communicationsData.map(c => c.id), 0)
  const communication = {
    id: maxId + 1,
    ...newComm,
    active: true
  }
  communicationsData.push(communication)
  return communication
}

// Función para desactivar un comunicado
export const deactivateCommunication = (id) => {
  const comm = communicationsData.find(c => c.id === id)
  if (comm) {
    comm.active = false
  }
  return comm
}

// Función para activar un comunicado
export const activateCommunication = (id) => {
  const comm = communicationsData.find(c => c.id === id)
  if (comm) {
    comm.active = true
  }
  return comm
}

// Función para eliminar un comunicado
export const deleteCommunication = (id) => {
  const index = communicationsData.findIndex(c => c.id === id)
  if (index > -1) {
    return communicationsData.splice(index, 1)[0]
  }
  return null
}
