<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <v-row>
          <!-- Columna Principal -->
          <v-col cols="12" lg="8">
            <!-- Header Sección -->
            <v-row class="mb-4" align="center">
              <v-col>
                <h2 :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold">
                  Últimos Resultados
                </h2>
                <p class="text-caption text-grey-darken-1 mb-0">
                  {{ nombreDivision }} - Partidos finalizados recientemente
                </p>
              </v-col>
              <v-col cols="auto">
                <v-btn 
                  variant="text" 
                  color="primary" 
                  :size="$vuetify.display.xs ? 'small' : 'default'"
                  :to="`/${divisionSlug}/resultados`"
                >
                  Ver todos
                  <v-icon end :size="$vuetify.display.xs ? 18 : 20">mdi-arrow-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Loading -->
            <v-row v-if="loading" justify="center" class="py-12">
              <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
            </v-row>

            <!-- Sin partidos -->
            <v-card v-else-if="ultimosPartidos.length === 0" elevation="0" class="rounded-lg">
              <v-card-text class="text-center py-8">
                <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-soccer-field</v-icon>
                <p class="text-body-2 text-grey-darken-1 mt-3 mb-0">No hay partidos finalizados</p>
              </v-card-text>
            </v-card>

            <!-- Lista de Partidos -->
            <v-row v-else dense>
              <v-col
                v-for="partido in ultimosPartidos.slice(0, 6)" 
                :key="partido.id"
                cols="12"
              >
                <v-card 
                  class="rounded-lg" 
                  elevation="0"
                  hover
                  @click="verDetallePartido(partido)"
                >
                  <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'">
                    <!-- Meta info -->
                    <v-row class="mb-3" align="center" dense>
                      <v-col cols="auto">
                        <v-chip 
                          :size="$vuetify.display.xs ? 'x-small' : 'small'" 
                          variant="flat" 
                          color="grey-lighten-4"
                        >
                          Jornada {{ partido.jornada }}
                        </v-chip>
                      </v-col>
                      <v-col>
                        <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                          {{ formatearFechaCompleta(partido.fecha) }}
                        </span>
                      </v-col>
                      <v-col cols="auto">
                        <v-chip 
                          :size="$vuetify.display.xs ? 'x-small' : 'small'" 
                          variant="flat" 
                          color="success" 
                          class="text-white"
                        >
                          Final
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
                              :size="$vuetify.display.xs ? 32 : 40"
                              :color="getLogoEquipo(partido.equipoLocalId) ? 'transparent' : (getGolesLocal(partido) > getGolesVisitante(partido) ? 'primary' : 'grey-lighten-3')"
                            >
                              <v-img 
                                v-if="getLogoEquipo(partido.equipoLocalId)" 
                                :src="getLogoEquipo(partido.equipoLocalId)" 
                                alt="Logo"
                              >
                                <template v-slot:error>
                                  <v-icon 
                                    :size="$vuetify.display.xs ? 16 : 20"
                                    :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'white' : 'grey-darken-1'"
                                  >
                                    mdi-shield
                                  </v-icon>
                                </template>
                              </v-img>
                              <v-icon 
                                v-else
                                :size="$vuetify.display.xs ? 16 : 20"
                                :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'white' : 'grey-darken-1'"
                              >
                                mdi-shield
                              </v-icon>
                            </v-avatar>
                          </v-col>
                          <v-col>
                            <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="font-weight-bold text-truncate">
                              {{ getNombreEquipo(partido.equipoLocalId) }}
                            </div>
                            <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">Local</div>
                          </v-col>
                        </v-row>
                      </v-col>

                      <!-- Marcador -->
                      <v-col cols="2" class="text-center">
                        <div class="d-flex justify-center align-center ga-1">
                          <span 
                            :class="[
                              $vuetify.display.xs ? 'text-h6' : 'text-h5',
                              'font-weight-bold',
                              getScoreClass(getGolesLocal(partido), getGolesVisitante(partido))
                            ]"
                          >
                            {{ getGolesLocal(partido) }}
                          </span>
                          <span class="text-grey-lighten-1 font-weight-medium">-</span>
                          <span 
                            :class="[
                              $vuetify.display.xs ? 'text-h6' : 'text-h5',
                              'font-weight-bold',
                              getScoreClass(getGolesVisitante(partido), getGolesLocal(partido))
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
                            <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="font-weight-bold text-truncate">
                              {{ getNombreEquipo(partido.equipoVisitanteId) }}
                            </div>
                            <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">Visitante</div>
                          </v-col>
                          <v-col cols="auto">
                            <v-avatar 
                                :size="$vuetify.display.xs ? 32 : 40"
                                :color="getLogoEquipo(partido.equipoVisitanteId) ? 'transparent' : (getGolesVisitante(partido) > getGolesLocal(partido) ? 'primary' : 'grey-lighten-3')"
                              >
                                <v-img 
                                  v-if="getLogoEquipo(partido.equipoVisitanteId)" 
                                  :src="getLogoEquipo(partido.equipoVisitanteId)" 
                                  alt="Logo"
                                >
                                  <template v-slot:error>
                                    <v-icon 
                                      :size="$vuetify.display.xs ? 16 : 20"
                                      :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'white' : 'grey-darken-1'"
                                    >
                                      mdi-shield
                                    </v-icon>
                                  </template>
                                </v-img>
                                <v-icon 
                                  v-else
                                  :size="$vuetify.display.xs ? 16 : 20"
                                  :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'white' : 'grey-darken-1'"
                                >
                                  mdi-shield
                                </v-icon>
                              </v-avatar>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions class="px-4 py-2">
                    <v-btn 
                      variant="text" 
                      :size="$vuetify.display.xs ? 'small' : 'default'"
                      color="grey-darken-1"
                    >
                      Ver detalles
                      <v-icon end :size="$vuetify.display.xs ? 16 : 18">mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" lg="4">
            <!-- Goleadores -->
            <v-card class="rounded-lg mb-4" elevation="0">
              <v-card-title class="bg-grey-lighten-5 py-4">
                <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-soccer</v-icon>
                <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">
                  Máximos Goleadores
                </span>
              </v-card-title>

              <v-divider></v-divider>

              <v-list class="pa-0" density="compact">
                <v-list-item
                  v-for="(jugador, index) in maximosGoleadores.slice(0, 10)"
                  :key="jugador.id"
                  class="py-2"
                >
                  <template v-slot:prepend>
                    <v-avatar 
                      :size="$vuetify.display.xs ? 28 : 32"
                      color="grey-lighten-4"
                    >
                      <span 
                        :class="[
                          $vuetify.display.xs ? 'text-caption' : 'text-body-2',
                          'font-weight-bold',
                          index < 3 ? 'text-primary' : 'text-grey-darken-1'
                        ]"
                      >
                        {{ index + 1 }}
                      </span>
                    </v-avatar>
                  </template>

                  <v-list-item-title :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="font-weight-medium">
                    {{ jugador.nombre }} {{ jugador.apellidos }}
                  </v-list-item-title>

                  <v-list-item-subtitle :class="$vuetify.display.xs ? 'text-caption' : 'text-caption'">
                    {{ getNombreEquipo(jugador.equipoId) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-chip 
                      :size="$vuetify.display.xs ? 'x-small' : 'small'"
                      color="grey-lighten-4"
                    >
                      <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-soccer</v-icon>
                      {{ jugador.goles || 0 }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Clasificación -->
            <v-card class="rounded-lg" elevation="0">
              <v-card-title class="bg-grey-lighten-5 py-4">
                <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-format-list-numbered</v-icon>
                <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">
                  Clasificación
                </span>
              </v-card-title>

              <v-divider></v-divider>

              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th>Equipo</th>
                    <th class="text-center">PJ</th>
                    <th class="text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(equipo, index) in clasificacion.slice(0, 8)" 
                    :key="equipo.id"
                    :class="index < 3 ? 'bg-blue-lighten-5' : ''"
                  >
                    <td class="text-center">
                      <v-chip 
                        :size="$vuetify.display.xs ? 'x-small' : 'small'"
                        :color="index < 3 ? 'primary' : 'grey-lighten-4'"
                        :variant="index < 3 ? 'flat' : 'flat'"
                      >
                        {{ index + 1 }}
                      </v-chip>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        <v-icon 
                          :size="$vuetify.display.xs ? 14 : 16" 
                          :color="index < 3 ? 'primary' : 'grey-darken-1'" 
                          class="mr-2"
                        >
                          mdi-shield
                        </v-icon>
                        <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="font-weight-medium text-truncate">
                          {{ equipo.nombre }}
                        </span>
                      </div>
                    </td>
                    <td class="text-center">
                      <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                        {{ equipo.partidosJugados }}
                      </span>
                    </td>
                    <td class="text-center">
                      <span :class="$vuetify.display.xs ? 'text-body-2' : 'text-body-1'" class="font-weight-bold text-primary">
                        {{ equipo.puntos }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-divider></v-divider>

              <v-card-actions class="pa-3">
                <v-btn 
                  variant="flat" 
                  color="primary" 
                  block
                  :size="$vuetify.display.xs ? 'small' : 'default'"
                  :to="`/${divisionSlug}/clasificacion`"
                >
                  Ver tabla completa
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

const partidos = ref([]);
const equipos = ref([]);
const jugadores = ref([]);

const ultimosPartidos = computed(() => {
  return partidos.value
    .filter(p => p.finalizado)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const maximosGoleadores = computed(() => {
  return [...jugadores.value]
    .filter(j => j.goles > 0)
    .sort((a, b) => (b.goles || 0) - (a.goles || 0));
});

const clasificacion = computed(() => {
  const stats = equipos.value.map(equipo => {
    const partidosLocal = partidos.value.filter(p => 
      p.equipoLocalId === equipo.id && p.finalizado
    );
    const partidosVisitante = partidos.value.filter(p => 
      p.equipoVisitanteId === equipo.id && p.finalizado
    );

    let ganados = 0, empatados = 0, perdidos = 0;

    partidosLocal.forEach(p => {
      const golesLocal = getGolesLocal(p);
      const golesVisitante = getGolesVisitante(p);
      if (golesLocal > golesVisitante) ganados++;
      else if (golesLocal === golesVisitante) empatados++;
      else perdidos++;
    });

    partidosVisitante.forEach(p => {
      const golesLocal = getGolesLocal(p);
      const golesVisitante = getGolesVisitante(p);
      if (golesVisitante > golesLocal) ganados++;
      else if (golesVisitante === golesLocal) empatados++;
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

  return stats.sort((a, b) => b.puntos - a.puntos);
});

const getNombreEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo ? equipo.nombre : 'Desconocido';
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric',
    month: 'short',
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
  if (score1 > score2) return 'text-primary';
  if (score1 < score2) return 'text-grey-lighten-1';
  return 'text-grey-darken-1';
};

const verDetallePartido = (partido) => {
  router.push(`/${divisionSlug.value}/partido/${partido.id}`);
};
const getLogoEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.logoUrl || null;
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
