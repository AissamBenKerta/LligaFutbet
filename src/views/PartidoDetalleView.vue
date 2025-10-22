<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Loading -->
        <v-row v-if="loading" justify="center" class="py-12">
          <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
        </v-row>

        <div v-else-if="partido">
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

          <!-- Header del Partido -->
          <v-card elevation="0" class="rounded-lg mb-6 overflow-hidden">
            <div class="partido-banner pa-8">
              <!-- Jornada y estado -->
              <v-row justify="center" class="mb-4" dense>
                <v-col cols="auto">
                  <v-chip color="white" variant="flat" :size="$vuetify.display.xs ? 'small' : 'default'">
                    <v-icon start>mdi-calendar-range</v-icon>
                    Jornada {{ partido.jornada }}
                  </v-chip>
                </v-col>
                <v-col cols="auto">
                  <v-chip color="white" variant="flat" :size="$vuetify.display.xs ? 'small' : 'default'">
                    <v-icon start>mdi-trophy</v-icon>
                    {{ getDivisionPartido() === 1 ? 'Primera' : 'Segunda' }} División
                  </v-chip>
                </v-col>
                <v-col cols="auto">
                  <v-chip 
                    :color="partido.finalizado ? 'success' : 'warning'" 
                    variant="flat"
                    :size="$vuetify.display.xs ? 'small' : 'default'"
                  >
                    <v-icon start>{{ partido.finalizado ? 'mdi-check-circle' : 'mdi-clock-outline' }}</v-icon>
                    {{ partido.finalizado ? 'Finalizado' : 'Programado' }}
                  </v-chip>
                </v-col>
              </v-row>

              <!-- Resultado Principal -->
              <v-row align="center" class="my-6">
                <!-- Equipo Local -->
                <v-col cols="5" class="text-center" @click="irAEquipo(partido.equipoLocalId)">
                 <v-avatar 
  :size="$vuetify.display.xs ? 64 : 100" 
  :color="getLogoEquipo(partido.equipoLocalId) ? 'transparent' : 'white'"
  class="elevation-4 mb-3"
>
  <v-img 
    v-if="getLogoEquipo(partido.equipoLocalId)" 
    :src="getLogoEquipo(partido.equipoLocalId)" 
    alt="Logo"
  >
    <template v-slot:error>
      <v-icon :size="$vuetify.display.xs ? 32 : 50" color="primary">mdi-shield</v-icon>
    </template>
  </v-img>
  <v-icon v-else :size="$vuetify.display.xs ? 32 : 50" color="primary">mdi-shield</v-icon>
</v-avatar>
                  <h2 :class="$vuetify.display.xs ? 'text-body-1' : 'text-h5'" class="font-weight-bold text-white">
                    {{ getNombreEquipo(partido.equipoLocalId) }}
                  </h2>
                  <div class="text-caption text-blue-lighten-4">Local</div>
                </v-col>

                <!-- Marcador -->
                <v-col cols="2" class="text-center">
                  <div v-if="partido.finalizado">
                    <div class="d-flex justify-center align-center ga-2">
                      <span 
                        :class="[
                          $vuetify.display.xs ? 'text-h4' : 'text-h2',
                          'font-weight-black text-white',
                          { 'opacity-50': getGolesLocal(partido) < getGolesVisitante(partido) }
                        ]"
                      >
                        {{ getGolesLocal(partido) }}
                      </span>
                      <span :class="$vuetify.display.xs ? 'text-h5' : 'text-h3'" class="text-white opacity-50">-</span>
                      <span 
                        :class="[
                          $vuetify.display.xs ? 'text-h4' : 'text-h2',
                          'font-weight-black text-white',
                          { 'opacity-50': getGolesVisitante(partido) < getGolesLocal(partido) }
                        ]"
                      >
                        {{ getGolesVisitante(partido) }}
                      </span>
                    </div>
                  </div>
                  <div v-else :class="$vuetify.display.xs ? 'text-h4' : 'text-h2'" class="font-weight-black text-white">VS</div>
                </v-col>

                <!-- Equipo Visitante -->
                <v-col cols="5" class="text-center" @click="irAEquipo(partido.equipoVisitanteId)">
                  <v-avatar 
  :size="$vuetify.display.xs ? 64 : 100" 
  :color="getLogoEquipo(partido.equipoVisitanteId) ? 'transparent' : 'white'"
  class="elevation-4 mb-3"
>
  <v-img 
    v-if="getLogoEquipo(partido.equipoVisitanteId)" 
    :src="getLogoEquipo(partido.equipoVisitanteId)" 
    alt="Logo"
  >
    <template v-slot:error>
      <v-icon :size="$vuetify.display.xs ? 32 : 50" color="grey-darken-1">mdi-shield</v-icon>
    </template>
  </v-img>
  <v-icon v-else :size="$vuetify.display.xs ? 32 : 50" color="grey-darken-1">mdi-shield</v-icon>
