import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2563EB',      // Azul moderno
          secondary: '#64748B',    // Gris azulado
          accent: '#0EA5E9',       // Azul claro
          success: '#10B981',      // Verde limpio
          error: '#EF4444',        // Rojo limpio
          warning: '#F59E0B',      // Amarillo
          info: '#3B82F6',
          background: '#F8FAFC',   // Casi blanco
          surface: '#FFFFFF',
        }
      }
    }
  }
})
