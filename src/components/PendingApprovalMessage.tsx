import React from 'react'
import { Clock, Mail, AlertCircle } from 'lucide-react'

const PendingApprovalMessage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Icono */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <Clock className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          ¡Bienvenido!
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-6">
          Tu cuenta está pendiente de aprobación del administrador.
        </p>

        {/* Información */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-2">
                ¿Qué sigue?
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Revisaremos tu solicitud</li>
                <li>• Te contactaremos pronto</li>
                <li>• Recibirás un email cuando estés aprobado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email de contacto */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>¿Preguntas? Contáctanos: </span>
            <a 
              href="mailto:gerechegaray@gmail.com" 
              className="text-blue-600 hover:underline"
            >
              gerechegaray@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingApprovalMessage
