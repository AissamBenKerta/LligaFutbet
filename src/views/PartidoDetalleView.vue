<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <div v-else-if="partido">
          <!-- Botón volver -->
          <v-btn variant="text" color="primary" @click="volver" class="mb-4">
            <v-icon start>mdi-arrow-left</v-icon>
            Volver
          </v-btn>

          <!-- Header del Partido -->
          <v-card elevation="0" class="partido-header-card mb-6">
            <div class="partido-header-banner">
              <v-container class="py-8">
                <!-- Jornada y estado -->
                <div class="text-center mb-4">
                  <v-chip color="white" variant="flat" size="large" class="mr-2">
                    <v-icon start>mdi-calendar-range</v-icon>
                    Jornada {{ partido.jornada }}
                  </v-chip>
                  <v-chip color="white" variant="flat" size="large" class="mr-2">
                    <v-icon start>mdi-trophy</v-icon>
                    {{ getDivisionPartido() === 1 ? 'Primera' : 'Segunda' }} División
                  </v-chip>
                  <v-chip 
                    :color="partido.finalizado ? 'success' : 'warning'" 
                    variant="flat"
                    size="large"
                  >
                    <v-icon start>{{ partido.finalizado ? 'mdi-check-circle' : 'mdi-clock-outline' }}</v-icon>
                    {{ partido.finalizado ? 'Finalizado' : 'Programado' }}
                  </v-chip>
                </div>

                <!-- Resultado Principal -->
                <div class="resultado-principal">
                  <!-- Equipo Local -->
                  <div class="equipo-principal" @click="irAEquipo(partido.equipoLocalId)">
                    <v-avatar color="white" size="120" class="elevation-4 equipo-avatar">
                      <v-icon color="primary" size="64">mdi-shield</v-icon>
                    </v-avatar>
                    <h2 class="text-h4 font-weight-bold text-white mt-4">
                      {{ getNombreEquipo(partido.equipoLocalId) }}
                    </h2>
                    <div class="text-caption text-blue-lighten-4">Local</div>
                  </div>

                  <!-- Marcador -->
                  <div class="marcador-principal">
                    <div v-if="partido.finalizado" class="marcador-numeros">
                      <span 
                        class="marcador-numero-grande" 
                        :class="{ 'ganador': getGolesLocal(partido) > getGolesVisitante(partido) }"
                      >
                        {{ getGolesLocal(partido) }}
                      </span>
                      <span class="separador-grande">-</span>
                      <span 
                        class="marcador-numero-grande" 
                        :class="{ 'ganador': getGolesVisitante(partido) > getGolesLocal(partido) }"
                      >
                        {{ getGolesVisitante(partido) }}
                      </span>
                    </div>
                    <div v-else class="vs-grande">VS</div>
                  </div>

                  <!-- Equipo Visitante -->
                  <div class="equipo-principal" @click="irAEquipo(partido.equipoVisitanteId)">
                    <v-avatar color="white" size="120" class="elevation-4 equipo-avatar">
                      <v-icon color="grey-darken-1" size="64">mdi-shield</v-icon>
                    </v-avatar>
                    <h2 class="text-h4 font-weight-bold text-white mt-4">
                      {{ getNombreEquipo(partido.equipoVisitanteId) }}
                    </h2>
                    <div class="text-caption text-blue-lighten-4">Visitante</div>
                  </div>
                </div>

                <!-- Info adicional -->
                <div class="partido-info-extra">
                  <v-chip color="white" variant="flat" class="mr-2">
                    <v-icon start size="18">mdi-clock-outline</v-icon>
                    {{ formatearFechaCompleta(partido.fecha) }}
                  </v-chip>
                  <v-chip v-if="partido.estadio" color="white" variant="flat">
                    <v-icon start size="18">mdi-map-marker</v-icon>
                    {{ partido.estadio }}
                  </v-chip>
                </div>
              </v-container>
            </div>
          </v-card>

          <!-- Goleadores (solo si está finalizado) -->
          <v-row v-if="partido.finalizado && (partido.golesLocal?.length > 0 || partido.golesVisitante?.length > 0)">
            <v-col cols="12">
              <v-card elevation="0" class="goleadores-card mb-6">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-soccer</v-icon>
                  Goleadores del Partido
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-6">
                  <v-row>
                    <!-- Goleadores Local -->
                    <v-col cols="12" md="6">
                      <div class="goleadores-seccion">
                        <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-4 d-flex align-center">
                          <v-icon color="primary" class="mr-2">mdi-shield</v-icon>
                          {{ getNombreEquipo(partido.equipoLocalId) }}
                        </h3>
                        
                        <div v-if="partido.golesLocal && partido.golesLocal.length > 0">
                          <v-list class="pa-0">
                            <v-list-item
                              v-for="(gol, index) in partido.golesLocal"
                              :key="index"
                              class="goleador-list-item"
                            >
                              <template v-slot:prepend>
                                <v-avatar color="success" size="40">
                                  <v-icon color="white" size="20">mdi-soccer</v-icon>
                                </v-avatar>
                              </template>

                              <v-list-item-title class="text-body-1 font-weight-bold">
                                {{ getNombreJugador(gol.jugadorId) }}
                              </v-list-item-title>

                              <v-list-item-subtitle>
                                {{ getDorsalJugador(gol.jugadorId) ? `#${getDorsalJugador(gol.jugadorId)}` : '' }}
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </div>
                        <div v-else class="text-center text-grey-darken-1 py-4">
                          Sin goles
                        </div>
                      </div>
                    </v-col>

                    <!-- Goleadores Visitante -->
                    <v-col cols="12" md="6">
                      <div class="goleadores-seccion">
                        <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-4 d-flex align-center">
                          <v-icon color="grey-darken-1" class="mr-2">mdi-shield</v-icon>
                          {{ getNombreEquipo(partido.equipoVisitanteId) }}
                        </h3>
                        
                        <div v-if="partido.golesVisitante && partido.golesVisitante.length > 0">
                          <v-list class="pa-0">
                            <v-list-item
                              v-for="(gol, index) in partido.golesVisitante"
                              :key="index"
                              class="goleador-list-item"
                            >
                              <template v-slot:prepend>
                                <v-avatar color="success" size="40">
                                  <v-icon color="white" size="20">mdi-soccer</v-icon>
                                </v-avatar>
                              </template>

                              <v-list-item-title class="text-body-1 font-weight-bold">
                                {{ getNombreJugador(gol.jugadorId) }}
                              </v-list-item-title>

                              <v-list-item-subtitle>
                                {{ getDorsalJugador(gol.jugadorId) ? `#${getDorsalJugador(gol.jugadorId)}` : '' }}
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </div>
                        <div v-else class="text-center text-grey-darken-1 py-4">
                          Sin goles
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Estadísticas y Alineaciones -->
          <v-row>
            <!-- Estadísticas -->
            <v-col cols="12" md="6">
              <v-card elevation="0" class="estadisticas-card mb-6">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
                  Estadísticas
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-6">
                  <div class="estadistica-item">
                    <div class="estadistica-label">Goles</div>
                    <div class="estadistica-valores">
                      <span class="valor-local">{{ getGolesLocal(partido) }}</span>
                      <v-progress-linear
                        :model-value="porcentajeGoles('local')"
                        height="8"
                        color="primary"
                        bg-color="grey-lighten-3"
                        rounded
                        class="mx-4"
                      ></v-progress-linear>
                      <span class="valor-visitante">{{ getGolesVisitante(partido) }}</span>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="info-partido-grid">
                    <div class="info-item">
                      <v-icon color="primary" class="mb-2">mdi-trophy</v-icon>
                      <div class="info-label">Resultado</div>
                      <div class="info-value">{{ partido.finalizado ? getResultadoTexto() : 'Por jugarse' }}</div>
                    </div>

                    <div class="info-item">
                      <v-icon color="primary" class="mb-2">mdi-calendar</v-icon>
                      <div class="info-label">Fecha</div>
                      <div class="info-value">{{ formatearFecha(partido.fecha) }}</div>
                    </div>

                    <div v-if="partido.estadio" class="info-item">
                      <v-icon color="primary" class="mb-2">mdi-map-marker</v-icon>
                      <div class="info-label">Estadio</div>
                      <div class="info-value">{{ partido.estadio }}</div>
                    </div>

                    <div class="info-item">
                      <v-icon color="primary" class="mb-2">mdi-clock</v-icon>
                      <div class="info-label">Hora</div>
                      <div class="info-value">{{ getHora(partido.fecha) }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Plantillas -->
            <v-col cols="12" md="6">
              <v-card elevation="0" class="plantillas-card mb-6">
                <v-card-title class="card-title">
                  <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                  Plantillas
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pa-6">
                  <v-row>
                    <!-- Plantilla Local -->
                    <v-col cols="12" sm="6">
                      <h4 class="text-subtitle-1 font-weight-bold mb-3">
                        {{ getNombreEquipo(partido.equipoLocalId) }}
                      </h4>
                      <v-list density="compact" class="pa-0">
                        <v-list-item
                          v-for="jugador in plantillaLocal"
                          :key="jugador.id"
                          class="plantilla-item"
                        >
                          <template v-slot:prepend>
                            <v-avatar color="primary" size="28">
                              <span class="text-white font-weight-bold text-caption">{{ jugador.dorsal }}</span>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="text-body-2">
                            {{ jugador.nombre }} {{ jugador.apellidos }}
                          </v-list-item-title>

                          <template v-slot:append>
                            <v-icon 
                              v-if="jugadorMarcoGol(jugador.id, 'local')" 
                              color="success" 
                              size="20"
                            >
                              mdi-soccer
                            </v-icon>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-col>

                    <!-- Plantilla Visitante -->
                    <v-col cols="12" sm="6">
                      <h4 class="text-subtitle-1 font-weight-bold mb-3">
                        {{ getNombreEquipo(partido.equipoVisitanteId) }}
                      </h4>
                      <v-list density="compact" class="pa-0">
                        <v-list-item
                          v-for="jugador in plantillaVisitante"
                          :key="jugador.id"
                          class="plantilla-item"
                        >
                          <template v-slot:prepend>
                            <v-avatar color="grey-darken-1" size="28">
                              <span class="text-white font-weight-bold text-caption">{{ jugador.dorsal }}</span>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="text-body-2">
                            {{ jugador.nombre }} {{ jugador.apellidos }}
                          </v-list-item-title>

                          <template v-slot:append>
                            <v-icon 
                              v-if="jugadorMarcoGol(jugador.id, 'visitante')" 
                              color="success" 
                              size="20"
                            >
                              mdi-soccer
                            </v-icon>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Otros partidos de la jornada -->
          <v-card elevation="0" class="otros-partidos-card">
            <v-card-title class="card-title">
              <v-icon color="primary" class="mr-2">mdi-calendar-multiple</v-icon>
              Otros partidos de la Jornada {{ partido.jornada }}
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-4">
              <v-row>
                <v-col
                  v-for="otroPartido in otrosPartidosJornada"
                  :key="otroPartido.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    variant="outlined"
                    class="otro-partido-item"
                    @click="irAPartido(otroPartido.id)"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <span class="text-caption text-grey-darken-1">
                          {{ formatearFecha(otroPartido.fecha) }}
                        </span>
                        <v-chip 
                          size="x-small" 
                          :color="otroPartido.finalizado ? 'success' : 'warning'"
                          variant="flat"
                        >
                          {{ otroPartido.finalizado ? 'Final' : 'Programado' }}
                        </v-chip>
                      </div>

                      <div class="resultado-mini">
                        <div class="equipo-mini">
                          {{ getNombreEquipo(otroPartido.equipoLocalId) }}
                        </div>
                        <div class="marcador-mini">
                          <template v-if="otroPartido.finalizado">
                            <span>{{ getGolesLocal(otroPartido) }}</span>
                            <span class="separador">-</span>
                            <span>{{ getGolesVisitante(otroPartido) }}</span>
                          </template>
                          <span v-else class="vs-mini">VS</span>
                        </div>
                        <div class="equipo-mini text-right">
                          {{ getNombreEquipo(otroPartido.equipoVisitanteId) }}
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Partido no encontrado -->
        <v-card v-else elevation="0" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2">mdi-alert-circle</v-icon>
            <p class="text-h6 text-grey-darken-1 mt-4 mb-0">Partido no encontrado</p>
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

const partido = ref(null);
const partidos = ref([]);
const equipos = ref([]);
const jugadores = ref([]);

const plantillaLocal = computed(() => {
  return jugadores.value
    .filter(j => j.equipoId === partido.value?.equipoLocalId)
    .sort((a, b) => a.dorsal - b.dorsal);
});

const plantillaVisitante = computed(() => {
  return jugadores.value
    .filter(j => j.equipoId === partido.value?.equipoVisitanteId)
    .sort((a, b) => a.dorsal - b.dorsal);
});

const otrosPartidosJornada = computed(() => {
  if (!partido.value) return [];
  
  // Obtener división del partido actual
  const equipoLocal = equipos.value.find(e => e.id === partido.value.equipoLocalId);
  const division = equipoLocal?.division || 1;
  
  // Filtrar partidos de la misma jornada y división
  const equiposMismaDivision = equipos.value.filter(e => e.division === division).map(e => e.id);
  
  return partidos.value
    .filter(p => 
      p.jornada === partido.value.jornada && 
      p.id !== partido.value.id &&
      equiposMismaDivision.includes(p.equipoLocalId) &&
      equiposMismaDivision.includes(p.equipoVisitanteId)
    )
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
});

const getGolesLocal = (p) => {
  if (Array.isArray(p.golesLocal)) return p.golesLocal.length;
  return p.golesLocal || 0;
};

const getGolesVisitante = (p) => {
  if (Array.isArray(p.golesVisitante)) return p.golesVisitante.length;
  return p.golesVisitante || 0;
};

const getNombreEquipo = (equipoId) => {
  const eq = equipos.value.find(e => e.id === equipoId);
  return eq ? eq.nombre : 'Desconocido';
};

const getNombreJugador = (jugadorId) => {
  const jugador = jugadores.value.find(j => j.id === jugadorId);
  return jugador ? `${jugador.nombre} ${jugador.apellidos}` : 'Desconocido';
};

const getDorsalJugador = (jugadorId) => {
  const jugador = jugadores.value.find(j => j.id === jugadorId);
  return jugador?.dorsal || null;
};

const getDivisionPartido = () => {
  const equipoLocal = equipos.value.find(e => e.id === partido.value?.equipoLocalId);
  return equipoLocal?.division || 1;
};

const jugadorMarcoGol = (jugadorId, tipo) => {
  if (!partido.value) return false;
  const goles = tipo === 'local' ? partido.value.golesLocal : partido.value.golesVisitante;
  if (!Array.isArray(goles)) return false;
  return goles.some(g => g.jugadorId === jugadorId);
};

const porcentajeGoles = (tipo) => {
  const golesL = getGolesLocal(partido.value);
  const golesV = getGolesVisitante(partido.value);
  const total = golesL + golesV;
  if (total === 0) return 50;
  return tipo === 'local' ? (golesL / total) * 100 : (golesV / total) * 100;
};

const getResultadoTexto = () => {
  const golesL = getGolesLocal(partido.value);
  const golesV = getGolesVisitante(partido.value);
  if (golesL > golesV) return `Victoria ${getNombreEquipo(partido.value.equipoLocalId)}`;
  if (golesV > golesL) return `Victoria ${getNombreEquipo(partido.value.equipoVisitanteId)}`;
  return 'Empate';
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
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

const getHora = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const volver = () => {
  router.push(`/${divisionSlug.value}/resultados`);
};

const irAEquipo = (equipoId) => {
  router.push(`/${divisionSlug.value}/equipo/${equipoId}`);
};

const irAPartido = (partidoId) => {
  router.push(`/${divisionSlug.value}/partido/${partidoId}`);
  cargarDatos();
};

const cargarDatos = async () => {
  partidos.value = await getCollection('partidos');
  equipos.value = await getCollection('equipos');
  jugadores.value = await getCollection('jugadores');
  
  partido.value = partidos.value.find(p => p.id === route.params.id);
};

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.main-content {
  background: #F8FAFC;
}

.partido-header-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  overflow: hidden;
}

.partido-header-banner {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
}

.resultado-principal {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 48px;
  margin: 32px 0;
}

.equipo-principal {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.equipo-principal:hover {
  transform: scale(1.05);
}

.equipo-avatar {
  transition: all 0.2s ease;
}

.equipo-principal:hover .equipo-avatar {
  transform: scale(1.1);
}

.marcador-principal {
  text-align: center;
  padding: 0 32px;
}

.marcador-numeros {
  display: flex;
  align-items: center;
  gap: 16px;
}

.marcador-numero-grande {
  font-size: 5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1;
}

.marcador-numero-grande.ganador {
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.separador-grande {
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.vs-grande {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.partido-info-extra {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.goleadores-card,
.estadisticas-card,
.plantillas-card,
.otros-partidos-card,
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

.goleadores-seccion {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 8px;
}

.goleador-list-item {
  background: white;
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 8px !important;
}

.estadistica-item {
  margin-bottom: 24px;
}

.estadistica-label {
  text-align: center;
  font-weight: 600;
  color: #64748B;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.estadistica-valores {
  display: flex;
  align-items: center;
}

.valor-local,
.valor-visitante {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2563EB;
  min-width: 48px;
  text-align: center;
}

.info-partido-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1E293B;
}

.plantilla-item {
  padding: 8px 12px !important;
  border-bottom: 1px solid #F1F5F9;
}

.plantilla-item:hover {
  background: #F8FAFC;
}

.otro-partido-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px !important;
}

.otro-partido-item:hover {
  border-color: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.resultado-mini {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
}

.equipo-mini {
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
}

.marcador-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #2563EB;
}

.marcador-mini .separador {
  color: #CBD5E1;
}

.vs-mini {
  font-size: 0.875rem;
  color: #94A3B8;
}

@media (max-width: 960px) {
  .resultado-principal {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .marcador-numero-grande {
    font-size: 3rem;
  }
  
  .vs-grande {
    font-size: 2.5rem;
  }
  
  .info-partido-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