</v-avatar>
                  <h2 :class="$vuetify.display.xs ? 'text-body-1' : 'text-h5'" class="font-weight-bold text-white">
                    {{ getNombreEquipo(partido.equipoVisitanteId) }}
                  </h2>
                  <div class="text-caption text-blue-lighten-4">Visitante</div>
                </v-col>
              </v-row>

              <!-- Info adicional -->
              <v-row justify="center" dense>
                <v-col cols="auto">
                  <v-chip color="white" variant="flat" :size="$vuetify.display.xs ? 'small' : 'default'">
                    <v-icon start :size="$vuetify.display.xs ? 14 : 18">mdi-clock-outline</v-icon>
                    {{ formatearFechaCompleta(partido.fecha) }}
                  </v-chip>
                </v-col>
                <v-col v-if="partido.estadio" cols="auto">
                  <v-chip color="white" variant="flat" :size="$vuetify.display.xs ? 'small' : 'default'">
                    <v-icon start :size="$vuetify.display.xs ? 14 : 18">mdi-map-marker</v-icon>
                    {{ partido.estadio }}
                  </v-chip>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Goleadores -->
          <v-row v-if="partido.finalizado && (partido.golesLocal?.length > 0 || partido.golesVisitante?.length > 0)">
            <v-col cols="12">
              <v-card elevation="0" class="rounded-lg mb-6">
                <v-card-title class="bg-grey-lighten-5 py-4">
                  <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-soccer</v-icon>
                  <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">
                    Goleadores del Partido
                  </span>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-6'">
                  <v-row>
                    <!-- Goleadores Local -->
                    <v-col cols="12" md="6">
                      <h3 :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold mb-4">
                        <v-icon color="primary" class="mr-2">mdi-shield</v-icon>
                        {{ getNombreEquipo(partido.equipoLocalId) }}
                      </h3>
                      
                      <v-list v-if="partido.golesLocal && partido.golesLocal.length > 0" class="pa-0" density="compact">
                        <v-list-item
                          v-for="(gol, index) in partido.golesLocal"
                          :key="index"
                          class="mb-2"
                        >
                          <template v-slot:prepend>
                            <v-avatar :size="$vuetify.display.xs ? 32 : 40" color="success">
                              <v-icon :size="$vuetify.display.xs ? 16 : 20" color="white">mdi-soccer</v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title :class="$vuetify.display.xs ? 'text-caption' : 'text-body-1'" class="font-weight-bold">
                            {{ getNombreJugador(gol.jugadorId) }}
                          </v-list-item-title>

                          <v-list-item-subtitle v-if="getDorsalJugador(gol.jugadorId)" class="text-caption">
                            #{{ getDorsalJugador(gol.jugadorId) }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                      <div v-else class="text-center text-grey-darken-1 py-4">Sin goles</div>
                    </v-col>

                    <!-- Goleadores Visitante -->
                    <v-col cols="12" md="6">
                      <h3 :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold mb-4">
                        <v-icon color="grey-darken-1" class="mr-2">mdi-shield</v-icon>
                        {{ getNombreEquipo(partido.equipoVisitanteId) }}
                      </h3>
                      
                      <v-list v-if="partido.golesVisitante && partido.golesVisitante.length > 0" class="pa-0" density="compact">
                        <v-list-item
                          v-for="(gol, index) in partido.golesVisitante"
                          :key="index"
                          class="mb-2"
                        >
                          <template v-slot:prepend>
                            <v-avatar :size="$vuetify.display.xs ? 32 : 40" color="success">
                              <v-icon :size="$vuetify.display.xs ? 16 : 20" color="white">mdi-soccer</v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title :class="$vuetify.display.xs ? 'text-caption' : 'text-body-1'" class="font-weight-bold">
                            {{ getNombreJugador(gol.jugadorId) }}
                          </v-list-item-title>

                          <v-list-item-subtitle v-if="getDorsalJugador(gol.jugadorId)" class="text-caption">
                            #{{ getDorsalJugador(gol.jugadorId) }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                      <div v-else class="text-center text-grey-darken-1 py-4">Sin goles</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Partido no encontrado -->
        <v-card v-else elevation="0" class="rounded-lg">
          <v-card-text class="text-center py-12">
            <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-alert-circle</v-icon>
            <p :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="text-grey-darken-1 mt-4 mb-0">
              Partido no encontrado
            </p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const getLogoEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.logoUrl || null;
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

const volver = () => {
  router.push(`/${divisionSlug.value}/resultados`);
};

const irAEquipo = (equipoId) => {
  router.push(`/${divisionSlug.value}/equipo/${equipoId}`);
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
.rounded-lg {
  border-radius: 12px !important;
  border: 1px solid rgb(var(--v-theme-grey-lighten-3));
}

.partido-banner {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
}

.opacity-50 {
  opacity: 0.5;
}
</style>
