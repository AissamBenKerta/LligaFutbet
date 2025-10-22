<template>
  <div>
    <!-- Header -->
    <div class="manager-header mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">Gestión de Partidos</h2>
        <p class="text-body-2 text-grey-darken-1 mb-0">Administra todos los partidos de la liga</p>
      </div>
      <v-btn color="primary" size="large" prepend-icon="mdi-plus-circle" @click="abrirDialogNuevo">
        Nuevo Partido
      </v-btn>
    </div>

    <!-- Filtro de división -->
    <div class="mb-4">
      <v-btn-toggle
        v-model="filtroDiv"
        color="primary"
        variant="outlined"
        mandatory
      >
        <v-btn value="todas">Todas</v-btn>
        <v-btn value="1">1ª División</v-btn>
        <v-btn value="2">2ª División</v-btn>
      </v-btn-toggle>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
    </div>

    <!-- Lista de partidos -->
    <v-row v-else>
      <v-col
        v-for="partido in partidosFiltrados"
        :key="partido.id"
        cols="12"
      >
        <v-card elevation="0" class="partido-card">
          <v-card-text class="pa-5">
            <v-row align="center">
              <!-- Jornada y fecha -->
              <v-col cols="12" md="2">
                <div class="partido-info">
                  <v-chip size="small" color="primary" variant="outlined" class="mb-2">
                    Jornada {{ partido.jornada }}
                  </v-chip>
                  <v-chip size="small" :color="getDivisionPartido(partido) === 1 ? 'primary' : 'secondary'" class="mb-2">
                    {{ getDivisionPartido(partido) === 1 ? '1ª' : '2ª' }} División
                  </v-chip>
                  <div class="text-caption text-grey-darken-1">
                    {{ formatearFecha(partido.fecha) }}
                  </div>
                  <div v-if="partido.estadio" class="text-caption text-grey-darken-1">
                    <v-icon size="14">mdi-map-marker</v-icon>
                    {{ partido.estadio }}
                  </div>
                </div>
              </v-col>

              <!-- Resultado -->
              <v-col cols="12" md="6">
                <div class="resultado-admin">
                  <!-- Equipo Local -->
                  <div class="equipo-nombre">
                    <v-icon size="20" color="grey-darken-1" class="mr-2">mdi-shield</v-icon>
                    {{ getNombreEquipo(partido.equipoLocalId) }}
                  </div>

                  <!-- Marcador -->
                  <div class="marcador-admin">
                    <span class="marcador-numero">{{ (partido.golesLocal || []).length }}</span>
                    <span class="marcador-separador">-</span>
                    <span class="marcador-numero">{{ (partido.golesVisitante || []).length }}</span>
                  </div>

                  <!-- Equipo Visitante -->
                  <div class="equipo-nombre text-right">
                    {{ getNombreEquipo(partido.equipoVisitanteId) }}
                    <v-icon size="20" color="grey-darken-1" class="ml-2">mdi-shield</v-icon>
                  </div>
                </div>
              </v-col>

              <!-- Estado -->
              <v-col cols="12" md="2">
                <v-chip 
                  :color="partido.finalizado ? 'success' : 'warning'" 
                  variant="flat"
                  size="small"
                >
                  {{ partido.finalizado ? 'Finalizado' : 'Programado' }}
                </v-chip>
              </v-col>

              <!-- Acciones -->
              <v-col cols="12" md="2" class="text-right">
                <v-btn variant="text" size="small" color="primary" @click="editarPartido(partido)" class="mr-2">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn variant="text" size="small" color="error" @click="confirmarEliminar(partido)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para crear/editar -->
    <v-dialog v-model="dialog" max-width="900" persistent scrollable>
      <v-card>
        <v-card-title class="dialog-title">
          <v-icon color="primary" class="mr-2">mdi-scoreboard</v-icon>
          {{ modoEdicion ? 'Editar Partido' : 'Nuevo Partido' }}
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-6">
          <v-row>
            <!-- Jornada -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="form.jornada"
                label="Jornada"
                type="number"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-calendar-range"
                :error-messages="errors.jornada"
                min="1"
                required
              ></v-text-field>
            </v-col>

            <!-- Fecha -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.fecha"
                label="Fecha"
                type="date"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-calendar"
                :error-messages="errors.fecha"
                required
              ></v-text-field>
            </v-col>

            <!-- Hora -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="form.hora"
                label="Hora"
                type="time"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-clock"
                required
              ></v-text-field>
            </v-col>

            <!-- Estadio -->
            <v-col cols="12" md="3">
              <v-select
                v-model="form.estadio"
                :items="estadios"
                label="Estadio"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-map-marker"
                :error-messages="errors.estadio"
                required
              ></v-select>
            </v-col>

            <!-- Equipo Local -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.equipoLocalId"
                :items="equiposConDivision"
                item-title="nombreCompleto"
                item-value="id"
                label="Equipo Local"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-shield"
                :error-messages="errors.equipoLocalId"
                required
                @update:model-value="cargarJugadoresLocal"
              ></v-select>
            </v-col>

            <!-- Equipo Visitante -->
            <v-col cols="12" md="6">
              <v-select
                v-model="form.equipoVisitanteId"
                :items="equiposCompatibles"
                item-title="nombreCompleto"
                item-value="id"
                label="Equipo Visitante"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-shield"
                :error-messages="errors.equipoVisitanteId"
                required
                @update:model-value="cargarJugadoresVisitante"
              ></v-select>
            </v-col>

            <!-- Estado -->
            <v-col cols="12">
              <v-checkbox
                v-model="form.finalizado"
                label="Partido finalizado"
                color="primary"
                hide-details
              ></v-checkbox>
            </v-col>

            <!-- Goles (solo si está finalizado) -->
            <v-col v-if="form.finalizado" cols="12">
              <v-divider class="my-4"></v-divider>
              <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-4">
                <v-icon color="primary" class="mr-2">mdi-soccer</v-icon>
                Goleadores
              </h3>
              
              <v-row>
                <!-- Goleadores Local -->
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4">
                    <h4 class="text-subtitle-1 font-weight-bold mb-3">
                      {{ getNombreEquipo(form.equipoLocalId) }}
                    </h4>
                    
                    <div v-for="(gol, index) in form.golesLocal" :key="index" class="mb-3">
                      <div class="d-flex align-center gap-2">
                        <v-select
                          v-model="gol.jugadorId"
                          :items="jugadoresLocal"
                          item-title="nombreCompleto"
                          item-value="id"
                          label="Jugador"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="flex-grow-1"
                        ></v-select>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="error"
                          @click="eliminarGolLocal(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                    
                    <v-btn
                      variant="outlined"
                      color="primary"
                      size="small"
                      prepend-icon="mdi-plus"
                      block
                      @click="agregarGolLocal"
                      :disabled="!form.equipoLocalId"
                    >
                      Añadir Gol
                    </v-btn>
                  </v-card>
                </v-col>

                <!-- Goleadores Visitante -->
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4">
                    <h4 class="text-subtitle-1 font-weight-bold mb-3">
                      {{ getNombreEquipo(form.equipoVisitanteId) }}
                    </h4>
                    
                    <div v-for="(gol, index) in form.golesVisitante" :key="index" class="mb-3">
                      <div class="d-flex align-center gap-2">
                        <v-select
                          v-model="gol.jugadorId"
                          :items="jugadoresVisitante"
                          item-title="nombreCompleto"
                          item-value="id"
                          label="Jugador"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="flex-grow-1"
                        ></v-select>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="error"
                          @click="eliminarGolVisitante(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                    
                    <v-btn
                      variant="outlined"
                      color="primary"
                      size="small"
                      prepend-icon="mdi-plus"
                      block
                      @click="agregarGolVisitante"
                      :disabled="!form.equipoVisitanteId"
                    >
                      Añadir Gol
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="cerrarDialog">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="guardar" :loading="guardando">
            {{ modoEdicion ? 'Guardar Cambios' : 'Crear Partido' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFirestore } from '../../composables/useFirestore';

const emit = defineEmits(['reload']);

const { loading, getCollection, addDocument, updateDocument, deleteDocument } = useFirestore();

const estadios = [
  'PAV. NORD',
  'SOL I PADRIS',
  'CAN MARCET',
  'PAV. OEST',
  'CAL BALSAC'
];

const partidos = ref([]);
const equipos = ref([]);
const jugadores = ref([]);
const jugadoresLocal = ref([]);
const jugadoresVisitante = ref([]);
const dialog = ref(false);
const modoEdicion = ref(false);
const guardando = ref(false);
const filtroDiv = ref('todas');
const form = ref({
  jornada: 1,
  fecha: '',
  hora: '',
  estadio: '',
  equipoLocalId: null,
  equipoVisitanteId: null,
  golesLocal: [],
  golesVisitante: [],
  finalizado: false
});
const errors = ref({});

// Equipos con nombre completo incluyendo división
const equiposConDivision = computed(() => {
  return equipos.value.map(e => ({
    ...e,
    nombreCompleto: `${e.nombre} (${e.division === 1 ? '1ª' : '2ª'} División)`
  }));
});

// Equipos compatibles: misma división que el equipo local
const equiposCompatibles = computed(() => {
  if (!form.value.equipoLocalId) return equiposConDivision.value;
  
  const equipoLocal = equipos.value.find(e => e.id === form.value.equipoLocalId);
  if (!equipoLocal) return equiposConDivision.value;
  
  return equiposConDivision.value.filter(e => 
    e.division === equipoLocal.division && e.id !== form.value.equipoLocalId
  );
});

// Filtrar partidos por división
const partidosFiltrados = computed(() => {
  if (filtroDiv.value === 'todas') return partidosOrdenados.value;
  
  const equiposDivision = equipos.value
    .filter(e => e.division === parseInt(filtroDiv.value))
    .map(e => e.id);
  
  return partidosOrdenados.value.filter(p => 
    equiposDivision.includes(p.equipoLocalId) && equiposDivision.includes(p.equipoVisitanteId)
  );
});

const partidosOrdenados = computed(() => {
  return [...partidos.value].sort((a, b) => {
    if (b.jornada !== a.jornada) return b.jornada - a.jornada;
    return new Date(b.fecha) - new Date(a.fecha);
  });
});

const abrirDialogNuevo = () => {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0];
  const hora = ahora.toTimeString().slice(0, 5);
  
  form.value = {
    jornada: 1,
    fecha,
    hora,
    estadio: '',
    equipoLocalId: null,
    equipoVisitanteId: null,
    golesLocal: [],
    golesVisitante: [],
    finalizado: false
  };
  jugadoresLocal.value = [];
  jugadoresVisitante.value = [];
  modoEdicion.value = false;
  errors.value = {};
  dialog.value = true;
};

const editarPartido = (partido) => {
  const fechaObj = new Date(partido.fecha);
  const fecha = fechaObj.toISOString().split('T')[0];
  const hora = fechaObj.toTimeString().slice(0, 5);
  
  form.value = {
    ...partido,
    fecha,
    hora,
    golesLocal: partido.golesLocal || [],
    golesVisitante: partido.golesVisitante || []
  };
  
  cargarJugadoresLocal();
  cargarJugadoresVisitante();
  
  modoEdicion.value = true;
  errors.value = {};
  dialog.value = true;
};

const cerrarDialog = () => {
  dialog.value = false;
  errors.value = {};
  jugadoresLocal.value = [];
  jugadoresVisitante.value = [];
};

const cargarJugadoresLocal = () => {
  if (form.value.equipoLocalId) {
    jugadoresLocal.value = jugadores.value
      .filter(j => j.equipoId === form.value.equipoLocalId)
      .map(j => ({
        ...j,
        nombreCompleto: `${j.dorsal ? '#' + j.dorsal : ''} ${j.nombre} ${j.apellidos}`
      }));
  }
};

const cargarJugadoresVisitante = () => {
  if (form.value.equipoVisitanteId) {
    jugadoresVisitante.value = jugadores.value
      .filter(j => j.equipoId === form.value.equipoVisitanteId)
      .map(j => ({
        ...j,
        nombreCompleto: `${j.dorsal ? '#' + j.dorsal : ''} ${j.nombre} ${j.apellidos}`
      }));
  }
};

