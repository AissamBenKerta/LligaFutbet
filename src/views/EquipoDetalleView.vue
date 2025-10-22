<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Loading -->
        <v-row v-if="loading" justify="center" class="py-12">
          <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
        </v-row>

        <div v-else-if="equipo">
          <!-- Botón volver -->
          <v-btn 
            variant="text" 
            color="primary" 
            @click="volver" 
            :size="$vuetify.display.xs ? 'small' : 'default'"
            class="mb-4"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Volver
          </v-btn>

          <!-- Header del Equipo -->
          <v-card elevation="0" class="rounded-lg mb-6 overflow-hidden">
            <div class="equipo-banner pa-8 text-center">
              <v-avatar 
                :size="$vuetify.display.xs ? 80 : 120" 
                :color="getLogoEquipo(equipo) ? 'transparent' : 'white'"
                class="elevation-4 mb-4"
              >
                <v-img 
                  v-if="getLogoEquipo(equipo)" 
                  :src="getLogoEquipo(equipo)" 
                  alt="Logo"
                >
                  <template v-slot:error>
                    <v-icon :size="$vuetify.display.xs ? 40 : 64" color="primary">mdi-shield</v-icon>
                  </template>
                </v-img>
                <v-icon v-else :size="$vuetify.display.xs ? 40 : 64" color="primary">mdi-shield</v-icon>
              </v-avatar>
              
              <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h3'" class="font-weight-bold text-white mb-3">
                {{ equipo.nombre }}
              </h1>
              <v-row justify="center" dense>
                <v-col cols="auto">
                  <v-chip color="white" variant="flat">
                    <v-icon start :size="$vuetify.display.xs ? 14 : 18" color="primary">mdi-trophy</v-icon>
                    {{ equipo.division === 1 ? 'Primera' : 'Segunda' }} División
                  </v-chip>
                </v-col>
                <v-col cols="auto">
                  <v-chip color="white" variant="flat">
                    <v-icon start :size="$vuetify.display.xs ? 14 : 18" color="primary">mdi-account-group</v-icon>
                    {{ plantilla.length }} Jugadores
                  </v-chip>
                </v-col>
                <v-col cols="auto">
                  <v-chip color="white" variant="flat">
                    <v-icon start :size="$vuetify.display.xs ? 14 : 18" color="primary">mdi-trophy</v-icon>
                    {{ estadisticas.posicion }}º Clasificación
                  </v-chip>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Estadísticas -->
          <v-row class="mb-6">
            <v-col cols="6" sm="4" md="3" lg="2">
              <v-card elevation="0" class="rounded-lg text-center pa-4">
                <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="primary" class="mb-3">
                  <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-scoreboard</v-icon>
                </v-avatar>
                <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold">
                  {{ estadisticas.partidosJugados }}
                </div>
                <div class="text-caption text-grey-darken-1">Partidos</div>
              </v-card>
            </v-col>
            
            <v-col cols="6" sm="4" md="3" lg="2">
              <v-card elevation="0" class="rounded-lg text-center pa-4">
                <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="success" class="mb-3">
                  <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-check-circle</v-icon>
                </v-avatar>
                <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-success">
                  {{ estadisticas.ganados }}
                </div>
                <div class="text-caption text-grey-darken-1">Victorias</div>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3" lg="2">
              <v-card elevation="0" class="rounded-lg text-center pa-4">
                <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="warning" class="mb-3">
                  <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-equal</v-icon>
                </v-avatar>
                <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-warning">
                  {{ estadisticas.empatados }}
                </div>
                <div class="text-caption text-grey-darken-1">Empates</div>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3" lg="2">
              <v-card elevation="0" class="rounded-lg text-center pa-4">
                <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="error" class="mb-3">
                  <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-close-circle</v-icon>
                </v-avatar>
                <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-error">
                  {{ estadisticas.perdidos }}
                </div>
                <div class="text-caption text-grey-darken-1">Derrotas</div>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3" lg="2">
              <v-card elevation="0" class="rounded-lg text-center pa-4">
                <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="accent" class="mb-3">
                  <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-soccer</v-icon>
                </v-avatar>
                <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold">
                  {{ estadisticas.golesFavor }}
                </div>
                <div class="text-caption text-grey-darken-1">Goles Favor</div>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3" lg="2">
              <v-card elevation="0" class="rounded-lg text-center pa-4">
                <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="primary" class="mb-3">
                  <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-star</v-icon>
                </v-avatar>
                <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-primary">
                  {{ estadisticas.puntos }}
                </div>
                <div class="text-caption text-grey-darken-1">Puntos</div>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <!-- Plantilla -->
            <v-col cols="12" :lg="proximoPartido ? 8 : 12">
              <v-card elevation="0" class="rounded-lg mb-6">
                <v-card-title class="bg-grey-lighten-5 py-4">
                  <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-account-group</v-icon>
                  <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">Plantilla</span>
                </v-card-title>

                <v-divider></v-divider>

                <v-table :density="$vuetify.display.xs ? 'compact' : 'default'">
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
                        <v-avatar :size="$vuetify.display.xs ? 28 : 32" color="primary">
                          <span :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'text-white', 'font-weight-bold']">
                            {{ jugador.dorsal }}
                          </span>
                        </v-avatar>
                      </td>
                      <td>
                        <span :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'font-weight-bold']">
                          {{ jugador.nombre }} {{ jugador.apellidos }}
                        </span>
                      </td>
                      <td class="text-center">
                        <v-chip :size="$vuetify.display.xs ? 'x-small' : 'small'" :color="jugador.goles > 0 ? 'success' : 'grey-lighten-3'">
                          <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-soccer</v-icon>
                          {{ jugador.goles || 0 }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>

              <!-- Últimos Partidos -->
              <v-card elevation="0" class="rounded-lg">
                <v-card-title class="bg-grey-lighten-5 py-4">
                  <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-history</v-icon>
                  <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">Últimos Partidos</span>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text :class="$vuetify.display.xs ? 'pa-2' : 'pa-4'">
                  <v-card
                    v-for="partido in ultimosPartidos"
                    :key="partido.id"
                    variant="outlined"
                    class="rounded-lg mb-3"
                  >
                    <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'">
                      <v-row class="mb-3" justify="space-between" align="center" dense>
                        <v-col cols="auto">
                          <v-chip :size="$vuetify.display.xs ? 'x-small' : 'small'" variant="flat" color="grey-lighten-4">
                            Jornada {{ partido.jornada }}
                          </v-chip>
                        </v-col>
                        <v-col cols="auto">
                          <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                            {{ formatearFecha(partido.fecha) }}
                          </span>
                        </v-col>
                        <v-col cols="auto">
                          <v-chip 
                            :size="$vuetify.display.xs ? 'x-small' : 'small'" 
                            :color="getResultadoColor(partido)"
                            variant="flat"
                          >
                            {{ getResultadoTexto(partido) }}
                          </v-chip>
                        </v-col>
                      </v-row>

                      <v-row align="center" dense>
                        <v-col cols="4">
                          <v-row align="center" dense no-gutters>
                            <v-col cols="auto">
                              <v-avatar 
                                :size="$vuetify.display.xs ? 20 : 24"
                                :color="getLogoEquipo(partido.equipoLocalId) ? 'transparent' : 'grey-darken-1'"
                                class="mr-2"
                              >
                                <v-img 
                                  v-if="getLogoEquipo(partido.equipoLocalId)" 
                                  :src="getLogoEquipo(partido.equipoLocalId)" 
                                  alt="Logo"
                                >
                                  <template v-slot:error>
                                    <v-icon :size="$vuetify.display.xs ? 10 : 12" color="white">mdi-shield</v-icon>
                                  </template>
                                </v-img>
                                <v-icon v-else :size="$vuetify.display.xs ? 10 : 12" color="white">mdi-shield</v-icon>
                              </v-avatar>
                            </v-col>
                            <v-col>
                              <span :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'font-weight-medium']">
                                {{ getNombreEquipo(partido.equipoLocalId) }}
                              </span>
                            </v-col>
                          </v-row>
                        </v-col>
                        
                        <v-col cols="4" class="text-center">
                          <span :class="[$vuetify.display.xs ? 'text-h6' : 'text-h5', 'font-weight-bold', getGolesLocal(partido) > getGolesVisitante(partido) ? 'text-primary' : 'text-grey-lighten-1']">
                            {{ getGolesLocal(partido) }}
                          </span>
                          <span class="mx-1">-</span>
                          <span :class="[$vuetify.display.xs ? 'text-h6' : 'text-h5', 'font-weight-bold', getGolesVisitante(partido) > getGolesLocal(partido) ? 'text-primary' : 'text-grey-lighten-1']">
                            {{ getGolesVisitante(partido) }}
                          </span>
                        </v-col>
                        
                        <v-col cols="4" class="text-right">
                          <v-row align="center" dense no-gutters justify="end">
                            <v-col>
                              <span :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'font-weight-medium']">
                                {{ getNombreEquipo(partido.equipoVisitanteId) }}
                              </span>
                            </v-col>
                            <v-col cols="auto">
                              <v-avatar 
                                :size="$vuetify.display.xs ? 20 : 24"
                                :color="getLogoEquipo(partido.equipoVisitanteId) ? 'transparent' : 'grey-darken-1'"
                                class="ml-2"
                              >
                                <v-img 
                                  v-if="getLogoEquipo(partido.equipoVisitanteId)" 
                                  :src="getLogoEquipo(partido.equipoVisitanteId)" 
                                  alt="Logo"
                                >
                                  <template v-slot:error>
                                    <v-icon :size="$vuetify.display.xs ? 10 : 12" color="white">mdi-shield</v-icon>
                                  </template>
                                </v-img>
                                <v-icon v-else :size="$vuetify.display.xs ? 10 : 12" color="white">mdi-shield</v-icon>
                              </v-avatar>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar -->
            <v-col v-if="proximoPartido" cols="12" lg="4">
              <!-- Próximo Partido -->
              <v-card elevation="0" class="rounded-lg">
                <v-card-title class="bg-grey-lighten-5 py-4">
                  <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-calendar-clock</v-icon>
                  <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">Próximo Partido</span>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'">
                  <div class="text-center mb-3">
                    <v-chip color="warning" variant="flat" class="mb-2">
                      Jornada {{ proximoPartido.jornada }}
                    </v-chip>
                    <div :class="[$vuetify.display.xs ? 'text-body-2' : 'text-body-1', 'font-weight-bold']">
                      {{ formatearFechaCompleta(proximoPartido.fecha) }}
                    </div>
                    <div v-if="proximoPartido.estadio" class="text-caption text-grey-darken-1 mt-1">
                      <v-icon size="14">mdi-map-marker</v-icon>
                      {{ proximoPartido.estadio }}
                    </div>
                  </div>

                  <v-row align="center" class="mt-4">
                    <v-col cols="5" class="text-center">
                      <v-avatar 
                        size="40"
                        :color="getLogoEquipo(proximoPartido.equipoLocalId) ? 'transparent' : 'grey-darken-1'"
                      >
                        <v-img 
                          v-if="getLogoEquipo(proximoPartido.equipoLocalId)" 
                          :src="getLogoEquipo(proximoPartido.equipoLocalId)" 
                          alt="Logo"
                        >
                          <template v-slot:error>
                            <v-icon size="20" color="white">mdi-shield</v-icon>
                          </template>
                        </v-img>
                        <v-icon v-else size="20" color="white">mdi-shield</v-icon>
                      </v-avatar>
                      <div :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'font-weight-medium', 'mt-1']">
                        {{ getNombreEquipo(proximoPartido.equipoLocalId) }}
                      </div>
                    </v-col>
                    <v-col cols="2" class="text-center">
                      <div :class="[$vuetify.display.xs ? 'text-h6' : 'text-h5', 'font-weight-bold', 'text-grey-darken-1']">VS</div>
                    </v-col>
                    <v-col cols="5" class="text-center">
                      <v-avatar 
                        size="40"
                        :color="getLogoEquipo(proximoPartido.equipoVisitanteId) ? 'transparent' : 'grey-darken-1'"
                      >
                        <v-img 
                          v-if="getLogoEquipo(proximoPartido.equipoVisitanteId)" 
                          :src="getLogoEquipo(proximoPartido.equipoVisitanteId)" 
                          alt="Logo"
                        >
                          <template v-slot:error>
                            <v-icon size="20" color="white">mdi-shield</v-icon>
                          </template>
                        </v-img>
                        <v-icon v-else size="20" color="white">mdi-shield</v-icon>
                      </v-avatar>
                      <div :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'font-weight-medium', 'mt-1']">
                        {{ getNombreEquipo(proximoPartido.equipoVisitanteId) }}
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Equipo no encontrado -->
        <v-card v-else elevation="0" class="rounded-lg">
          <v-card-text class="text-center py-12">
            <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-shield-alert</v-icon>
            <p :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="text-grey-darken-1 mt-4 mb-0">
              Equipo no encontrado
            </p>
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

// NUEVO: Obtener logo del equipo
const getLogoEquipo = (equipoIdOrEquipo) => {
  if (typeof equipoIdOrEquipo === 'string') {
    const eq = equipos.value.find(e => e.id === equipoIdOrEquipo);
    return eq?.logoUrl || null;
  }
  return equipoIdOrEquipo?.logoUrl || null;
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
.rounded-lg {
  border-radius: 12px !important;
  border: 1px solid rgb(var(--v-theme-grey-lighten-3));
}

.equipo-banner {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
}
</style>
