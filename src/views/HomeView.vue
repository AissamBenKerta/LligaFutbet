<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <v-container class="py-8">
        <v-row>
          <!-- Columna Principal -->
          <v-col cols="12" lg="8">
            <!-- Header Sección -->
            <div class="section-header mb-6">
              <div>
                <h2 class="text-h5 font-weight-bold text-grey-darken-4">Últimos Resultados</h2>
                <p class="text-body-2 text-grey-darken-1 mb-0">{{ nombreDivision }} - Partidos finalizados recientemente</p>
              </div>
              <v-btn variant="text" color="primary" size="small" :to="`/${divisionSlug}/resultados`">
                Ver todos
                <v-icon end size="20">mdi-arrow-right</v-icon>
              </v-btn>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-12">
              <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
            </div>

            <!-- Sin partidos -->
            <v-card v-else-if="ultimosPartidos.length === 0" elevation="0" class="empty-card mb-4">
              <v-card-text class="text-center py-8">
                <v-icon size="48" color="grey-lighten-2">mdi-soccer-field</v-icon>
                <p class="text-body-2 text-grey-darken-1 mt-3 mb-0">No hay partidos finalizados en esta división</p>
              </v-card-text>
            </v-card>

            <!-- Lista de Partidos -->
            <div v-else class="partidos-container">
              <v-card
                v-for="partido in ultimosPartidos.slice(0, 6)" 
                :key="partido.id"
                class="partido-card mb-4"
                elevation="0"
                @click="verDetallePartido(partido)"
              >
                <v-card-text class="pa-6">
                  <!-- Meta info -->
                  <div class="partido-meta mb-5">
                    <v-chip size="small" variant="flat" color="grey-lighten-4" class="text-grey-darken-2">
                      Jornada {{ partido.jornada }}
                    </v-chip>
                    <span class="text-caption text-grey-darken-1">
                      {{ formatearFechaCompleta(partido.fecha) }}
                    </span>
                    <v-chip size="small" variant="flat" color="success" class="text-white">
                      Final
                    </v-chip>
                  </div>

                  <!-- Resultado HORIZONTAL -->
                  <div class="resultado-horizontal">
                    <!-- Equipo Local -->
                    <div class="equipo-info">
                      <v-avatar 
                        :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'primary' : 'grey-lighten-3'" 
                        size="56"
                      >
                        <v-icon 
                          size="28" 
                          :color="getGolesLocal(partido) > getGolesVisitante(partido) ? 'white' : 'grey-darken-1'"
                        >
                          mdi-shield
                        </v-icon>
                      </v-avatar>
                      <div class="equipo-texto">
                        <div class="text-body-1 font-weight-bold text-grey-darken-4">
                          {{ getNombreEquipo(partido.equipoLocalId) }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Local</div>
                      </div>
                    </div>

                    <!-- Marcador Central HORIZONTAL -->
                    <div class="marcador-horizontal">
                      <span 
                        class="marcador-numero" 
                        :class="getScoreClass(getGolesLocal(partido), getGolesVisitante(partido))"
                      >
                        {{ getGolesLocal(partido) }}
                      </span>
                      <span class="marcador-separador">-</span>
                      <span 
                        class="marcador-numero" 
                        :class="getScoreClass(getGolesVisitante(partido), getGolesLocal(partido))"
                      >
                        {{ getGolesVisitante(partido) }}
                      </span>
                    </div>

                    <!-- Equipo Visitante -->
                    <div class="equipo-info equipo-visitante">
                      <div class="equipo-texto text-right">
                        <div class="text-body-1 font-weight-bold text-grey-darken-4">
                          {{ getNombreEquipo(partido.equipoVisitanteId) }}
                        </div>
                        <div class="text-caption text-grey-darken-1">Visitante</div>
                      </div>
                      <v-avatar 
                        :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'primary' : 'grey-lighten-3'" 
                        size="56"
                      >
                        <v-icon 
                          size="28" 
                          :color="getGolesVisitante(partido) > getGolesLocal(partido) ? 'white' : 'grey-darken-1'"
                        >
                          mdi-shield
                        </v-icon>
                      </v-avatar>
                    </div>
                  </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="px-6 py-3">
                  <v-btn variant="text" size="small" color="grey-darken-1">
                    Ver detalles
                    <v-icon end size="18">mdi-chevron-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" lg="4">
            <!-- Goleadores -->
            <v-card class="sidebar-card mb-6" elevation="0">
              <v-card-title class="sidebar-card-title">
                <v-icon color="primary" size="24" class="mr-2">mdi-soccer</v-icon>
                <span class="text-h6 font-weight-bold">Máximos Goleadores</span>
              </v-card-title>

              <v-divider></v-divider>

              <v-list class="pa-0">
                <v-list-item
                  v-for="(jugador, index) in maximosGoleadores.slice(0, 10)"
                  :key="jugador.id"
                  class="goleador-item py-3"
                >
                  <template v-slot:prepend>
                    <div class="goleador-posicion">
                      <span class="posicion-numero" :class="{ 'top-tres': index < 3 }">
                        {{ index + 1 }}
                      </span>
                    </div>
                  </template>

                  <v-list-item-title class="text-body-2 font-weight-medium">
                    {{ jugador.nombre }} {{ jugador.apellidos }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-caption">
                    {{ getNombreEquipo(jugador.equipoId) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="goleador-goles">
                      <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-soccer</v-icon>
                      <span class="text-body-2 font-weight-bold">{{ jugador.goles || 0 }}</span>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Clasificación -->
            <v-card class="sidebar-card" elevation="0">
              <v-card-title class="sidebar-card-title">
                <v-icon color="primary" size="24" class="mr-2">mdi-format-list-numbered</v-icon>
                <span class="text-h6 font-weight-bold">Clasificación</span>
              </v-card-title>

              <v-divider></v-divider>

              <v-table class="clasificacion-table">
                <thead>
                  <tr>
                    <th class="text-center" style="width: 50px;">#</th>
                    <th>Equipo</th>
                    <th class="text-center" style="width: 50px;">PJ</th>
                    <th class="text-center" style="width: 60px;">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(equipo, index) in clasificacion.slice(0, 8)" 
                    :key="equipo.id"
                    :class="{ 'top-posicion': index < 3 }"
                  >
                    <td class="text-center">
                      <span class="tabla-posicion" :class="{ 'posicion-destacada': index < 3 }">
                        {{ index + 1 }}
                      </span>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        <v-icon size="16" :color="index < 3 ? 'primary' : 'grey-darken-1'" class="mr-2">
                          mdi-shield
                        </v-icon>
                        <span class="text-body-2 font-weight-medium text-truncate" style="max-width: 140px;">
                          {{ equipo.nombre }}
                        </span>
                      </div>
                    </td>
                    <td class="text-center text-grey-darken-1 text-body-2">
                      {{ equipo.partidosJugados }}
                    </td>
                    <td class="text-center">
                      <span class="text-body-1 font-weight-bold text-primary">
                        {{ equipo.puntos }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-divider></v-divider>

              <v-card-actions class="pa-4">
                <v-btn variant="flat" color="primary" block :to="`/${divisionSlug}/clasificacion`">
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
  if (score1 > score2) return 'winner';
  if (score1 < score2) return 'loser';
  return 'draw';
};

const verDetallePartido = (partido) => {
  router.push(`/${divisionSlug.value}/partido/${partido.id}`);
};

const cargarDatos = async () => {
  console.log('Cargando datos para división:', division.value);
  
  // Cargar TODOS los equipos y filtrar por división
  const todosEquipos = await getCollection('equipos');
  equipos.value = todosEquipos.filter(e => e.division === division.value);
  
  console.log('Equipos cargados:', equipos.value.length);
  
  // Obtener IDs de equipos de esta división
  const equiposIds = equipos.value.map(e => e.id);
  
  // Cargar jugadores solo de esta división
  const todosJugadores = await getCollection('jugadores');
  jugadores.value = todosJugadores.filter(j => equiposIds.includes(j.equipoId));
  
  console.log('Jugadores cargados:', jugadores.value.length);
  
  // Cargar partidos solo de esta división
  const todosPartidos = await getCollection('partidos');
  partidos.value = todosPartidos.filter(p => 
    equiposIds.includes(p.equipoLocalId) && equiposIds.includes(p.equipoVisitanteId)
  );
  
  console.log('Partidos cargados:', partidos.value.length);
  console.log('Partidos finalizados:', partidos.value.filter(p => p.finalizado).length);
};

// Recargar cuando cambie la división
watch(division, () => {
  console.log('División cambió a:', division.value);
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.partidos-container {
  display: flex;
  flex-direction: column;
}

.partido-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  transition: all 0.2s ease;
  cursor: pointer;
  background: white;
}

.partido-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
  transform: translateY(-2px);
}

.partido-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.resultado-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.equipo-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.equipo-info.equipo-visitante {
  flex-direction: row-reverse;
}

.equipo-texto {
  flex: 1;
  min-width: 0;
}

.equipo-texto > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.marcador-horizontal {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  flex-shrink: 0;
}

.marcador-numero {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  min-width: 48px;
  text-align: center;
}

.marcador-numero.winner {
  color: #2563EB;
}

.marcador-numero.loser {
  color: #94A3B8;
}

.marcador-numero.draw {
  color: #64748B;
}

.marcador-separador {
  color: #CBD5E1;
  font-weight: 600;
  font-size: 1.5rem;
}

.sidebar-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

.sidebar-card-title {
  padding: 20px !important;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}

.goleador-item {
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s ease;
}

.goleador-item:hover {
  background: #F8FAFC;
}

.goleador-posicion {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #F1F5F9;
  margin-right: 12px;
}

.posicion-numero {
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748B;
}

.posicion-numero.top-tres {
  color: #2563EB;
}

.goleador-goles {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: #F1F5F9;
  border-radius: 6px;
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
  padding: 16px 12px !important;
  border-bottom: 1px solid #E2E8F0 !important;
}

.clasificacion-table tbody td {
  padding: 16px 12px !important;
}

.clasificacion-table tbody tr {
  transition: background 0.15s ease;
  border-bottom: 1px solid #F1F5F9;
}

.clasificacion-table tbody tr:hover {
  background: #F8FAFC;
}

.clasificacion-table tbody tr.top-posicion {
  background: #EFF6FF;
}

.tabla-posicion {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748B;
}

.tabla-posicion.posicion-destacada {
  color: #2563EB;
  font-weight: 700;
}

.empty-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  background: white;
}

/* RESPONSIVE - MANTENER HORIZONTAL EN MÓVIL */
@media (max-width: 960px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .section-header .v-btn {
    align-self: stretch;
  }
  
  .partido-card .pa-6 {
    padding: 16px !important;
  }
  
  .partido-meta {
    font-size: 0.75rem;
    gap: 6px;
  }
  
  .partido-meta .v-chip {
    font-size: 0.7rem !important;
    height: 22px !important;
  }
  
  .resultado-horizontal {
    gap: 8px;
    padding: 12px 0;
  }
  
  .equipo-info {
    gap: 8px;
  }
  
  .equipo-info .v-avatar {
    width: 40px !important;
    height: 40px !important;
  }
  
  .equipo-info .v-avatar .v-icon {
    font-size: 20px !important;
  }
  
  .equipo-texto .text-body-1 {
    font-size: 0.85rem !important;
    line-height: 1.2;
  }
  
  .equipo-texto .text-caption {
    font-size: 0.65rem !important;
  }
  
  .marcador-horizontal {
    padding: 0 8px;
    gap: 6px;
  }
  
  .marcador-numero {
    font-size: 1.75rem !important;
    font-weight: 900;
    min-width: 36px;
  }
  
  .marcador-separador {
    font-size: 1.25rem !important;
  }
}

@media (max-width: 600px) {
  .v-container {
    padding: 12px 8px !important;
  }
  
  .partido-card {
    border-radius: 8px !important;
  }
  
  .partido-card .pa-6 {
    padding: 12px !important;
  }
  
  .partido-meta {
    gap: 4px;
    margin-bottom: 12px !important;
  }
  
  .resultado-horizontal {
    gap: 6px;
  }
  
  .equipo-info {
    gap: 6px;
  }
  
  .equipo-info .v-avatar {
    width: 36px !important;
    height: 36px !important;
  }
  
  .equipo-info .v-avatar .v-icon {
    font-size: 18px !important;
  }
  
  .equipo-texto .text-body-1 {
    font-size: 0.8rem !important;
  }
  
  .equipo-texto .text-caption {
    font-size: 0.6rem !important;
  }
  
  .marcador-horizontal {
    padding: 0 6px;
    gap: 4px;
  }
  
  .marcador-numero {
    font-size: 1.5rem !important;
    min-width: 32px;
  }
  
  .marcador-separador {
    font-size: 1rem !important;
  }
  
  .section-header h2 {
    font-size: 1.25rem !important;
  }
  
  .section-header .text-body-2 {
    font-size: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .partido-card .pa-6 {
    padding: 10px !important;
  }
  
  .equipo-info .v-avatar {
    width: 32px !important;
    height: 32px !important;
  }
  
  .equipo-info .v-avatar .v-icon {
    font-size: 16px !important;
  }
  
  .equipo-texto .text-body-1 {
    font-size: 0.75rem !important;
  }
  
  .equipo-texto .text-caption {
    font-size: 0.55rem !important;
  }
  
  .marcador-numero {
    font-size: 1.35rem !important;
    min-width: 28px;
  }
  
  .marcador-separador {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 380px) {
  .equipo-texto .text-body-1 {
    font-size: 0.7rem !important;
  }
  
  .marcador-numero {
    font-size: 1.25rem !important;
    min-width: 26px;
  }
  
  .marcador-separador {
    font-size: 0.85rem !important;
  }
}
</style>
