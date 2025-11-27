/**
 * Servicio centralizado para manejo de errores
 * Proporciona logging consistente y mensajes de error amigables
 */

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  additionalData?: Record<string, any>
}

class ErrorHandler {
  /**
   * Procesa un error y retorna un mensaje amigable para el usuario
   */
  getErrorMessage(error: unknown, context?: ErrorContext): string {
    // Si es un Error con mensaje
    if (error instanceof Error) {
      // Mensajes específicos para errores comunes
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.'
      }
      
      if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        return 'No tienes permisos para realizar esta acción.'
      }
      
      if (error.message.includes('not found') || error.message.includes('404')) {
        return 'El recurso solicitado no fue encontrado.'
      }
      
      if (error.message.includes('timeout')) {
        return 'La operación tardó demasiado. Por favor, intenta nuevamente.'
      }
      
      // Mensaje genérico pero amigable
      return error.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
    }
    
    // Si es un string
    if (typeof error === 'string') {
      return error
    }
    
    // Error desconocido
    return 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
  }

  /**
   * Loggea un error con contexto para debugging
   */
  logError(error: unknown, context?: ErrorContext) {
    const timestamp = new Date().toISOString()
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    const logData = {
      timestamp,
      error: errorMessage,
      stack: errorStack,
      context: context || {},
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Log en consola (siempre)
    console.error('🚨 Error:', logData)

    // En desarrollo, mostrar más detalles
    if (process.env.NODE_ENV === 'development') {
      console.group('📋 Detalles del Error')
      console.error('Mensaje:', errorMessage)
      if (errorStack) {
        console.error('Stack:', errorStack)
      }
      if (context) {
        console.error('Contexto:', context)
      }
      console.groupEnd()
    }

    // Aquí podrías enviar el error a un servicio de logging externo
    // Por ejemplo: sendToErrorTrackingService(logData)
  }

  /**
   * Maneja un error completo: loggea y retorna mensaje amigable
   */
  handleError(error: unknown, context?: ErrorContext): string {
    this.logError(error, context)
    return this.getErrorMessage(error, context)
  }
}

// Exportar instancia única
export const errorHandler = new ErrorHandler()

// Helper function para usar en componentes
export const handleError = (error: unknown, context?: ErrorContext): string => {
  return errorHandler.handleError(error, context)
}