const agregarGolLocal = () => {
  form.value.golesLocal.push({ jugadorId: null });
};

const agregarGolVisitante = () => {
  form.value.golesVisitante.push({ jugadorId: null });
};

const eliminarGolLocal = (index) => {
  form.value.golesLocal.splice(index, 1);
};

const eliminarGolVisitante = (index) => {
  form.value.golesVisitante.splice(index, 1);
};

const validar = () => {
  errors.value = {};
  let valido = true;
  
  if (!form.value.jornada || form.value.jornada < 1) {
    errors.value.jornada = 'La jornada es requerida';
    valido = false;
  }
  if (!form.value.fecha) {
    errors.value.fecha = 'La fecha es requerida';
    valido = false;
  }
  if (!form.value.estadio) {
    errors.value.estadio = 'El estadio es requerido';
    valido = false;
  }
  if (!form.value.equipoLocalId) {
    errors.value.equipoLocalId = 'Debes seleccionar el equipo local';
    valido = false;
  }
  if (!form.value.equipoVisitanteId) {
    errors.value.equipoVisitanteId = 'Debes seleccionar el equipo visitante';
    valido = false;
  }
  if (form.value.equipoLocalId === form.value.equipoVisitanteId) {
    errors.value.equipoVisitanteId = 'Los equipos deben ser diferentes';
    valido = false;
  }
  
  // Validar que ambos equipos sean de la misma división
  const equipoLocal = equipos.value.find(e => e.id === form.value.equipoLocalId);
  const equipoVisitante = equipos.value.find(e => e.id === form.value.equipoVisitanteId);
  
  if (equipoLocal && equipoVisitante && equipoLocal.division !== equipoVisitante.division) {
    errors.value.equipoVisitanteId = 'Los equipos deben ser de la misma división';
    valido = false;
  }
  
  return valido;
};

