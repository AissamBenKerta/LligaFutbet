<template>
  <v-app>
    <!-- Header Admin -->
    <v-app-bar color="primary" elevation="0" height="64">
      <v-container class="d-flex align-center">
        <div class="d-flex align-center">
          <v-avatar color="white" size="36" class="mr-3">
            <v-img src="https://www.escoladefutboldesabadell.com/wp-content/uploads/2023/01/Logo_escola_80x80.png" alt="Logo" cover></v-img>
          </v-avatar>
          <div>
            <div class="text-body-1 font-weight-bold text-white">Panel de Administración</div>
            <div class="text-caption text-blue-lighten-4">Lliga Futbet</div>
          </div>
        </div>
        <v-spacer></v-spacer>
        
        <!-- User menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" color="white">
              <v-icon start>mdi-account-circle</v-icon>
              {{ user?.email || 'Admin' }}
              <v-icon end>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleLogout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Cerrar Sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="admin-main">
      <v-container fluid class="pa-6">
        <!-- Dashboard -->
        <div v-if="activeSection === 'dashboard'">
          <!-- Header -->
          <div class="page-header mb-6">
            <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Dashboard</h1>
            <p class="text-body-2 text-grey-darken-1">Resumen general de la liga</p>
          </div>

          <!-- Stats Cards -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-5">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div class="stat-icon primary">
                      <v-icon color="primary" size="24">mdi-shield</v-icon>
                    </div>
                    <v-chip size="small" color="success" variant="flat">Activos</v-chip>
                  </div>
                  <div class="stat-valor">{{ totalEquipos }}</div>
                  <div class="stat-label">Equipos</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-5">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div class="stat-icon success">
                      <v-icon color="success" size="24">mdi-account-group</v-icon>
                    </div>
                    <v-chip size="small" color="success" variant="flat">Total</v-chip>
                  </div>
                  <div class="stat-valor">{{ totalJugadores }}</div>
                  <div class="stat-label">Jugadores</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-5">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div class="stat-icon accent">
                      <v-icon color="accent" size="24">mdi-scoreboard</v-icon>
                    </div>
                    <v-chip size="small" color="info" variant="flat">En curso</v-chip>
                  </div>
                  <div class="stat-valor">{{ totalPartidos }}</div>
                  <div class="stat-label">Partidos</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-5">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <div class="stat-icon warning">
                      <v-icon color="warning" size="24">mdi-soccer</v-icon>
                    </div>
                    <v-chip size="small" color="warning" variant="flat">Total</v-chip>
                  </div>
                  <div class="stat-valor">{{ totalGoles }}</div>
                  <div class="stat-label">Goles</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Quick Actions -->
          <v-row>
            <v-col cols="12">
              <v-card elevation="0" class="action-card">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
                  Acciones Rápidas
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-5">
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-btn
                        variant="outlined"
                        color="primary"
                        block
                        size="large"
                        prepend-icon="mdi-plus-circle"
                        @click="activeSection = 'equipos'"
                      >
                        Gestionar Equipos
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-btn
                        variant="outlined"
                        color="primary"
                        block
                        size="large"
                        prepend-icon="mdi-account-plus"
                        @click="activeSection = 'jugadores'"
                      >
                        Gestionar Jugadores
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-btn
                        variant="outlined"
                        color="primary"
                        block
                        size="large"
                        prepend-icon="mdi-calendar-plus"
                        @click="activeSection = 'partidos'"
                      >
                        Gestionar Partidos
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Gestión con Tabs -->
        <div v-else>
          <v-card elevation="0" class="admin-card">
            <Tabs :tabs="['Equipos', 'Jugadores', 'Partidos']" :active-index="getTabIndex()">
              <TabPanel :index="0">
                <div class="tab-content">
                  <EquiposManager @reload="cargarDatos" />
                </div>
              </TabPanel>
              <TabPanel :index="1">
                <div class="tab-content">
                  <JugadoresManager @reload="cargarDatos" />
                </div>
              </TabPanel>
              <TabPanel :index="2">
                <div class="tab-content">
                  <PartidosManager @reload="cargarDatos" />
                </div>
              </TabPanel>
            </Tabs>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useFirestore } from '../composables/useFirestore';
import Tabs from '../components/Tabs.vue';
import TabPanel from '../components/TabPanel.vue';
import EquiposManager from '../components/admin/EquiposManager.vue';
import JugadoresManager from '../components/admin/JugadoresManager.vue';
import PartidosManager from '../components/admin/PartidosManager.vue';

const router = useRouter();
const { user, logout } = useAuth();
const { getCollection } = useFirestore();

const activeSection = ref('dashboard');
const equipos = ref([]);
const jugadores = ref([]);
const partidos = ref([]);

const menuItems = [
  { 
    title: 'Dashboard', 
    icon: 'mdi-view-dashboard', 
    value: 'dashboard',
    action: () => activeSection.value = 'dashboard'
  },
  { 
    title: 'Equipos', 
    icon: 'mdi-shield-star', 
    value: 'equipos',
    action: () => activeSection.value = 'equipos'
  },
  { 
    title: 'Jugadores', 
    icon: 'mdi-account-group', 
    value: 'jugadores',
    action: () => activeSection.value = 'jugadores'
  },
  { 
    title: 'Partidos', 
    icon: 'mdi-scoreboard', 
    value: 'partidos',
    action: () => activeSection.value = 'partidos'
  },
];

const totalEquipos = computed(() => equipos.value.length);
const totalJugadores = computed(() => jugadores.value.length);
const totalPartidos = computed(() => partidos.value.length);
const totalGoles = computed(() => {
  return partidos.value
    .filter(p => p.finalizado)
    .reduce((sum, p) => {
      const golesL = Array.isArray(p.golesLocal) ? p.golesLocal.length : (p.golesLocal || 0);
      const golesV = Array.isArray(p.golesVisitante) ? p.golesVisitante.length : (p.golesVisitante || 0);
      return sum + golesL + golesV;
    }, 0);
});

const getTabIndex = () => {
  const mapping = {
    'equipos': 0,
    'jugadores': 1,
    'partidos': 2
  };
  return mapping[activeSection.value] || 0;
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const cargarDatos = async () => {
  equipos.value = await getCollection('equipos');
  jugadores.value = await getCollection('jugadores');
  partidos.value = await getCollection('partidos');
};

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.admin-main {
  background: #F8FAFC;
}

.admin-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
  overflow: hidden;
}

.tab-content {
  padding: 24px;
}

.stat-card,
.action-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.primary {
  background: #EFF6FF;
}

.stat-icon.success {
  background: #F0FDF4;
}

.stat-icon.accent {
  background: #EFF6FF;
}

.stat-icon.warning {
  background: #FFFBEB;
}

.stat-valor {
  font-size: 2rem;
  font-weight: 800;
  color: #1E293B;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  padding: 20px !important;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}
</style>
