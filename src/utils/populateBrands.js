import { saveBrand } from '../services/brandsService'

// Función para poblar marcas iniciales
export const populateInitialBrands = async () => {
  const initialBrands = [
    // Marcas veterinarias
    {
      name: 'ZOETIS',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Zoetis-Logo.png',
      color: '#0066CC',
      description: 'Medicamentos veterinarios líderes',
      category: 'veterinarios'
    },
    {
      name: 'BAYER',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Bayer-Logo.png',
      color: '#009639',
      description: 'Productos farmacéuticos innovadores',
      category: 'veterinarios'
    },
    {
      name: 'MERCK',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Merck-Logo.png',
      color: '#FF0000',
      description: 'Vacunas e inmunológicos',
      category: 'veterinarios'
    },
    {
      name: 'ELANCO',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Elanco-Logo.png',
      color: '#00A651',
      description: 'Medicamentos especializados',
      category: 'veterinarios'
    },
    {
      name: 'VIRBAC',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Virbac-Logo.png',
      color: '#003366',
      description: 'Productos veterinarios premium',
      category: 'veterinarios'
    },
    {
      name: 'MSD',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/MSD-Logo.png',
      color: '#CC0000',
      description: 'Vacunas veterinarias',
      category: 'veterinarios'
    },
    {
      name: 'BOEHRINGER',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Boehringer-Ingelheim-Logo.png',
      color: '#0033CC',
      description: 'Medicamentos veterinarios',
      category: 'veterinarios'
    },
    {
      name: 'CEVA',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Ceva-Logo.png',
      color: '#FF6600',
      description: 'Productos farmacéuticos',
      category: 'veterinarios'
    },
    // Marcas pet shops
    {
      name: 'OLD PRINCE',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Old-Prince-Logo.png',
      color: '#8B4513',
      description: 'Alimentos premium para mascotas',
      category: 'ambos'
    },
    {
      name: 'COMPANY',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Company-Logo.png',
      color: '#4169E1',
      description: 'Alimentos balanceados',
      category: 'petshops'
    },
    {
      name: 'FAWNA',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Fawna-Logo.png',
      color: '#FF69B4',
      description: 'Alimentos naturales',
      category: 'petshops'
    },
    {
      name: 'ORIGEN',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Origen-Logo.png',
      color: '#32CD32',
      description: 'Alimentos orgánicos',
      category: 'petshops'
    },
    {
      name: 'MANADA',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Manada-Logo.png',
      color: '#FF8C00',
      description: 'Alimentos especializados',
      category: 'petshops'
    },
    {
      name: 'SEGUIDOR',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Seguidor-Logo.png',
      color: '#9370DB',
      description: 'Alimentos premium',
      category: 'petshops'
    },
    // Laboratorios veterinarios para pet shops
    {
      name: 'FRONTLINE',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Frontline-Logo.png',
      color: '#FF6B35',
      description: 'Antiparasitarios para mascotas',
      category: 'petshops'
    },
    {
      name: 'ADVANTIX',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Advantix-Logo.png',
      color: '#4ECDC4',
      description: 'Antiparasitarios externos',
      category: 'petshops'
    },
    {
      name: 'DRONTAL',
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Drontal-Logo.png',
      color: '#45B7D1',
      description: 'Antiparasitarios internos',
      category: 'petshops'
    }
  ]

  try {
    console.log('🚀 Poblando marcas iniciales...')
    
    for (const brand of initialBrands) {
      await saveBrand(brand)
      console.log(`✅ Marca agregada: ${brand.name}`)
    }
    
    console.log('🎉 Todas las marcas iniciales han sido agregadas')
    return true
  } catch (error) {
    console.error('❌ Error al poblar marcas iniciales:', error)
    throw error
  }
}
