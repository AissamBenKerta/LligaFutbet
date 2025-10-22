<template>
  <div>
    <!-- Header -->
    <div class="manager-header mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">Gestión de Jugadores</h2>
        <p class="text-body-2 text-grey-darken-1 mb-0">Administra todos los jugadores de la liga</p>
      </div>
      <v-btn color="primary" size="large" prepend-icon="mdi-plus-circle" @click="abrirDialogNuevo">
        Nuevo Jugador
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

    <!-- Tabla de jugadores -->
    <v-card v-else elevation="0" class="jugadores-table">
      <v-table>
        <thead>
          <tr>
            <th class="text-center">Dorsal</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Equipo</th>
            <th class="text-center">División</th>
            <th class="text-center">Goles</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="jugador in jugadoresFiltrados" :key="jugador.id">
            <td class="text-center">
              <v-avatar color="primary" size="32">
                <span class="text-white font-weight-bold text-body-2">{{ jugador.dorsal || '-' }}</span>
              </v-avatar>
            </td>
            <td class="font-weight-medium">{{ jugador.nombre }}</td>
            <td>{{ jugador.apellidos }}</td>
            <td>
              <v-chip size="small" color="primary" variant="outlined">
                {{ getNombreEquipo(jugador.equipoId) }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-chip size="small" :color="getDivisionEquipo(jugador.equipoId) === 1 ? 'primary' : 'secondary'">
                {{ getDivisionEquipo(jugador.equipoId) === 1 ? '1ª' : '2ª' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-chip size="small" color="success">
                <v-icon start size="16">mdi-soccer</v-icon>
                {{ jugador.goles || 0 }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn variant="text" size="small" color="primary" @click="editarJugador(jugador)" class="mr-2">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn variant="text" size="small" color="error" @click="confirmarEliminar(jugador)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Dialog para crear/editar -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="dialog-title">
          <v-icon color="primary" class="mr-2">mdi-account</v-icon>
          {{ modoEdicion ? 'Editar Jugador' : 'Nuevo Jugador' }}
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nombre"
                label="Nombre"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-account"
                :error-messages="errors.nombre"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.apellidos"
                label="Apellidos"
                variant="outlined"
                color="primary"
                :error-messages="errors.apellidos"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.dorsal"
                label="Número de Dorsal"
                type="number"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-numeric"
                :error-messages="errors.dorsal"
                min="1"
                max="99"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.goles"
                label="Goles"
                type="number"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-soccer"
                min="0"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.equipoId"
                :items="equipos"
                item-title="nombreCompleto"
                item-value="id"
                label="Equipo"
                variant="outlined"
                color="primary"
                prepend-inner-icon="mdi-shield"
                :error-messages="errors.equipoId"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="cerrarDialog">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="guardar" :loading="guardando">
            {{ modoEdicion ? 'Guardar Cambios' : 'Crear Jugador' }}
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

const jugadores = ref([]);
const equipos = ref([]);
const dialog = ref(false);
const modoEdicion = ref(false);
const guardando = ref(false);
const filtroDiv = ref('todas');
const form = ref({
  nombre: '',
  apellidos: '',
  dorsal: null,
  equipoId: null,
  goles: 0
});
const errors = ref({});

// Equipos con nombre completo incluyendo división
const equiposConDivision = computed(() => {
  return equipos.value.map(e => ({
    ...e,
    nombreCompleto: `${e.nombre} (${e.division === 1 ? '1ª' : '2ª'} División)`
  }));
});

// Filtrar jugadores por la división de su equipo
const jugadoresFiltrados = computed(() => {
  if (filtroDiv.value === 'todas') return jugadores.value;
  
  const equiposDivision = equipos.value
    .filter(e => e.division === parseInt(filtroDiv.value))
    .map(e => e.id);
  
  return jugadores.value.filter(j => equiposDivision.includes(j.equipoId));
});

const abrirDialogNuevo = () => {
  form.value = { nombre: '', apellidos: '', dorsal: null, equipoId: null, goles: 0 };
  modoEdicion.value = false;
  errors.value = {};
  dialog.value = true;
};

const editarJugador = (jugador) => {
  form.value = { ...jugador };
  modoEdicion.value = true;
  errors.value = {};
  dialog.value = true;
};

const cerrarDialog = () => {
  dialog.value = false;
  form.value = { nombre: '', apellidos: '', dorsal: null, equipoId: null, goles: 0 };
  errors.value = {};
};

const validar = () => {
  errors.value = {};
  let valido = true;
  
  if (!form.value.nombre?.trim()) {
    errors.value.nombre = 'El nombre es requerido';
    valido = false;
  }
  if (!form.value.apellidos?.trim()) {
    errors.value.apellidos = 'Los apellidos son requeridos';
    valido = false;
  }
  if (!form.value.dorsal || form.value.dorsal < 1 || form.value.dorsal > 99) {
    errors.value.dorsal = 'El dorsal debe ser entre 1 y 99';
    valido = false;
  }
  if (!form.value.equipoId) {
    errors.value.equipoId = 'Debes seleccionar un equipo';
    valido = false;
  }
  
  return valido;
};

const guardar = async () => {
  if (!validar()) return;
  
  guardando.value = true;
  try {
    const data = {
      nombre: form.value.nombre,
      apellidos: form.value.apellidos,
      dorsal: form.value.dorsal,
      equipoId: form.value.equipoId,
      goles: form.value.goles || 0
      // NO incluir division - se hereda del equipo
    };
    
    if (modoEdicion.value) {
      await updateDocument('jugadores', form.value.id, data);
    } else {
      await addDocument('jugadores', data);
    }
    cerrarDialog();
    await cargarJugadores();
    emit('reload');
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    guardando.value = false;
  }
};

const confirmarEliminar = (jugador) => {
  if (confirm(`¿Eliminar a ${jugador.nombre} ${jugador.apellidos}?`)) {
    eliminarJugador(jugador);
  }
};

const eliminarJugador = async (jugador) => {
  try {
    await deleteDocument('jugadores', jugador.id);
    await cargarJugadores();
    emit('reload');
  } catch (error) {
    console.error('Error al eliminar:', error);
  }
};

const getNombreEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.nombre || 'Sin equipo';
};

const getDivisionEquipo = (equipoId) => {
  const equipo = equipos.value.find(e => e.id === equipoId);
  return equipo?.division || 1;
};

const cargarJugadores = async () => {
  jugadores.value = await getCollection('jugadores');
};

const cargarEquipos = async () => {
  equipos.value = await getCollection('equipos');
};

onMounted(async () => {
  await cargarEquipos();
  await cargarJugadores();
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

.jugadores-table {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  overflow: hidden;
}

.jugadores-table thead {
  background: #F8FAFC;
}

.jugadores-table thead th {
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #64748B !important;
  padding: 16px !important;
}

.jugadores-table tbody td {
  padding: 16px !important;
}

.jugadores-table tbody tr {
  transition: background 0.15s ease;
  border-bottom: 1px solid #F1F5F9;
}

.jugadores-table tbody tr:hover {
  background: #F8FAFC;
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
}
</style>
