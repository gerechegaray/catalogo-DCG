// Servicio para generar PDFs de lista de precios (versión simplificada)
import jsPDF from 'jspdf'

class PDFService {
  constructor() {
    this.doc = null
    this.pageWidth = 210 // A4 width in mm
    this.pageHeight = 297 // A4 height in mm
    this.margin = 15 // Reducir margen para más espacio
    this.rightMargin = 20 // Margen derecho más grande para evitar que se salgan los precios
    this.currentY = 0
    this.lineHeight = 5 // Reducir altura de línea
    this.rowHeight = 6 // Reducir altura de fila
    this.fontSize = 8 // Reducir tamaño de fuente
    this.logoHeight = 35 // Mucho más grande el logo
  }

  // Generar PDF de lista de precios
  async generatePriceList(products, options = {}) {
    try {
      // Inicializar documento
      this.doc = new jsPDF()
      this.currentY = this.margin

      // Configuración por defecto
      const config = {
        includeSuggestedPrice: true,
        companyName: 'DCG Veterinaria',
        companyLogo: null,
        ...options
      }

      // Agregar header
      await this.addHeader(config)
      
      // Agregar tabla de productos
      this.addProductsTable(products, config)
      
      // Agregar footer
      this.addFooter()

      // Generar nombre del archivo
      const fileName = this.generateFileName()
      
      // Descargar PDF
      this.doc.save(fileName)
      
      console.log('✅ PDF generado exitosamente:', fileName)
      return true

    } catch (error) {
      console.error('❌ Error generando PDF:', error)
      throw error
    }
  }

  // Agregar header al PDF
  async addHeader(config) {
    const { companyLogo } = config

    // Logo a la izquierda (si está disponible)
    let logoHeight = 0
    if (companyLogo) {
      try {
        const logoUrl = '/DCG JPG-01.jpg'
        logoHeight = await this.addLogoLeft(logoUrl)
      } catch (error) {
        console.warn('⚠️ No se pudo cargar el logo:', error)
      }
    }

    // Título y fecha a la derecha
    this.addTitleAndDateRight(logoHeight)

    // Línea separadora
    this.currentY += 5 // Reducido de 8 a 5
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 5 // Reducido de 8 a 5
  }

  // Agregar logo a la izquierda
  async addLogoLeft(imageUrl) {
    try {
      // Crear una imagen desde la URL
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Calcular dimensiones del logo más grande
            const maxWidth = 80 // Más grande que antes
            const maxHeight = 50 // Más alto también
            
            // Calcular dimensiones manteniendo proporción original
            let logoWidth = maxWidth
            let logoHeight = logoWidth * (img.height / img.width)
            
            // Si la altura excede el máximo, ajustar por altura
            if (logoHeight > maxHeight) {
              logoHeight = maxHeight
              logoWidth = logoHeight * (img.width / img.height)
            }
            
            // Posicionar el logo a la izquierda
            const logoX = this.margin
            const logoY = this.currentY
            
            // Agregar el logo al PDF
            this.doc.addImage(img, 'JPEG', logoX, logoY, logoWidth, logoHeight)
            
            // Retornar la altura del logo para alinear el texto
            resolve(logoHeight)
          } catch (error) {
            reject(error)
          }
        }
        
