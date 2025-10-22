<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Header -->
        <div class="page-header mb-6">
          <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Equipos</h1>
          <p class="text-body-2 text-grey-darken-1">{{ nombreDivision }} - Todos los equipos participantes</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <!-- Sin equipos -->
        <v-card v-else-if="equipos.length === 0" elevation="0" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2">mdi-shield-star</v-icon>
            <p class="text-h6 text-grey-darken-1 mt-4 mb-0">No hay equipos registrados en esta división</p>
          </v-card-text>
        </v-card>

        <!-- Grid de Equipos -->
        <v-row v-else>
          <v-col
            v-for="equipo in equiposConEstadisticas"
            :key="equipo.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="equipo-card" elevation="0" @click="verEquipo(equipo.id)">
              <!-- Header del equipo -->
              <div class="equipo-header">
                <v-avatar color="white" size="64" class="elevation-2">
                  <v-icon size="36" color="primary">mdi-shield</v-icon>
                </v-avatar>
              </div>

              <v-card-text class="text-center pa-4">
                <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-2">
                  {{ equipo.nombre }}
                </h3>

                <!-- Estadísticas -->
                <div class="equipo-stats">
                  <div class="stat-item">
                    <div class="stat-valor">{{ equipo.posicion }}º</div>
                    <div class="stat-label">Posición</div>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="stat-item">
                    <div class="stat-valor">{{ equipo.puntos }}</div>
                    <div class="stat-label">Puntos</div>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="stat-item">
                    <div class="stat-valor">{{ equipo.partidosJugados }}</div>
                    <div class="stat-label">PJ</div>
                  </div>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-3">
                <v-btn variant="text" size="small" color="primary" block>
                  Ver plantilla
                  <v-icon end size="18">mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFirestore } from '../composables/useFirestore';
import { useDivision } from '../composables/useDivision';
import AppHeader from '../components/AppHeader.vue';

const router = useRouter();
const { loading, getCollection } = useFirestore();
const { division, nombreDivision, divisionSlug } = useDivision();

const equipos = ref([]);
const partidos = ref([]);

const equiposConEstadisticas = computed(() => {
  const stats = equipos.value.map(equipo => {
    const partidosLocal = partidos.value.filter(p => 
      p.equipoLocalId === equipo.id && p.finalizado
    );
    const partidosVisitante = partidos.value.filter(p => 
      p.equipoVisitanteId === equipo.id && p.finalizado
    );

    let ganados = 0, empatados = 0, perdidos = 0;

    partidosLocal.forEach(p => {
      const golesL = getGolesLocal(p);
      const golesV = getGolesVisitante(p);
      if (golesL > golesV) ganados++;
      else if (golesL === golesV) empatados++;
      else perdidos++;
    });

    partidosVisitante.forEach(p => {
      const golesL = getGolesLocal(p);
      const golesV = getGolesVisitante(p);
      if (golesV > golesL) ganados++;
      else if (golesV === golesL) empatados++;
      else perdidos++;
    });

    return {
      ...equipo,
      partidosJugados: partidosLocal.length + partidosVisitante.length,
      ganados,
      empatados,
      perdidos,
      puntos: (ganados * 3) + empatados
    };
  });

  const sorted = stats.sort((a, b) => b.puntos - a.puntos);
  
  return sorted.map((equipo, index) => ({
    ...equipo,
    posicion: index + 1
  }));
});

const getGolesLocal = (p) => {
  if (Array.isArray(p.golesLocal)) return p.golesLocal.length;
  return p.golesLocal || 0;
};

const getGolesVisitante = (p) => {
  if (Array.isArray(p.golesVisitante)) return p.golesVisitante.length;
  return p.golesVisitante || 0;
};

const verEquipo = (equipoId) => {
  router.push(`/${divisionSlug.value}/equipo/${equipoId}`);
};

const cargarDatos = async () => {
  console.log('Cargando equipos para división:', division.value);
  
  // Cargar TODOS los equipos y filtrar por división
  const todosEquipos = await getCollection('equipos');
  equipos.value = todosEquipos.filter(e => e.division === division.value);
  
  console.log('Equipos encontrados:', equipos.value.length);
  
  // Obtener IDs de equipos de esta división
  const equiposIds = equipos.value.map(e => e.id);
  
  // Cargar partidos solo de esta división
  const todosPartidos = await getCollection('partidos');
  partidos.value = todosPartidos.filter(p => 
    equiposIds.includes(p.equipoLocalId) && equiposIds.includes(p.equipoVisitanteId)
  );
  
  console.log('Partidos encontrados:', partidos.value.length);
};

// Recargar cuando cambie la división
watch(division, () => {
  console.log('División cambió a:', division.value);
  cargarDatos();
});

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.header-bar {
  border-bottom: 1px solid #E2E8F0 !important;
}

.nav-bar {
  border-bottom: 1px solid #E2E8F0 !important;
}

.main-content {
  background: #F8FAFC;
}

.empty-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

.equipo-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  transition: all 0.2s ease;
  cursor: pointer;
  background: white;
  height: 100%;
}

.equipo-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
  transform: translateY(-4px);
}

.equipo-header {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.equipo-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 0;
  margin-top: 8px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-valor {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2563EB;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 600px) {
  .stat-valor {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}
</style>
