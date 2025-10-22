<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Header -->
        <div class="page-header mb-6">
          <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Resultados</h1>
          <p class="text-body-2 text-grey-darken-1">{{ nombreDivision }} - Todos los partidos finalizados</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <!-- Sin resultados -->
        <v-card v-else-if="partidosFinalizados.length === 0" elevation="0" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2">mdi-soccer-field</v-icon>
            <p class="text-h6 text-grey-darken-1 mt-4 mb-0">No hay partidos finalizados</p>
          </v-card-text>
        </v-card>

        <!-- Resultados por Jornada -->
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
              @click="verDetallePartido(partido)"
            >
              <v-card-text class="pa-5">
                <!-- Fecha -->
                <div class="text-center mb-4">
                  <v-chip size="small" variant="outlined" color="grey-darken-1">
                    <v-icon start size="16">mdi-clock-outline</v-icon>
                    {{ formatearFechaCompleta(partido.fecha) }}
                  </v-chip>
                  <v-chip v-if="partido.estadio" size="small" variant="outlined" color="grey-darken-1" class="ml-2">
                    <v-icon start size="16">mdi-map-marker</v-icon>
                    {{ partido.estadio }}
                  </v-chip>
                </div>

                <!-- Resultado HORIZONTAL -->
                <div class="resultado-horizontal">
                  <!-- Equipo Local -->
                  <div class="equipo-info">
                    <v-avatar 
                      :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'primary' : 'grey-lighten-3'" 
                      size="48"
                    >
                      <v-icon 
                        size="24" 
                        :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'white' : 'grey-darken-1'"
                      >
                        mdi-shield
                      </v-icon>
                    </v-avatar>
                    <div class="equipo-texto">
                      <div class="text-body-1 font-weight-bold text-grey-darken-4">
                        {{ getNombreEquipo(partido.equipoLocalId) }}
                      </div>
                      <div class="text-caption text-grey-darken-1">Local</div>
                    </div>
                  </div>

                  <!-- Marcador -->
                  <div class="marcador-horizontal">
                    <span 
                      class="marcador-numero" 
                      :class="getScoreClass(getGolesLocal(partido), getGolesVisitante(partido))"
                    >
                      {{ getGolesLocal(partido) }}
                    </span>
                    <span class="marcador-separador">-</span>
                    <span 
                      class="marcador-numero" 
                      :class="getScoreClass(getGolesVisitante(partido), getGolesLocal(partido))"
                    >
                      {{ getGolesVisitante(partido) }}
                    </span>
                  </div>

                  <!-- Equipo Visitante -->
                  <div class="equipo-info equipo-visitante">
                    <div class="equipo-texto text-right">
                      <div class="text-body-1 font-weight-bold text-grey-darken-4">
                        {{ getNombreEquipo(partido.equipoVisitanteId) }}
                      </div>
                      <div class="text-caption text-grey-darken-1">Visitante</div>
                    </div>
                    <v-avatar 
                      :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'primary' : 'grey-lighten-3'" 
                      size="48"
                    >
                      <v-icon 
                        size="24" 
                        :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'white' : 'grey-darken-1'"
                      >
                        mdi-shield
                      </v-icon>
                    </v-avatar>
                  </div>
                </div>

                <!-- Goleadores -->
                <div v-if="partido.golesLocal && partido.golesLocal.length > 0 || partido.golesVisitante && partido.golesVisitante.length > 0" class="goleadores-section mt-4">
                  <v-divider class="mb-3"></v-divider>
                  <div class="text-caption text-grey-darken-1 mb-2">
                    <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-soccer</v-icon>
                    Goleadores
                  </div>
                  <div class="goleadores-chips">
                    <v-chip
                      v-for="(gol, index) in partido.golesLocal"
                      :key="'local-' + index"
                      size="small"
                      variant="flat"
                      color="grey-lighten-4"
                      class="mr-2 mb-2"
                    >
                      <v-icon start size="16" color="grey-darken-1">mdi-soccer</v-icon>
                      {{ getNombreJugador(gol.jugadorId) }}
                    </v-chip>
                    <v-chip
                      v-for="(gol, index) in partido.golesVisitante"
                      :key="'visitante-' + index"
                      size="small"
                      variant="flat"
                      color="grey-lighten-4"
                      class="mr-2 mb-2"
                    >
                      <v-icon start size="16" color="grey-darken-1">mdi-soccer</v-icon>
                      {{ getNombreJugador(gol.jugadorId) }}
                    </v-chip>
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
import { useRouter } from 'vue-router';
import { useFirestore } from '../composables/useFirestore';
import { useDivision } from '../composables/useDivision';
import AppHeader from '../components/AppHeader.vue';