        img.onerror = () => reject(new Error('Error cargando imagen'))
        img.src = imageUrl
      })
    } catch (error) {
      console.error('Error agregando logo:', error)
      throw error
    }
  }

  // Agregar título y fecha a la derecha
  addTitleAndDateRight(logoHeight) {
    // Calcular posición Y para alinear con el logo
    const textY = this.currentY + (logoHeight > 0 ? logoHeight / 2 : 0)
    
    // Título principal
    this.doc.setFontSize(18) // Tamaño moderado
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('LISTA DE PRECIOS', this.pageWidth - this.rightMargin, textY, { align: 'right' })
    
    // Fecha de exportación
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'italic')
    const currentDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    this.doc.text(`Fecha de exportación: ${currentDate}`, this.pageWidth - this.rightMargin, textY + 8, { align: 'right' })
    
    // Actualizar currentY para el siguiente elemento
    this.currentY = this.currentY + Math.max(logoHeight, 25) // Usar la altura mayor
  }

  // Determinar si una categoría debe mostrar precio sugerido
  shouldShowSuggestedPrice(category) {
    // Categorías que SÍ deben mostrar precio sugerido
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

  // Determinar configuración de columnas basada en los productos
  determineColumnConfig(products) {
    // Verificar si AL MENOS UN producto pertenece a categorías que requieren precio sugerido
    const hasSuggestedPriceCategory = products.some(product => 
      this.shouldShowSuggestedPrice(product.category)
    )
    
    // Siempre usar "PRECIO SUGERIDO" como título, pero el contenido será dinámico
    return {
      includeSuggestedPrice: hasSuggestedPriceCategory,
      thirdColumnTitle: 'PRECIO SUGERIDO'
    }
  }

  // Agregar tabla de productos (versión agrupada)
  addProductsTable(products, config) {
    // Determinar configuración de columnas basada en los productos
    const columnConfig = this.determineColumnConfig(products)
    const { includeSuggestedPrice, thirdColumnTitle } = columnConfig

    // Configurar columnas simplificadas (sin categoría y subcategoría)
    const columns = [
      { title: 'PRODUCTO', width: 100 }, // Reducido para dar más espacio a precios
      { title: 'PRECIO', width: 30 } // Reducido para que quepa mejor
    ]

    // Siempre agregar la tercera columna, pero con título dinámico
    columns.push({ title: thirdColumnTitle, width: 35 })

    // Calcular posiciones de columnas
    let currentX = this.margin
    const availableWidth = this.pageWidth - this.margin - this.rightMargin // Usar margen derecho
    const totalColumnsWidth = columns.reduce((sum, col) => sum + col.width, 0)
    
    // Si las columnas no caben, ajustar proporcionalmente
    if (totalColumnsWidth > availableWidth) {
      const scaleFactor = availableWidth / totalColumnsWidth
      columns.forEach(col => {
        col.width = Math.floor(col.width * scaleFactor)
      })
    }
    
    const columnPositions = columns.map(col => {
      const pos = currentX
      currentX += col.width
      return pos
    })

    // Agrupar productos según la configuración
    const groupedProducts = this.groupProductsForDisplay(products, config)
    
    // Dibujar productos agrupados
    this.drawGroupedProducts(groupedProducts, columns, columnPositions, includeSuggestedPrice)
  }

  // Dibujar header de la tabla
  drawTableHeader(columns, columnPositions) {
    // Fondo del header
    this.doc.setFillColor(41, 128, 185) // Azul corporativo
    this.doc.rect(this.margin, this.currentY - 2, this.pageWidth - 2 * this.margin, this.rowHeight + 1, 'F')
    
    // Texto del header
    this.doc.setFontSize(this.fontSize + 1) // Un poco más grande para el header
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(255, 255, 255)
    
    columns.forEach((column, index) => {
      const x = columnPositions[index] + 1
      const y = this.currentY + 1
      this.doc.text(column.title, x, y)
    })
    
    this.currentY += this.rowHeight + 2
  }

  // Agrupar productos según la configuración del modal
  groupProductsForDisplay(products, config) {
    const { groupBy } = config
    
    if (groupBy === 'category') {
      // Agrupar por categoría, mostrar subcategoría en columna
      return this.groupByCategory(products)
    } else if (groupBy === 'subcategory') {
      // Agrupar por subcategoría, mostrar categoría en columna
      return this.groupBySubcategory(products)
    } else {
      // Agrupar por categoría por defecto
      return this.groupByCategory(products)
    }
  }

  // Agrupar por categoría
  groupByCategory(products) {
    const grouped = {}
    
    products.forEach(product => {
      const category = product.category || 'Sin categoría'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(product)
    })
    
    // Ordenar productos dentro de cada categoría alfabéticamente
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    })
    
    return grouped
  }

  // Agrupar por subcategoría
  groupBySubcategory(products) {
    const grouped = {}
    
    products.forEach(product => {
      const subcategory = product.subcategory || 'Sin subcategoría'
      if (!grouped[subcategory]) {
        grouped[subcategory] = []
      }
      grouped[subcategory].push(product)
    })
    
    // Ordenar productos dentro de cada subcategoría alfabéticamente
    Object.keys(grouped).forEach(subcategory => {
      grouped[subcategory].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    })
    
    return grouped
  }

  // Dibujar productos agrupados con subtítulos
  drawGroupedProducts(groupedProducts, columns, columnPositions, includeSuggestedPrice) {
    // Ordenar los grupos alfabéticamente
    const sortedGroupNames = Object.keys(groupedProducts).sort()
    
    sortedGroupNames.forEach(groupName => {
      const products = groupedProducts[groupName]
      
      // Determinar si este grupo específico necesita precio sugerido
      const groupNeedsSuggestedPrice = products.some(product => 
        this.shouldShowSuggestedPrice(product.category)
      )
      
      // Crear columnas específicas para este grupo
      const groupColumns = [
        { title: 'PRODUCTO', width: columns[0].width },
        { title: 'PRECIO', width: columns[1].width },
        { title: groupNeedsSuggestedPrice ? 'PRECIO SUGERIDO' : 'SUBCATEGORÍA', width: columns[2].width }
      ]
      
      // Dibujar subtítulo del grupo
      this.drawGroupTitle(groupName)
      
      // Dibujar header de la tabla para este grupo con sus columnas específicas
      this.drawTableHeader(groupColumns, columnPositions)
      
      // Dibujar productos del grupo
      this.drawProductRows(products, groupColumns, columnPositions, includeSuggestedPrice)
      
      // Espacio entre grupos
      this.currentY += 10
    })
  }

  // Dibujar título del grupo
  drawGroupTitle(groupName) {
    // Verificar si necesitamos nueva página
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage()
      this.currentY = this.margin
    }
    
    // Línea separadora antes del título
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 5
    
    // Título del grupo
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185) // Azul corporativo
    this.doc.text(groupName.toUpperCase(), this.margin, this.currentY)
    this.currentY += 8
  }

  // Dibujar filas de productos
  drawProductRows(products, columns, columnPositions, includeSuggestedPrice) {
    this.doc.setFontSize(this.fontSize)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(0, 0, 0) // Asegurar que el texto sea negro
    
    let rowIndex = 0
    
    products.forEach(product => {
      // Verificar si necesitamos nueva página (más espacio para productos)
      if (this.currentY > this.pageHeight - 30) {
        this.doc.addPage()
        this.currentY = this.margin
        this.drawTableHeader(columns, columnPositions)
        rowIndex = 0
        // Asegurar que el color del texto sea negro en la nueva página
        this.doc.setTextColor(0, 0, 0)
        // Asegurar que la fuente sea consistente en la nueva página
        this.doc.setFont('helvetica', 'normal')
        this.doc.setFontSize(this.fontSize)
      }
      
      // Alternar color de fondo
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(245, 245, 245)
        this.doc.rect(this.margin, this.currentY - 1, this.pageWidth - 2 * this.margin, this.rowHeight, 'F')
      }
      
      // Determinar si este producto específico debe mostrar precio sugerido
      const showSuggestedForThisProduct = this.shouldShowSuggestedPrice(product.category)
      
      // Datos del producto (solo nombre y precios)
      const rowData = [
        this.truncateText(product.name || 'Sin nombre', 60), // Ajustado para el nuevo ancho
        this.formatPrice(product.price || 0)
      ]
      
      if (includeSuggestedPrice && showSuggestedForThisProduct) {
        // Mostrar precio sugerido para productos de categorías específicas
        const suggestedPrice = this.calculateSuggestedPrice(product.price || 0)
        rowData.push(this.formatPrice(suggestedPrice))
      } else if (includeSuggestedPrice && !showSuggestedForThisProduct) {
        // Mostrar subcategoría para productos que no necesitan precio sugerido
        rowData.push(product.subcategory || 'Sin subcategoría')
      } else {
        // Mostrar subcategoría cuando no hay productos con precio sugerido
        rowData.push(product.subcategory || 'Sin subcategoría')
      }
      
      // Dibujar datos de la fila
      rowData.forEach((data, index) => {
        const x = columnPositions[index] + 1
        const y = this.currentY + 1
        
        // Asegurar que el texto sea negro antes de dibujar
        this.doc.setTextColor(0, 0, 0)
        
        if (index === 1) { // Solo precio alineado a la derecha
          // Calcular posición exacta para alineación perfecta sin desbordamiento
          const rightEdge = columnPositions[index] + columns[index].width - 2
          this.doc.text(data, rightEdge, y, { align: 'right' })
        } else if (index === 2 && includeSuggestedPrice && this.shouldShowSuggestedPrice(product.category)) {
          // Precio sugerido alineado a la derecha solo si es realmente un precio
          const rightEdge = columnPositions[index] + columns[index].width - 2
          this.doc.text(data, rightEdge, y, { align: 'right' })
        } else {
          // Producto y subcategoría alineados a la izquierda
          this.doc.text(data, x, y)
        }
      })
      
      this.currentY += this.rowHeight + 1
      rowIndex++
    })
  }

  // Truncar texto si es muy largo
  truncateText(text, maxLength) {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text
  }

  // Agregar footer al PDF
  addFooter() {
    // Ir al final de la página
    const footerY = this.pageHeight - this.margin - 10

    // Línea separadora
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, footerY - 15, this.pageWidth - this.margin, footerY - 15)

    // Texto de disclaimer
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'italic')
    this.doc.text('Precios sujetos a modificación sin previo aviso.', this.pageWidth / 2, footerY - 5, { align: 'center' })
  }

  // Formatear precio
  formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
      return '$0'
    }
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Calcular precio sugerido (20% más que el precio base)
  calculateSuggestedPrice(basePrice) {
    if (typeof basePrice !== 'number' || isNaN(basePrice)) {
      return 0
    }
    
    return Math.round(basePrice * 1.2) // 20% de margen
  }

  // Generar nombre del archivo
  generateFileName() {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
    
    return `lista-precios-${dateStr}-${timeStr}.pdf`
  }

  // Agregar logo al PDF
  async addLogo(imageUrl) {
    try {
      // Crear una imagen desde la URL
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Calcular dimensiones del logo manteniendo proporciones
            const maxWidth = 60 // Mucho más grande el logo
            const maxHeight = this.logoHeight // Usar altura máxima definida
            
            // Calcular dimensiones manteniendo proporción original
            let logoWidth = maxWidth
            let logoHeight = logoWidth * (img.height / img.width)
            
            // Si la altura excede el máximo, ajustar por altura
            if (logoHeight > maxHeight) {
              logoHeight = maxHeight
              logoWidth = logoHeight * (img.width / img.height)
            }
            
            // Posicionar el logo en el centro
            const logoX = (this.pageWidth - logoWidth) / 2
            const logoY = this.currentY
            
            // Agregar el logo al PDF manteniendo proporciones
            this.doc.addImage(img, 'JPEG', logoX, logoY, logoWidth, logoHeight)
            
            // Actualizar posición Y
            this.currentY += logoHeight + 5
            
            resolve(true)
          } catch (error) {
            reject(error)
          }
        }
        
        img.onerror = () => {
          reject(new Error('No se pudo cargar la imagen del logo'))
        }
        
        // Cargar la imagen
        img.src = imageUrl
      })
    } catch (error) {
      console.warn('⚠️ Error adding logo:', error)
      return false
    }
  }

  // Validar productos antes de generar PDF
  validateProducts(products) {
    if (!Array.isArray(products)) {
      throw new Error('Los productos deben ser un array')
    }
    
    if (products.length === 0) {
      throw new Error('No hay productos para exportar')
    }
    
    return true
  }
}

// Exportar instancia única
export default new PDFService()