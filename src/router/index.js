import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    redirect: '/1' // Por defecto primera división
  },
  {
    path: '/:division(1|2)', // Solo acepta 1 o 2
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/:division(1|2)/resultados',
    name: 'Resultados',
    component: () => import('../views/ResultadosView.vue')
  },
  {
    path: '/:division(1|2)/calendario',
    name: 'Calendario',
    component: () => import('../views/CalendarioView.vue')
  },
  {
    path: '/:division(1|2)/clasificacion',
    name: 'Clasificacion',
    component: () => import('../views/ClasificacionView.vue')
  },
  {
    path: '/:division(1|2)/equipos',
    name: 'Equipos',
    component: () => import('../views/EquiposView.vue')
  },
  {
    path: '/:division(1|2)/equipo/:id',
    name: 'EquipoDetalle',
    component: () => import('../views/EquipoDetalleView.vue')
  },
  {
    path: '/:division(1|2)/partido/:id',
    name: 'PartidoDetalle',
    component: () => import('../views/PartidoDetalleView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory('/'), // <-- Cambiar aquí, quitar process.env.BASE_URL
  routes
});

// Opcional: Guard para rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // Aquí puedes verificar si el usuario está autenticado
    // Por ahora, permitir acceso
    next();
  } else {
    next();
  }
});

export default router;