<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Header -->
        <div class="page-header mb-6">
          <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Calendario</h1>
          <p class="text-body-2 text-grey-darken-1">{{ nombreDivision }} - Próximos partidos programados</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <!-- Sin partidos -->
        <v-card v-else-if="partidosProgramados.length === 0" elevation="0" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2">mdi-calendar-blank</v-icon>
            <p class="text-h6 text-grey-darken-1 mt-4 mb-0">No hay partidos programados</p>
          </v-card-text>
        </v-card>

        <!-- Calendario por Jornadas -->
        <div v-else>
          <div v-for="jornada in jornadasConPartidos" :key="jornada" class="jornada-section mb-6">
            <!-- Header Jornada -->
            <div class="jornada-header mb-4">
              <v-icon color="primary" size="24" class="mr-2">mdi-calendar-range</v-icon>
              <h2 class="text-h6 font-weight-bold text-grey-darken-3">Jornada {{ jornada }}</h2>
            </div>

            <!-- Partidos de la Jornada -->
            <v-card
              v-for="partido in partidosPorJornada(jornada)" 
              :key="partido.id"
              class="partido-card mb-3"
              elevation="0"
            >
              <v-card-text class="pa-5">
                <!-- Fecha y hora -->
                <div class="text-center mb-4">
                  <v-chip size="small" variant="flat" color="primary">
                    <v-icon start size="16">mdi-calendar</v-icon>
                    {{ formatearFechaCompleta(partido.fecha) }}
                  </v-chip>
                  <v-chip v-if="partido.estadio" size="small" variant="outlined" color="grey-darken-1" class="ml-2">
                    <v-icon start size="16">mdi-map-marker</v-icon>
                    {{ partido.estadio }}
                  </v-chip>
                </div>

                <!-- Enfrentamiento -->
                <div class="vs-container">
                  <!-- Equipo Local -->
                  <div class="equipo-vs">
                    <v-avatar color="primary" size="56">
                      <v-icon size="32" color="white">mdi-shield</v-icon>
                    </v-avatar>
                    <div class="equipo-texto">
                      <div class="text-h6 font-weight-bold text-grey-darken-4">
                        {{ getNombreEquipo(partido.equipoLocalId) }}
                      </div>
                      <div class="text-caption text-grey-darken-1">Local</div>
                    </div>
                  </div>

                  <!-- VS -->
                  <div class="vs-badge">
                    <span class="vs-texto">VS</span>
                  </div>

                  <!-- Equipo Visitante -->
                  <div class="equipo-vs">
                    <div class="equipo-texto text-right">
                      <div class="text-h6 font-weight-bold text-grey-darken-4">
                        {{ getNombreEquipo(partido.equipoVisitanteId) }}
                      </div>
                      <div class="text-caption text-grey-darken-1">Visitante</div>
                    </div>
                    <v-avatar color="grey-darken-1" size="56">
                      <v-icon size="32" color="white">mdi-shield</v-icon>
                    </v-avatar>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useFirestore } from '../composables/useFirestore';
import { useDivision } from '../composables/useDivision';
import AppHeader from '../components/AppHeader.vue';

const { loading, getCollection } = useFirestore();
const { division, nombreDivision } = useDivision();

const partidos = ref([]);
const equipos = ref([]);

const partidosProgramados = computed(() => {
  return partidos.value
    .filter(p => !p.finalizado)
    .sort((a, b) => a.jornada - b.jornada || new Date(a.fecha) - new Date(b.fecha));
});

const jornadasConPartidos = computed(() => {
  const jornadas = [...new Set(partidosProgramados.value.map(p => p.jornada))];
  return jornadas.sort((a, b) => a - b);
});

const partidosPorJornada = (jornada) => {
  return partidosProgramados.value.filter(p => p.jornada === jornada);
};

const getNombreEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo ? equipo.nombre : 'Desconocido';
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const cargarDatos = async () => {
  const todosEquipos = await getCollection('equipos');
  equipos.value = todosEquipos.filter(e => e.division === division.value);
  
  const equiposIds = equipos.value.map(e => e.id);
  
  const todosPartidos = await getCollection('partidos');
  partidos.value = todosPartidos.filter(p => 
    equiposIds.includes(p.equipoLocalId) && equiposIds.includes(p.equipoVisitanteId)
  );
};

watch(division, () => {
  cargarDatos();
});

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.main-content {
  background: #F8FAFC;
}

.empty-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

.jornada-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.partido-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

.vs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
}

.equipo-vs {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.equipo-texto {
  flex: 1;
  min-width: 0;
}

.equipo-texto > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-badge {
  padding: 0 24px;
}

.vs-texto {
  font-size: 2rem;
  font-weight: 900;
  color: #CBD5E1;
  letter-spacing: 2px;
}

@media (max-width: 960px) {
  .vs-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .equipo-vs {
    width: 100%;
    justify-content: center;
  }
  
  .equipo-texto {
    text-align: center !important;
  }
  
  .vs-badge {
    padding: 16px 0;
  }
  
  .vs-texto {
    font-size: 1.5rem;
  }
}
</style>
