<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold mb-2">
            Calendario
          </h1>
          <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
            {{ nombreDivision }} - Próximos partidos programados
          </p>
        </div>

        <!-- Loading -->
        <v-row v-if="loading" justify="center" class="py-12">
          <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
        </v-row>

        <!-- Sin partidos -->
        <v-card v-else-if="partidosProgramados.length === 0" elevation="0" class="rounded-lg">
          <v-card-text class="text-center py-12">
            <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-calendar-blank</v-icon>
            <p :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="text-grey-darken-1 mt-4 mb-0">
              No hay partidos programados
            </p>
          </v-card-text>
        </v-card>

        <!-- Calendario por Jornadas -->
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
                <v-card class="rounded-lg" elevation="0">
                  <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-5'">
                    <!-- Fecha y hora -->
                    <v-row class="mb-4" justify="center" dense>
                      <v-col cols="auto">
                        <v-chip :size="$vuetify.display.xs ? 'small' : 'default'" variant="flat" color="primary">
                          <v-icon start :size="$vuetify.display.xs ? 14 : 16">mdi-calendar</v-icon>
                          {{ formatearFechaCompleta(partido.fecha) }}
                        </v-chip>
                      </v-col>
                      <v-col v-if="partido.estadio" cols="auto">
                        <v-chip :size="$vuetify.display.xs ? 'small' : 'default'" variant="outlined">
                          <v-icon start :size="$vuetify.display.xs ? 14 : 16">mdi-map-marker</v-icon>
                          {{ partido.estadio }}
                        </v-chip>
                      </v-col>
                    </v-row>

                    <!-- Enfrentamiento -->
                    <v-row align="center" dense>
                      <!-- Equipo Local -->
                      <v-col cols="5">
                        <v-row align="center" dense justify="center">
                          <v-col cols="12" class="text-center">
                            <v-avatar 
  :size="$vuetify.display.xs ? 48 : 64" 
  :color="getLogoEquipo(partido.equipoLocalId) ? 'transparent' : 'primary'"
  class="mb-2"
>
  <v-img 
    v-if="getLogoEquipo(partido.equipoLocalId)" 
    :src="getLogoEquipo(partido.equipoLocalId)" 
    alt="Logo"
  >
    <template v-slot:error>
      <v-icon :size="$vuetify.display.xs ? 24 : 32" color="white">mdi-shield</v-icon>
    </template>
  </v-img>
  <v-icon v-else :size="$vuetify.display.xs ? 24 : 32" color="white">mdi-shield</v-icon>
</v-avatar>
                            <div :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="font-weight-bold">
                              {{ getNombreEquipo(partido.equipoLocalId) }}
                            </div>
                            <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">Local</div>
                          </v-col>
                        </v-row>
                      </v-col>

                      <!-- VS -->
                      <v-col cols="2" class="text-center">
                        <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-black text-grey-lighten-1">
                          VS
                        </div>
                      </v-col>

                      <!-- Equipo Visitante -->
                      <v-col cols="5">
                        <v-row align="center" dense justify="center">
                          <v-col cols="12" class="text-center">
                            <v-avatar 
  :size="$vuetify.display.xs ? 48 : 64" 
  :color="getLogoEquipo(partido.equipoVisitanteId) ? 'transparent' : 'grey-darken-1'"
  class="mb-2"
>
  <v-img 
    v-if="getLogoEquipo(partido.equipoVisitanteId)" 
    :src="getLogoEquipo(partido.equipoVisitanteId)" 
    alt="Logo"
  >
    <template v-slot:error>
      <v-icon :size="$vuetify.display.xs ? 24 : 32" color="white">mdi-shield</v-icon>
    </template>
  </v-img>
  <v-icon v-else :size="$vuetify.display.xs ? 24 : 32" color="white">mdi-shield</v-icon>
</v-avatar>
                            <div :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="font-weight-bold">
                              {{ getNombreEquipo(partido.equipoVisitanteId) }}
                            </div>
                            <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">Visitante</div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getLogoEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.logoUrl || null;
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
.rounded-lg {
  border-radius: 12px !important;
  border: 1px solid rgb(var(--v-theme-grey-lighten-3));
}
</style>
