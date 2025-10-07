// Configuración de marcas y laboratorios
export const brandsConfig = {
  "veterinarios": {
    "title": "Laboratorios y Marcas",
    "subtitle": "",
    "brands": [
      {
        "name": "BAYER",
        "logo": "https://logos-world.net/wp-content/uploads/2020/04/Bayer-Logo.png",
        "color": "#009639",
        "description": "Productos farmacéuticos innovadores"
      },
      {
        "name": "BOEHRINGER",
        "logo": "https://logos-world.net/wp-content/uploads/2020/04/Boehringer-Ingelheim-Logo.png",
        "color": "#0033CC",
        "description": "Medicamentos veterinarios"
      },
      {
        "name": "CEVA",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Ceva-Logo.png",
        "color": "#FF6600",
        "description": "Productos farmacéuticos"
      },
      {
        "name": "ELANCO",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Elanco-Logo.png",
        "color": "#00A651",
        "description": "Medicamentos especializados"
      },
      {
        "name": "MERCK",
        "logo": "https://logos-world.net/wp-content/uploads/2020/04/Merck-Logo.png",
        "color": "#FF0000",
        "description": "Vacunas e inmunológicos"
      },
      {
        "name": "MSD",
        "logo": "https://logos-world.net/wp-content/uploads/2020/04/MSD-Logo.png",
        "color": "#CC0000",
        "description": "Vacunas veterinarias"
      },
      {
        "name": "Old Prince Equilibrium",
        "logo": "https://i.imgur.com/HG2iUn9.png",
        "color": "#4b5563",
        "description": ""
      },
      {
        "name": "VIRBAC",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Virbac-Logo.png",
        "color": "#003366",
        "description": "Productos veterinarios premium"
      },
      {
        "name": "ZOETIS",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Zoetis-Logo.png",
        "color": "#0066CC",
        "description": "Medicamentos veterinarios líderes"
      }
    ]
  },
  "petshops": {
    "title": "Laboratorios y Marcas",
    "subtitle": "",
    "brands": [
      {
        "name": "COMPANY",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Company-Logo.png",
        "color": "#4169E1",
        "description": "Alimentos balanceados"
      },
      {
        "name": "FAWNA",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Fawna-Logo.png",
        "color": "#FF69B4",
        "description": "Alimentos naturales"
      },
      {
        "name": "MANADA",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Manada-Logo.png",
        "color": "#FF8C00",
        "description": "Alimentos especializados"
      },
      {
        "name": "OLD PRINCE",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Old-Prince-Logo.png",
        "color": "#8B4513",
        "description": "Alimentos premium para mascotas"
      },
      {
        "name": "ORIGEN",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Origen-Logo.png",
        "color": "#32CD32",
        "description": "Alimentos orgánicos"
      },
      {
        "name": "SEGUIDOR",
        "logo": "https://logos-world.net/wp-content/uploads/2021/02/Seguidor-Logo.png",
        "color": "#9370DB",
        "description": "Alimentos premium"
      }
    ]
  }
}

// Función para obtener configuración por tipo de usuario
export const getBrandsConfig = (userType) => {
  return brandsConfig[userType] || brandsConfig.veterinarios
}