const router = useRouter();
const { loading, getCollection } = useFirestore();
const { division, nombreDivision, divisionSlug } = useDivision();

const partidos = ref([]);
const equipos = ref([]);
const jugadores = ref([]);

const partidosFinalizados = computed(() => {
  return partidos.value
    .filter(p => p.finalizado)
    .sort((a, b) => b.jornada - a.jornada || new Date(b.fecha) - new Date(a.fecha));
});

const jornadasConPartidos = computed(() => {
  const jornadas = [...new Set(partidosFinalizados.value.map(p => p.jornada))];
  return jornadas.sort((a, b) => b - a);
});

const partidosPorJornada = (jornada) => {
  return partidosFinalizados.value.filter(p => p.jornada === jornada);
};

const getNombreEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo ? equipo.nombre : 'Desconocido';
};

const getNombreJugador = (jugadorId) => {
  const jugador = jugadores.value.find(j => j.id === jugadorId);
  return jugador ? `${jugador.nombre} ${jugador.apellidos}` : 'Desconocido';
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

const getGolesLocal = (partido) => {
  if (Array.isArray(partido.golesLocal)) {
    return partido.golesLocal.length;
  }
  return partido.golesLocal || 0;
};

const getGolesVisitante = (partido) => {
  if (Array.isArray(partido.golesVisitante)) {
    return partido.golesVisitante.length;
  }
  return partido.golesVisitante || 0;
};

const getScoreClass = (score1, score2) => {
  if (score1 > score2) return 'winner';
  if (score1 < score2) return 'loser';
  return 'draw';
};

const verDetallePartido = (partido) => {
  router.push(`/${divisionSlug.value}/partido/${partido.id}`);
};

const cargarDatos = async () => {
  const todosEquipos = await getCollection('equipos');
  equipos.value = todosEquipos.filter(e => e.division === division.value);
  
  const equiposIds = equipos.value.map(e => e.id);
  
  const todosJugadores = await getCollection('jugadores');
  jugadores.value = todosJugadores.filter(j => equiposIds.includes(j.equipoId));
  
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

.page-header h1 {
  line-height: 1.2;
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
  transition: all 0.2s ease;
  cursor: pointer;
  background: white;
}

.partido-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
  transform: translateY(-2px);
}

.resultado-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.equipo-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.equipo-info.equipo-visitante {
  flex-direction: row-reverse;
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

.marcador-horizontal {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}

.marcador-numero {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.marcador-numero.winner {
  color: #2563EB;
}

.marcador-numero.loser {
  color: #94A3B8;
}

.marcador-numero.draw {
  color: #64748B;
}

.marcador-separador {
  color: #CBD5E1;
  font-weight: 600;
  font-size: 1.25rem;
}

.goleadores-chips {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .resultado-horizontal {
    flex-direction: column;
    gap: 12px;
  }
  
  .equipo-info {
    width: 100%;
    justify-content: center;
  }
  
  .equipo-info.equipo-visitante {
    flex-direction: row;
  }
  
  .equipo-texto {
    text-align: center !important;
  }
  
  .equipo-texto > div {
    text-align: center !important;
  }
  
  .marcador-horizontal {
    padding: 0;
  }
  
  .marcador-numero {
    font-size: 1.75rem;
  }
}
</style>