const guardar = async () => {
  if (!validar()) return;
  
  guardando.value = true;
  try {
    const fechaHora = `${form.value.fecha}T${form.value.hora || '00:00'}:00`;
    
    const golesLocalValidos = form.value.golesLocal.filter(g => g.jugadorId);
    const golesVisitanteValidos = form.value.golesVisitante.filter(g => g.jugadorId);
    
    const data = {
      jornada: form.value.jornada,
      fecha: fechaHora,
      estadio: form.value.estadio,
      equipoLocalId: form.value.equipoLocalId,
      equipoVisitanteId: form.value.equipoVisitanteId,
      golesLocal: golesLocalValidos,
      golesVisitante: golesVisitanteValidos,
      finalizado: form.value.finalizado || false
      // NO incluir division - se determina por los equipos
    };
    
    if (modoEdicion.value) {
      await updateDocument('partidos', form.value.id, data);
    } else {
      await addDocument('partidos', data);
    }
    
    if (form.value.finalizado) {
      await actualizarGolesJugadores(golesLocalValidos, golesVisitanteValidos);
    }
    
    cerrarDialog();
    await cargarPartidos();
    emit('reload');
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    guardando.value = false;
  }
};

const actualizarGolesJugadores = async (golesLocal, golesVisitante) => {
  const todosLosGoles = [...golesLocal, ...golesVisitante];
  
  const golesContados = {};
  todosLosGoles.forEach(gol => {
    if (!golesContados[gol.jugadorId]) {
      golesContados[gol.jugadorId] = 0;
    }
    golesContados[gol.jugadorId]++;
  });
  
  for (const jugadorId in golesContados) {
    const jugador = jugadores.value.find(j => j.id === jugadorId);
    if (jugador) {
      const golesActuales = jugador.goles || 0;
      await updateDocument('jugadores', jugadorId, {
        ...jugador,
        goles: golesActuales + golesContados[jugadorId]
      });
    }
  }
};

const confirmarEliminar = (partido) => {
  const local = getNombreEquipo(partido.equipoLocalId);
  const visitante = getNombreEquipo(partido.equipoVisitanteId);
  if (confirm(`¿Eliminar el partido ${local} vs ${visitante}?`)) {
    eliminarPartido(partido);
  }
};

const eliminarPartido = async (partido) => {
  try {
    await deleteDocument('partidos', partido.id);
    await cargarPartidos();
    emit('reload');
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
};

const getNombreEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.nombre || 'Desconocido';
};

const getDivisionPartido = (partido) => {
  const equipoLocal = equipos.value.find(e => e.id === partido.equipoLocalId);
  return equipoLocal?.division || 1;
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const cargarPartidos = async () => {
  partidos.value = await getCollection('partidos');
};

const cargarEquipos = async () => {
  equipos.value = await getCollection('equipos');
};

const cargarJugadores = async () => {
  jugadores.value = await getCollection('jugadores');
};

onMounted(async () => {
  await cargarEquipos();
  await cargarJugadores();
  await cargarPartidos();
});
</script>

<style scoped>
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.partido-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  transition: all 0.2s ease;
}

.partido-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
}

.partido-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resultado-admin {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.equipo-nombre {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #334155;
}

.marcador-admin {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.marcador-numero {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2563EB;
  min-width: 32px;
  text-align: center;
}

.marcador-separador {
  font-size: 1.25rem;
  font-weight: 600;
  color: #CBD5E1;
}

.dialog-title {
  padding: 20px !important;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}

@media (max-width: 600px) {
  .manager-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .manager-header .v-btn {
    width: 100%;
  }
  
  .resultado-admin {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }
  
  .equipo-nombre {
    justify-content: center;
  }
}
</style>
