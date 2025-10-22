<template>
  <v-app>
    <AppHeader />

    <v-main class="bg-grey-lighten-4">
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold mb-2">
            Clasificación
          </h1>
          <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
            {{ nombreDivision }} - Tabla de posiciones actualizada
          </p>
        </div>

        <!-- Loading -->
        <v-row v-if="loading" justify="center" class="py-12">
          <v-progress-circular indeterminate color="primary" :size="$vuetify.display.xs ? 40 : 48"></v-progress-circular>
        </v-row>

        <!-- Sin datos -->
        <v-card v-else-if="clasificacion.length === 0" elevation="0" class="rounded-lg">
          <v-card-text class="text-center py-12">
            <v-icon :size="$vuetify.display.xs ? 48 : 64" color="grey-lighten-2">mdi-table</v-icon>
            <p :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="text-grey-darken-1 mt-4 mb-0">
              No hay datos de clasificación
            </p>
          </v-card-text>
        </v-card>

        <!-- Tabla de Clasificación -->
        <v-card v-else elevation="0" class="rounded-lg">
          <v-table :density="$vuetify.display.xs ? 'compact' : 'default'">
            <thead>
              <tr>
                <th class="text-center" style="width: 50px;">#</th>
                <th>Equipo</th>
                <th v-if="!$vuetify.display.xs" class="text-center">PJ</th>
                <th v-if="!$vuetify.display.xs" class="text-center">PG</th>
                <th v-if="!$vuetify.display.xs" class="text-center">PE</th>
                <th v-if="!$vuetify.display.xs" class="text-center">PP</th>
                <th v-if="!$vuetify.display.xs" class="text-center">GF</th>
                <th v-if="!$vuetify.display.xs" class="text-center">GC</th>
                <th class="text-center">DG</th>
                <th class="text-center font-weight-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(equipo, index) in clasificacion" 
                :key="equipo.id"
                :class="index < 3 ? 'bg-blue-lighten-5' : ''"
              >
                <td class="text-center">
                  <v-chip 
                    :size="$vuetify.display.xs ? 'x-small' : 'small'"
                    :color="index < 3 ? 'primary' : 'grey-lighten-4'"
                    variant="flat"
                  >
                    {{ index + 1 }}
                  </v-chip>
                </td>
                <td>
  <v-row align="center" dense no-gutters>
    <v-col cols="auto">
      <v-avatar 
        :size="$vuetify.display.xs ? 20 : 24"
        :color="getLogoEquipo(equipo) ? 'transparent' : (index < 3 ? 'primary' : 'grey-darken-1')"
        class="mr-2"
      >
        <v-img 
          v-if="getLogoEquipo(equipo)" 
          :src="getLogoEquipo(equipo)" 
          alt="Logo"
        >
          <template v-slot:error>
            <v-icon 
              :size="$vuetify.display.xs ? 10 : 12"
              :color="index < 3 ? 'white' : 'white'"
            >
              mdi-shield
            </v-icon>
          </template>
        </v-img>
        <v-icon 
          v-else
          :size="$vuetify.display.xs ? 10 : 12"
          :color="index < 3 ? 'white' : 'white'"
        >
          mdi-shield
        </v-icon>
      </v-avatar>
    </v-col>
    <v-col>
      <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="font-weight-medium text-truncate">
        {{ equipo.nombre }}
      </span>
    </v-col>
  </v-row>
</td>
                <td v-if="!$vuetify.display.xs" class="text-center">
                  <span class="text-body-2 text-grey-darken-1">{{ equipo.partidosJugados }}</span>
                </td>
                <td v-if="!$vuetify.display.xs" class="text-center">
                  <span class="text-body-2 text-grey-darken-1">{{ equipo.ganados }}</span>
                </td>
                <td v-if="!$vuetify.display.xs" class="text-center">
                  <span class="text-body-2 text-grey-darken-1">{{ equipo.empatados }}</span>
                </td>
                <td v-if="!$vuetify.display.xs" class="text-center">
                  <span class="text-body-2 text-grey-darken-1">{{ equipo.perdidos }}</span>
                </td>
                <td v-if="!$vuetify.display.xs" class="text-center">
                  <span class="text-body-2 text-grey-darken-1">{{ equipo.golesFavor }}</span>
                </td>
                <td v-if="!$vuetify.display.xs" class="text-center">
                  <span class="text-body-2 text-grey-darken-1">{{ equipo.golesContra }}</span>
                </td>
                <td class="text-center">
                  <v-chip 
                    :size="$vuetify.display.xs ? 'x-small' : 'small'"
                    :color="equipo.diferencia > 0 ? 'success' : equipo.diferencia < 0 ? 'error' : 'grey-lighten-4'"
                    variant="flat"
                  >
                    {{ equipo.diferencia > 0 ? '+' : '' }}{{ equipo.diferencia }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold text-primary">
                    {{ equipo.puntos }}
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider></v-divider>

          <v-card-text :class="$vuetify.display.xs ? 'pa-3' : 'pa-4'" class="bg-grey-lighten-5">
            <v-row align="center" dense>
              <v-col cols="auto">
                <div style="width: 24px; height: 4px; background: #2563EB; border-radius: 2px;"></div>
              </v-col>
              <v-col>
                <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                  Los primeros 3 equipos clasifican
                </span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
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

const clasificacion = computed(() => {
  const stats = equipos.value.map(equipo => {
    const partidosLocal = partidos.value.filter(p => 
      p.equipoLocalId === equipo.id && p.finalizado
    );
    const partidosVisitante = partidos.value.filter(p => 
      p.equipoVisitanteId === equipo.id && p.finalizado
    );

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

    return {
      ...equipo,
      partidosJugados: partidosLocal.length + partidosVisitante.length,
      ganados,
      empatados,
      perdidos,
      golesFavor,
      golesContra,
      diferencia: golesFavor - golesContra,
      puntos: (ganados * 3) + empatados
    };
  });

  return stats.sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
    return b.golesFavor - a.golesFavor;
  });
});

const getGolesLocal = (partido) => {
  if (Array.isArray(partido.golesLocal)) return partido.golesLocal.length;
  return partido.golesLocal || 0;
};

const getGolesVisitante = (partido) => {
  if (Array.isArray(partido.golesVisitante)) return partido.golesVisitante.length;
  return partido.golesVisitante || 0;
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
</style>
