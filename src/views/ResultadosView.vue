<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold mb-2">
            Resultados
          </h1>
          <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
            {{ nombreDivision }} - Todos los partidos finalizados
          </p>
        </div>

        <!-- Loading -->
        <v-row v-if="loading" justify="center" class="py-12">
          <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
        </v-row>

        <!-- Sin resultados -->
        <v-card v-else-if="partidosFinalizados.length === 0" elevation="0" class="rounded-lg">
          <v-card-text class="text-center py-12">
            <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-soccer-field</v-icon>
            <p :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="text-grey-darken-1 mt-4 mb-0">
              No hay partidos finalizados
            </p>
          </v-card-text>
        </v-card>

        <!-- Resultados por Jornada -->
        <div v-else>
          <div v-for="jornada in jornadasConPartidos" :key="jornada" class="mb-6">
            <!-- Header Jornada -->
            <v-card elevation="0" class="rounded-lg mb-3 bg-grey-lighten-5">
              <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'">
                <v-row align="center" dense>
                  <v-col cols="auto">
                    <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24">mdi-calendar-range</v-icon>
                  </v-col>
                  <v-col>
                    <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">
                      Jornada {{ jornada }}
                    </span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Partidos de la Jornada -->
            <v-row dense>
              <v-col
                v-for="partido in partidosPorJornada(jornada)" 
                :key="partido.id"
                cols="12"
              >
                <v-card class="rounded-lg" elevation="0" hover @click="verDetallePartido(partido)">
                  <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'">
                    <!-- Fecha -->
                    <v-row class="mb-3" justify="center" dense>
                      <v-col cols="auto">
                        <v-chip :size="$vuetify.display.xs ? 'x-small' : 'small'" variant="outlined">
                          <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-clock-outline</v-icon>
                          {{ formatearFechaCompleta(partido.fecha) }}
                        </v-chip>
                      </v-col>
                      <v-col v-if="partido.estadio" cols="auto">
                        <v-chip :size="$vuetify.display.xs ? 'x-small' : 'small'" variant="outlined">
                          <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-map-marker</v-icon>
                          {{ partido.estadio }}
                        </v-chip>
                      </v-col>
                    </v-row>

                    <!-- Resultado -->
                    <v-row align="center" dense>
                      <!-- Equipo Local -->
                      <v-col cols="5">
                        <v-row align="center" dense>
                          <v-col cols="auto">
                            <v-avatar 
                              :size="$vuetify.display.xs ? 36 : 48"
                              :color="getLogoEquipo(partido.equipoLocalId) ? 'transparent' : (getGolesLocal(partido) > getGolesVisitante(partido) ? 'primary' : 'grey-lighten-3')"
                            >
                              <v-img 
                                v-if="getLogoEquipo(partido.equipoLocalId)" 
                                :src="getLogoEquipo(partido.equipoLocalId)" 
                                alt="Logo"
                              >
                                <template v-slot:error>
                                  <v-icon 
                                    :size="$vuetify.display.xs ? 18 : 24"
                                    :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'white' : 'grey-darken-1'"
                                  >
                                    mdi-shield
                                  </v-icon>
                                </template>
                              </v-img>
                              <v-icon 
                                v-else
                                :size="$vuetify.display.xs ? 18 : 24"
                                :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'white' : 'grey-darken-1'"
                              >
                                mdi-shield
                              </v-icon>
                            </v-avatar>
                          </v-col>
                          <v-col>
                            <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-1'" class="font-weight-bold text-truncate">
                              {{ getNombreEquipo(partido.equipoLocalId) }}
                            </div>
                            <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">Local</div>
                          </v-col>
                        </v-row>
                      </v-col>

                      <!-- Marcador -->
                      <v-col cols="2" class="text-center">
                        <div class="d-flex justify-center align-center ga-2">
                          <span 
                            :class="[
                              $vuetify.display.xs ? 'text-h5' : 'text-h4',
                              'font-weight-bold',
                              getGolesLocal(partido) > getGolesVisitante(partido) ? 'text-primary' : 'text-grey-lighten-1'
                            ]"
                          >
                            {{ getGolesLocal(partido) }}
                          </span>
                          <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="text-grey-lighten-1 font-weight-medium">-</span>
                          <span 
                            :class="[
                              $vuetify.display.xs ? 'text-h5' : 'text-h4',
                              'font-weight-bold',
                              getGolesVisitante(partido) > getGolesLocal(partido) ? 'text-primary' : 'text-grey-lighten-1'
                            ]"
                          >
                            {{ getGolesVisitante(partido) }}
                          </span>
                        </div>
                      </v-col>

                      <!-- Equipo Visitante -->
                      <v-col cols="5">
                        <v-row align="center" dense justify="end">
                          <v-col class="text-right">
                            <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-1'" class="font-weight-bold text-truncate">
                              {{ getNombreEquipo(partido.equipoVisitanteId) }}
                            </div>
                            <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">Visitante</div>
                          </v-col>
                          <v-col cols="auto">
                            <v-avatar 
                              :size="$vuetify.display.xs ? 36 : 48"
                              :color="getLogoEquipo(partido.equipoVisitanteId) ? 'transparent' : (getGolesVisitante(partido) > getGolesLocal(partido) ? 'primary' : 'grey-lighten-3')"
                            >
                              <v-img 
                                v-if="getLogoEquipo(partido.equipoVisitanteId)" 
                                :src="getLogoEquipo(partido.equipoVisitanteId)" 
                                alt="Logo"
                              >
                                <template v-slot:error>
                                  <v-icon 
                                    :size="$vuetify.display.xs ? 18 : 24"
                                    :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'white' : 'grey-darken-1'"
                                  >
                                    mdi-shield
                                  </v-icon>
                                </template>
                              </v-img>
                              <v-icon 
                                v-else
                                :size="$vuetify.display.xs ? 18 : 24"
                                :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'white' : 'grey-darken-1'"
                              >
                                mdi-shield
                              </v-icon>
                            </v-avatar>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- Goleadores -->
                    <div v-if="(partido.golesLocal?.length > 0 || partido.golesVisitante?.length > 0)" class="mt-3">
                      <v-divider class="mb-2"></v-divider>
                      <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1 mb-2">
                        <v-icon :size="$vuetify.display.xs ? 14 : 16" color="grey-darken-1">mdi-soccer</v-icon>
                        Goleadores
                      </div>
                      <div class="d-flex flex-wrap ga-1">
                        <v-chip
                          v-for="(gol, index) in partido.golesLocal"
                          :key="'local-' + index"
                          :size="$vuetify.display.xs ? 'x-small' : 'small'"
                          variant="flat"
                          color="grey-lighten-4"
                        >
                          <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-soccer</v-icon>
                          {{ getNombreJugador(gol.jugadorId) }}
                        </v-chip>
                        <v-chip
                          v-for="(gol, index) in partido.golesVisitante"
                          :key="'visitante-' + index"
                          :size="$vuetify.display.xs ? 'x-small' : 'small'"
                          variant="flat"
                          color="grey-lighten-4"
                        >
                          <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-soccer</v-icon>
                          {{ getNombreJugador(gol.jugadorId) }}
                        </v-chip>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
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

// NUEVO: Función para obtener el logo del equipo
const getLogoEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.logoUrl || null;
};

const getNombreJugador = (jugadorId) => {
  const jugador = jugadores.value.find(j => j.id === jugadorId);
  return jugador ? `${jugador.nombre} ${jugador.apellidos}` : 'Desconocido';
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getGolesLocal = (partido) => {
  if (Array.isArray(partido.golesLocal)) return partido.golesLocal.length;
  return partido.golesLocal || 0;
};

const getGolesVisitante = (partido) => {
  if (Array.isArray(partido.golesVisitante)) return partido.golesVisitante.length;
  return partido.golesVisitante || 0;
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
.rounded-lg {
  border-radius: 12px !important;
  border: 1px solid rgb(var(--v-theme-grey-lighten-3));
}
</style>
