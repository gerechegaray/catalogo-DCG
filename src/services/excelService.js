import * as XLSX from 'xlsx'

class ExcelService {
  constructor() {
    this.companyName = 'DCG Veterinaria'
  }

  // Generar archivo Excel de lista de precios
  async generatePriceList(products, options = {}) {
    try {
      if (!products || products.length === 0) {
        throw new Error('No hay productos para exportar')
      }

      // Configuración por defecto
      const config = {
        includeSuggestedPrice: true,
        companyName: this.companyName,
        ...options
      }

      // Formatear datos para Excel
      const data = this.prepareDataForExcel(products, config)

      // Crear libro y hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Precios')

      // Ajustar anchos de columna (opcional)
      const wscols = [
        { wch: 40 }, // Producto
        { wch: 20 }, // Categoría
        { wch: 20 }, // Subcategoría
        { wch: 15 }, // Precio
        { wch: 15 }  // Precio Sugerido
      ]
      worksheet['!cols'] = wscols

      // Generar nombre de archivo
      const fileName = this.generateFileName()

      // Descargar archivo
      XLSX.writeFile(workbook, fileName)

      console.log('✅ Excel generado exitosamente:', fileName)
      return true

    } catch (error) {
      console.error('❌ Error generando Excel:', error)
      throw error
    }
  }

  // Preparar datos para Excel (versión "cruda" para edición del cliente)
  prepareDataForExcel(products, config) {
    // Ordenar productos por categoría y luego por nombre
    const sortedProducts = [...products].sort((a, b) => {
      const catA = (a.category || '').toLowerCase()
      const catB = (b.category || '').toLowerCase()
      if (catA < catB) return -1
      if (catA > catB) return 1
      
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })

    return sortedProducts.map(product => {
      const row = {
        'PRODUCTO': product.name || 'Sin nombre',
        'CATEGORÍA': product.category || 'Sin categoría',
        'SUBCATEGORÍA': product.subcategory || 'Sin subcategoría',
        'PRECIO': product.price || 0
      }

      // Agregar precio sugerido si la categoría aplica (como número, no como texto)
      if (this.shouldShowSuggestedPrice(product.category)) {
        row['PRECIO SUGERIDO'] = this.calculateSuggestedPrice(product.price || 0)
      } else {
        // En lugar de '-', dejarlo nulo para que la columna sea numérica pura
        row['PRECIO SUGERIDO'] = null
      }

      return row
    })
  }

  // Determinar si una categoría debe mostrar precio sugerido (mismo que pdfService)
  shouldShowSuggestedPrice(category) {
    const categoriesWithSuggestedPrice = [
      'COMPANY GATO',
      'COMPANY PERRO',
      'FAWNA PERRO',
      'FAWNA GATO',
      'ORIGEN GATO',
      'ORIGEN PERRO',
      'OLD PRINCE EQUILIBRIUM GATO',
      'OLD PRINCE EQUILIBRIUM PERRO',
      'OLD PRINCE NOVELES PERRO',
      'OLD PRINCE PREMIUM GATO',
      'OLD PRINCE PREMIUM PERRO',
      'SEGUIDOR',
      'MANADA'
    ]
    
    return categoriesWithSuggestedPrice.includes(category?.toUpperCase())
  }

  // Calcular precio sugerido (20% más que el precio base, mismo que pdfService)
  calculateSuggestedPrice(basePrice) {
    if (typeof basePrice !== 'number' || isNaN(basePrice)) {
      return 0
    }
    return Math.round(basePrice * 1.2)
  }

  // Generar nombre de archivo
  generateFileName() {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-')
    
    return `lista-precios-${dateStr}-${timeStr}.xlsx`
  }
}

export default new ExcelService()
