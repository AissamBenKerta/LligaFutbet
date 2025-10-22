<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <div v-else-if="equipo">
          <!-- Botón volver -->
          <v-btn variant="text" color="primary" @click="volver" class="mb-4">
            <v-icon start>mdi-arrow-left</v-icon>
            Volver
          </v-btn>

          <!-- Header del Equipo -->
          <v-card elevation="0" class="equipo-header-card mb-6">
            <div class="equipo-header-banner">
              <v-container class="py-8">
                <div class="d-flex align-center">
                  <v-avatar color="white" size="120" class="elevation-4 mr-6">
                    <v-icon color="primary" size="64">mdi-shield</v-icon>
                  </v-avatar>
                  <div>
                    <h1 class="text-h3 font-weight-bold text-white mb-2">{{ equipo.nombre }}</h1>
                    <div class="d-flex gap-3 flex-wrap">
                      <v-chip color="white" variant="flat">
                        <v-icon start size="18" color="primary">mdi-trophy</v-icon>
                        {{ equipo.division === 1 ? 'Primera' : 'Segunda' }} División
                      </v-chip>
                      <v-chip color="white" variant="flat">
                        <v-icon start size="18" color="primary">mdi-account-group</v-icon>
                        {{ plantilla.length }} Jugadores
                      </v-chip>
                      <v-chip color="white" variant="flat">
                        <v-icon start size="18" color="primary">mdi-trophy</v-icon>
                        {{ estadisticas.posicion }}º en clasificación
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-container>
            </div>
          </v-card>

          <!-- Estadísticas -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="primary" size="56">
                      <v-icon color="white" size="28">mdi-scoreboard</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value">{{ estadisticas.partidosJugados }}</div>
                  <div class="stat-label">Partidos Jugados</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="success" size="56">
                      <v-icon color="white" size="28">mdi-check-circle</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value text-success">{{ estadisticas.ganados }}</div>
                  <div class="stat-label">Victorias</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="warning" size="56">
                      <v-icon color="white" size="28">mdi-equal</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value text-warning">{{ estadisticas.empatados }}</div>
                  <div class="stat-label">Empates</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="error" size="56">
                      <v-icon color="white" size="28">mdi-close-circle</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value text-error">{{ estadisticas.perdidos }}</div>
                  <div class="stat-label">Derrotas</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="accent" size="56">
                      <v-icon color="white" size="28">mdi-soccer</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value">{{ estadisticas.golesFavor }}</div>
                  <div class="stat-label">Goles a Favor</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="grey-darken-1" size="56">
                      <v-icon color="white" size="28">mdi-shield-alert</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value">{{ estadisticas.golesContra }}</div>
                  <div class="stat-label">Goles en Contra</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="info" size="56">
                      <v-icon color="white" size="28">mdi-chart-line</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value" :class="estadisticas.diferencia >= 0 ? 'text-success' : 'text-error'">
                    {{ estadisticas.diferencia > 0 ? '+' : '' }}{{ estadisticas.diferencia }}
                  </div>
                  <div class="stat-label">Diferencia</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card elevation="0" class="stat-card stat-card-puntos">
                <v-card-text class="pa-4 text-center">
                  <div class="stat-icon-container mb-3">
                    <v-avatar color="primary" size="56">
                      <v-icon color="white" size="28">mdi-star</v-icon>
                    </v-avatar>
                  </div>
                  <div class="stat-value text-primary">{{ estadisticas.puntos }}</div>
                  <div class="stat-label">Puntos</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <!-- Plantilla -->
            <v-col cols="12" lg="8">
              <v-card elevation="0" class="plantilla-card mb-6">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                  Plantilla
                </v-card-title>

                <v-divider></v-divider>

                <v-table class="plantilla-table">
                  <thead>
                    <tr>
                      <th class="text-center">Dorsal</th>
                      <th>Jugador</th>
                      <th class="text-center">Goles</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="jugador in plantilla" :key="jugador.id">
                      <td class="text-center">
                        <v-avatar color="primary" size="32">
                          <span class="text-white font-weight-bold text-body-2">{{ jugador.dorsal }}</span>
                        </v-avatar>
                      </td>
                      <td>
                        <div class="jugador-info">
                          <div class="text-body-2 font-weight-bold">{{ jugador.nombre }} {{ jugador.apellidos }}</div>
                        </div>
                      </td>
                      <td class="text-center">
                        <v-chip size="small" :color="jugador.goles > 0 ? 'success' : 'grey-lighten-3'">
                          <v-icon start size="16">mdi-soccer</v-icon>
                          {{ jugador.goles || 0 }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

              <!-- Últimos Partidos -->
              <v-card elevation="0" class="ultimos-partidos-card">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-history</v-icon>
                  Últimos Partidos
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-4">
                  <v-card
                    v-for="partido in ultimosPartidos"
                    :key="partido.id"
                    variant="outlined"
                    class="partido-item mb-3"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <v-chip size="small" variant="flat" color="grey-lighten-4">
                          Jornada {{ partido.jornada }}
                        </v-chip>
                        <span class="text-caption text-grey-darken-1">
                          {{ formatearFecha(partido.fecha) }}
                        </span>
                        <v-chip 
                          size="small" 
                          :color="getResultadoColor(partido)"
                          variant="flat"
                        >
                          {{ getResultadoTexto(partido) }}
                        </v-chip>
                      </div>

                      <div class="resultado-mini">
                        <div class="equipo-mini">
                          {{ getNombreEquipo(partido.equipoLocalId) }}
                        </div>
                        <div class="marcador-mini">
                          <span :class="getGolesLocal(partido) > getGolesVisitante(partido) ? 'ganador' : ''">
                            {{ getGolesLocal(partido) }}
                          </span>
                          <span class="separador">-</span>
                          <span :class="getGolesVisitante(partido) > getGolesLocal(partido) ? 'ganador' : ''">
                            {{ getGolesVisitante(partido) }}
                          </span>
                        </div>
                        <div class="equipo-mini text-right">
                          {{ getNombreEquipo(partido.equipoVisitanteId) }}
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" lg="4">
              <!-- Top Goleadores del Equipo -->
              <v-card elevation="0" class="top-goleadores-card mb-6">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-soccer</v-icon>
                  Goleadores del Equipo
                </v-card-title>

                <v-divider></v-divider>

                <v-list class="pa-0">
                  <v-list-item
                    v-for="(jugador, index) in topGoleadores"
                    :key="jugador.id"
                    class="goleador-mini-item"
                  >
                    <template v-slot:prepend>
                      <div class="posicion-mini">{{ index + 1 }}</div>
                    </template>

                    <v-list-item-title class="text-body-2 font-weight-medium">
                      {{ jugador.nombre }} {{ jugador.apellidos }}
                    </v-list-item-title>

                    <template v-slot:append>
                      <v-chip size="small" color="success">
                        <v-icon start size="16">mdi-soccer</v-icon>
                        {{ jugador.goles }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>

              <!-- Próximo Partido -->
              <v-card v-if="proximoPartido" elevation="0" class="proximo-partido-card">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
                  Próximo Partido
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-4">
                  <div class="text-center mb-3">
                    <v-chip color="warning" variant="flat" class="mb-2">
                      Jornada {{ proximoPartido.jornada }}
                    </v-chip>
                    <div class="text-body-2 font-weight-bold text-grey-darken-4">
                      {{ formatearFechaCompleta(proximoPartido.fecha) }}
                    </div>
                    <div v-if="proximoPartido.estadio" class="text-caption text-grey-darken-1 mt-1">
                      <v-icon size="14">mdi-map-marker</v-icon>
                      {{ proximoPartido.estadio }}
                    </div>
                  </div>

                  <div class="vs-container">
                    <div class="equipo-vs">
                      <v-icon size="20" color="grey-darken-1">mdi-shield</v-icon>
                      <div class="text-body-2 font-weight-medium">
                        {{ getNombreEquipo(proximoPartido.equipoLocalId) }}
                      </div>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="equipo-vs">
                      <v-icon size="20" color="grey-darken-1">mdi-shield</v-icon>
                      <div class="text-body-2 font-weight-medium">
                        {{ getNombreEquipo(proximoPartido.equipoVisitanteId) }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Equipo no encontrado -->
        <v-card v-else elevation="0" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2">mdi-shield-alert</v-icon>
            <p class="text-h6 text-grey-darken-1 mt-4 mb-0">Equipo no encontrado</p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFirestore } from '../composables/useFirestore';
import { useDivision } from '../composables/useDivision';
import AppHeader from '../components/AppHeader.vue';

const route = useRoute();
const router = useRouter();
const { loading, getCollection } = useFirestore();
const { divisionSlug } = useDivision();

const equipo = ref(null);
const partidos = ref([]);
const equipos = ref([]);
const jugadores = ref([]);

const plantilla = computed(() => {
  return jugadores.value
    .filter(j => j.equipoId === equipo.value?.id)
    .sort((a, b) => a.dorsal - b.dorsal);
});

const topGoleadores = computed(() => {
  return plantilla.value
    .filter(j => j.goles > 0)
    .sort((a, b) => b.goles - a.goles)
    .slice(0, 5);
});

const partidosDelEquipo = computed(() => {
  return partidos.value.filter(p => 
    (p.equipoLocalId === equipo.value?.id || p.equipoVisitanteId === equipo.value?.id) && p.finalizado
  ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const ultimosPartidos = computed(() => {
  return partidosDelEquipo.value.slice(0, 5);
});

const proximoPartido = computed(() => {
  return partidos.value
    .filter(p => 
      (p.equipoLocalId === equipo.value?.id || p.equipoVisitanteId === equipo.value?.id) && !p.finalizado
    )
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];
});

const estadisticas = computed(() => {
  if (!equipo.value) return {};

  const partidosLocal = partidos.value.filter(p => p.equipoLocalId === equipo.value.id && p.finalizado);
  const partidosVisitante = partidos.value.filter(p => p.equipoVisitanteId === equipo.value.id && p.finalizado);

  let ganados = 0, empatados = 0, perdidos = 0;
  let golesFavor = 0, golesContra = 0;

  partidosLocal.forEach(p => {
    const golesL = getGolesLocal(p);
    const golesV = getGolesVisitante(p);
    golesFavor += golesL;
    golesContra += golesV;
    if (golesL > golesV) ganados++;
    else if (golesL === golesV) empatados++;
    else perdidos++;
  });

  partidosVisitante.forEach(p => {
    const golesL = getGolesLocal(p);
    const golesV = getGolesVisitante(p);
    golesFavor += golesV;
    golesContra += golesL;
    if (golesV > golesL) ganados++;
    else if (golesV === golesL) empatados++;
    else perdidos++;
  });

  const puntos = (ganados * 3) + empatados;
  
  // Calcular posición en la división
  const equiposMismaDivision = equipos.value.filter(e => e.division === equipo.value.division);
  const clasificacion = equiposMismaDivision.map(e => {
    const pLocal = partidos.value.filter(p => p.equipoLocalId === e.id && p.finalizado);
    const pVisitante = partidos.value.filter(p => p.equipoVisitanteId === e.id && p.finalizado);
    
    let g = 0, emp = 0;
    pLocal.forEach(p => {
      const gL = getGolesLocal(p);
      const gV = getGolesVisitante(p);
      if (gL > gV) g++;
      else if (gL === gV) emp++;
    });
    pVisitante.forEach(p => {
      const gL = getGolesLocal(p);
      const gV = getGolesVisitante(p);
      if (gV > gL) g++;
      else if (gV === gL) emp++;
    });
    
    return { id: e.id, puntos: (g * 3) + emp };
  }).sort((a, b) => b.puntos - a.puntos);
  
  const posicion = clasificacion.findIndex(c => c.id === equipo.value.id) + 1;

  return {
    partidosJugados: partidosLocal.length + partidosVisitante.length,
    ganados,
    empatados,
    perdidos,
    golesFavor,
    golesContra,
    diferencia: golesFavor - golesContra,
    puntos,
    posicion
  };
});

const getGolesLocal = (partido) => {
  if (Array.isArray(partido.golesLocal)) return partido.golesLocal.length;
  return partido.golesLocal || 0;
};

const getGolesVisitante = (partido) => {
  if (Array.isArray(partido.golesVisitante)) return partido.golesVisitante.length;
  return partido.golesVisitante || 0;
};

const getNombreEquipo = (equipoId) => {
  const eq = equipos.value.find(e => e.id === equipoId);
  return eq ? eq.nombre : 'Desconocido';
};

const getResultadoColor = (partido) => {
  const golesLocal = getGolesLocal(partido);
  const golesVisitante = getGolesVisitante(partido);
  
  const esLocal = partido.equipoLocalId === equipo.value.id;
  
  if (esLocal) {
    if (golesLocal > golesVisitante) return 'success';
    if (golesLocal < golesVisitante) return 'error';
    return 'warning';
  } else {
    if (golesVisitante > golesLocal) return 'success';
    if (golesVisitante < golesLocal) return 'error';
    return 'warning';
  }
};

const getResultadoTexto = (partido) => {
  const golesLocal = getGolesLocal(partido);
  const golesVisitante = getGolesVisitante(partido);
  
  const esLocal = partido.equipoLocalId === equipo.value.id;
  
  if (esLocal) {
    if (golesLocal > golesVisitante) return 'Victoria';
    if (golesLocal < golesVisitante) return 'Derrota';
    return 'Empate';
  } else {
    if (golesVisitante > golesLocal) return 'Victoria';
    if (golesVisitante < golesLocal) return 'Derrota';
    return 'Empate';
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const volver = () => {
  router.push(`/${divisionSlug.value}/equipos`);
};

const cargarDatos = async () => {
  equipos.value = await getCollection('equipos');
  jugadores.value = await getCollection('jugadores');
  partidos.value = await getCollection('partidos');
  
  equipo.value = equipos.value.find(e => e.id === route.params.id);
};

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
/* Mismo CSS que antes, sin cambios */
.main-content {
  background: #F8FAFC;
}

.equipo-header-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  overflow: hidden;
}

.equipo-header-banner {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
}

.stat-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
}

.stat-card-puntos {
  border: 2px solid #2563EB;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plantilla-card,
.ultimos-partidos-card,
.top-goleadores-card,
.proximo-partido-card,
.empty-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

.card-title {
  padding: 20px !important;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}

.plantilla-table thead {
  background: #F8FAFC;
}

.plantilla-table thead th {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #64748B !important;
  padding: 16px !important;
}

.plantilla-table tbody td {
  padding: 16px !important;
}

.plantilla-table tbody tr:hover {
  background: #F8FAFC;
}

.partido-item {
  border-radius: 8px !important;
}

.resultado-mini {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.equipo-mini {
  font-weight: 600;
  color: #334155;
}

.marcador-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 800;
  color: #94A3B8;
}

.marcador-mini .ganador {
  color: #2563EB;
}

.marcador-mini .separador {
  font-size: 1rem;
  color: #CBD5E1;
}

.posicion-mini {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #64748B;
  margin-right: 12px;
}

.goleador-mini-item {
  border-bottom: 1px solid #F1F5F9;
  padding: 12px 16px !important;
}

.goleador-mini-item:hover {
  background: #F8FAFC;
}

.vs-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.equipo-vs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 8px;
}

.vs-badge {
  text-align: center;
  font-weight: 800;
  font-size: 1.25rem;
  color: #64748B;
  padding: 8px;
}
</style>
