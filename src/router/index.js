import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

// Vistas Públicas
import HomeView from '../views/HomeView.vue';
import ResultadosView from '../views/ResultadosView.vue';
import CalendarioView from '../views/CalendarioView.vue';
import ClasificacionView from '../views/ClasificacionView.vue';
import EquiposView from '../views/EquiposView.vue';
import EquipoDetalleView from '../views/EquipoDetalleView.vue';
import PartidoDetalleView from '../views/PartidoDetalleView.vue';

// Vistas Admin
import LoginView from '../views/LoginView.vue';
import AdminView from '../views/AdminView.vue';
import AdminEquiposView from '../views/admin/AdminEquiposView.vue';
import AdminJugadoresView from '../views/admin/AdminJugadoresView.vue';
import AdminPartidosView from '../views/admin/AdminPartidosView.vue';

const routes = [
  {
    path: '/',
    redirect: '/1'
  },
  {
    path: '/:division(1|2)',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/:division(1|2)/resultados',
    name: 'Resultados',
    component: ResultadosView
  },
  {
    path: '/:division(1|2)/calendario',
    name: 'Calendario',
    component: CalendarioView
  },
  {
    path: '/:division(1|2)/clasificacion',
    name: 'Clasificacion',
    component: ClasificacionView
  },
  {
    path: '/:division(1|2)/equipos',
    name: 'Equipos',
    component: EquiposView
  },
  {
    path: '/:division(1|2)/equipo/:id',
    name: 'EquipoDetalle',
    component: EquipoDetalleView
  },
  {
    path: '/:division(1|2)/partido/:id',
    name: 'PartidoDetalle',
    component: PartidoDetalleView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/equipos',
    name: 'AdminEquipos',
    component: AdminEquiposView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/jugadores',
    name: 'AdminJugadores',
    component: AdminJugadoresView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/partidos',
    name: 'AdminPartidos',
    component: AdminPartidosView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const { user } = useAuth();
  
  if (to.meta.requiresAuth && !user.value) {
    next('/login');
  } else {
    next();
  }
});

export default router;
