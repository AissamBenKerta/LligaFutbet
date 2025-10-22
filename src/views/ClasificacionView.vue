<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <!-- Header -->
        <div class="page-header mb-6">
          <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Clasificación</h1>
          <p class="text-body-2 text-grey-darken-1">{{ nombreDivision }} - Tabla de posiciones actualizada</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <!-- Sin datos -->
        <v-card v-else-if="clasificacion.length === 0" elevation="0" class="empty-card">
          <v-card-text class="text-center py-12">
            <v-icon size="64" color="grey-lighten-2">mdi-table</v-icon>
            <p class="text-h6 text-grey-darken-1 mt-4 mb-0">No hay datos de clasificación</p>
          </v-card-text>
        </v-card>

        <!-- Tabla de Clasificación -->
        <v-card v-else elevation="0" class="clasificacion-card">
          <v-table class="clasificacion-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">Pos</th>
                <th>Equipo</th>
                <th class="text-center" style="width: 70px;">PJ</th>
                <th class="text-center" style="width: 70px;">PG</th>
                <th class="text-center" style="width: 70px;">PE</th>
                <th class="text-center" style="width: 70px;">PP</th>
                <th class="text-center" style="width: 70px;">GF</th>
                <th class="text-center" style="width: 70px;">GC</th>
                <th class="text-center" style="width: 70px;">DG</th>
                <th class="text-center font-weight-bold" style="width: 80px;">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(equipo, index) in clasificacion" 
                :key="equipo.id"
                :class="getRowClass(index)"
              >
                <td class="text-center">
                  <div class="posicion-badge" :class="{ 'top-badge': index < 3 }">
                    {{ index + 1 }}
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <v-avatar color="grey-lighten-3" size="32" class="mr-3">
                      <v-icon size="18" :color="index < 3 ? 'primary' : 'grey-darken-1'">
                        mdi-shield
                      </v-icon>
                    </v-avatar>
                    <span class="text-body-2 font-weight-bold">{{ equipo.nombre }}</span>
                  </div>
                </td>
                <td class="text-center text-grey-darken-1">{{ equipo.partidosJugados }}</td>
                <td class="text-center text-grey-darken-1">{{ equipo.ganados }}</td>
                <td class="text-center text-grey-darken-1">{{ equipo.empatados }}</td>
                <td class="text-center text-grey-darken-1">{{ equipo.perdidos }}</td>
                <td class="text-center text-grey-darken-1">{{ equipo.golesFavor }}</td>
                <td class="text-center text-grey-darken-1">{{ equipo.golesContra }}</td>
                <td class="text-center" :class="getDiferenciaClass(equipo.diferencia)">
                  {{ equipo.diferencia > 0 ? '+' : '' }}{{ equipo.diferencia }}
                </td>
                <td class="text-center">
                  <span class="text-h6 font-weight-bold text-primary">
                    {{ equipo.puntos }}
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider></v-divider>

          <v-card-text class="py-3 px-5 bg-grey-lighten-5">
            <div class="d-flex align-center text-caption text-grey-darken-1">
              <div class="legend-badge top-legend mr-2"></div>
              <span>Los primeros 3 equipos clasifican para la fase final</span>
            </div>
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

const getRowClass = (index) => {
  if (index < 3) return 'top-team';
  return '';
};

const getDiferenciaClass = (diff) => {
  if (diff > 0) return 'text-success font-weight-bold';
  if (diff < 0) return 'text-error font-weight-bold';
  return 'text-grey-darken-1 font-weight-medium';
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
.main-content {
  background: #F8FAFC;
}

.empty-card,
.clasificacion-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
  overflow: hidden;
}

.clasificacion-table {
  background: transparent;
}

.clasificacion-table thead {
  background: #F8FAFC;
}

.clasificacion-table thead th {
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  color: #64748B !important;
  padding: 20px 16px !important;
  border-bottom: 2px solid #E2E8F0 !important;
}

.clasificacion-table tbody td {
  padding: 18px 16px !important;
  font-size: 0.875rem;
}

.clasificacion-table tbody tr {
  transition: background 0.15s ease;
  border-bottom: 1px solid #F1F5F9;
}

.clasificacion-table tbody tr:hover {
  background: #F8FAFC;
}

.clasificacion-table tbody tr.top-team {
  background: #EFF6FF;
  border-left: 4px solid #2563EB;
}

.clasificacion-table tbody tr.top-team:hover {
  background: #DBEAFE;
}

.posicion-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F1F5F9;
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748B;
}

.posicion-badge.top-badge {
  background: #2563EB;
  color: white;
}

.legend-badge {
  width: 24px;
  height: 4px;
  border-radius: 2px;
}

.legend-badge.top-legend {
  background: #2563EB;
}

@media (max-width: 1200px) {
  .clasificacion-table {
    display: block;
    overflow-x: auto;
  }
  
  .clasificacion-table thead th,
  .clasificacion-table tbody td {
    padding: 12px 8px !important;
    font-size: 0.8rem;
  }
}
</style>
