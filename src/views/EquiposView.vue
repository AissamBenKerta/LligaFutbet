<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold mb-2">
            Equipos
          </h1>
          <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
            {{ nombreDivision }} - Todos los equipos participantes
          </p>
        </div>

        <!-- Loading -->
        <v-row v-if="loading" justify="center" class="py-12">
          <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
        </v-row>

        <!-- Sin equipos -->
        <v-card v-else-if="equipos.length === 0" elevation="0" class="rounded-lg">
          <v-card-text class="text-center py-12">
            <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-shield-star</v-icon>
            <p :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="text-grey-darken-1 mt-4 mb-0">
              No hay equipos registrados en esta división
            </p>
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
            <v-card class="rounded-lg equipo-card" elevation="0" hover @click="verEquipo(equipo.id)">
              <!-- Header del equipo -->
              <div class="equipo-header pa-8 text-center">
<v-avatar 
  :size="$vuetify.display.xs ? 64 : 80" 
  :color="getLogoEquipo(equipo) ? 'transparent' : 'white'"
  class="elevation-4"
>
  <v-img 
    v-if="getLogoEquipo(equipo)" 
    :src="getLogoEquipo(equipo)" 
    alt="Logo"
  >
    <template v-slot:error>
      <v-icon :size="$vuetify.display.xs ? 32 : 40" color="primary">mdi-shield</v-icon>
    </template>
  </v-img>
  <v-icon v-else :size="$vuetify.display.xs ? 32 : 40" color="primary">mdi-shield</v-icon>
</v-avatar>

              </div>

              <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'" class="text-center">
                <h3 :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold mb-3">
                  {{ equipo.nombre }}
                </h3>

                <!-- Estadísticas -->
                <v-row dense no-gutters>
                  <v-col cols="4" class="text-center">
                    <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-primary">
                      {{ equipo.posicion }}º
                    </div>
                    <div class="text-caption text-grey-darken-1">Posición</div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-primary">
                      {{ equipo.puntos }}
                    </div>
                    <div class="text-caption text-grey-darken-1">Puntos</div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold text-primary">
                      {{ equipo.partidosJugados }}
                    </div>
                    <div class="text-caption text-grey-darken-1">PJ</div>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions :class="$vuetify.display.xs ? 'pa-2' : 'pa-3'">
                <v-btn variant="text" :size="$vuetify.display.xs ? 'small' : 'default'" color="primary" block>
                  Ver plantilla
                  <v-icon end :size="$vuetify.display.xs ? 16 : 18">mdi-chevron-right</v-icon>
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

const getLogoEquipo = (equipo) => {
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

.equipo-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.equipo-card:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: translateY(-4px);
}

.equipo-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
}
</style>
