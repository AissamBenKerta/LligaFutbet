<template>
  <div>
    <!-- Header -->
    <div class="manager-header mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">Gestión de Equipos</h2>
        <p class="text-body-2 text-grey-darken-1 mb-0">Administra todos los equipos de ambas divisiones</p>
      </div>
      <v-btn color="primary" size="large" prepend-icon="mdi-plus-circle" @click="abrirDialogNuevo">
        Nuevo Equipo
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

    <!-- Lista de equipos -->
    <v-row v-else>
      <v-col
        v-for="equipo in equiposFiltrados"
        :key="equipo.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card elevation="0" class="equipo-card">
          <v-card-text class="text-center pa-5">
            <!-- Logo del equipo -->
            <v-avatar :color="equipo.logoUrl ? 'transparent' : 'primary'" size="64" class="mb-3">
              <v-img v-if="equipo.logoUrl" :src="equipo.logoUrl" alt="Logo del equipo">
                <template v-slot:error>
                  <v-icon color="white" size="36">mdi-shield</v-icon>
                </template>
              </v-img>
              <v-icon v-else color="white" size="36">mdi-shield</v-icon>
            </v-avatar>

            <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-2">
              {{ equipo.nombre }}
            </h3>
            <v-chip size="small" :color="equipo.division === 1 ? 'primary' : 'secondary'">
              {{ equipo.division === 1 ? '1ª División' : '2ª División' }}
            </v-chip>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-card-actions class="pa-3">
            <v-btn variant="text" size="small" color="primary" @click="editarEquipo(equipo)">
              <v-icon start size="18">mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" size="small" color="error" @click="confirmarEliminar(equipo)">
              <v-icon start size="18">mdi-delete</v-icon>
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para crear/editar -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="dialog-title">
          <v-icon color="primary" class="mr-2">mdi-shield-star</v-icon>
          {{ modoEdicion ? 'Editar Equipo' : 'Nuevo Equipo' }}
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-6">
          <v-text-field
            v-model="form.nombre"
            label="Nombre del equipo"
            variant="outlined"
            color="primary"
            prepend-inner-icon="mdi-shield"
            :error-messages="errors.nombre"
            required
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="form.division"
            :items="[
              { title: '1ª División', value: 1 },
              { title: '2ª División', value: 2 }
            ]"
            label="División"
            variant="outlined"
            color="primary"
            prepend-inner-icon="mdi-trophy"
            :error-messages="errors.division"
            required
            class="mb-4"
          ></v-select>

          <!-- NUEVO: Campo de URL del logo -->
          <v-text-field
            v-model="form.logoUrl"
            label="URL del Logo (opcional)"
            placeholder="https://ejemplo.com/logo.png"
            variant="outlined"
            color="primary"
            prepend-inner-icon="mdi-image"
            :error-messages="errors.logoUrl"
            hint="Ingresa la URL pública del logo del equipo"
            persistent-hint
            class="mb-4"
          ></v-text-field>

          <!-- Preview del logo -->
          <div v-if="form.logoUrl" class="text-center mt-4">
            <v-card variant="outlined" class="pa-4 d-inline-block">
              <p class="text-caption text-grey-darken-1 mb-2">Vista previa del logo:</p>
              <v-avatar size="80" :color="logoError ? 'grey-lighten-4' : 'transparent'">
                <v-img 
                  :src="form.logoUrl" 
                  alt="Logo del equipo"
                  @error="logoError = true"
                  @load="logoError = false"
                >
                  <template v-slot:error>
                    <v-icon size="40" color="grey">mdi-image-broken</v-icon>
                  </template>
                </v-img>
              </v-avatar>
              <p v-if="logoError" class="text-caption text-error mt-2 mb-0">
                Error al cargar la imagen
              </p>
            </v-card>
          </div>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="cerrarDialog">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="guardar" :loading="guardando">
            {{ modoEdicion ? 'Guardar Cambios' : 'Crear Equipo' }}
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

const equipos = ref([]);
const dialog = ref(false);
const modoEdicion = ref(false);
const guardando = ref(false);
const filtroDiv = ref('todas');
const logoError = ref(false); // NUEVO
const form = ref({
  nombre: '',
  division: 1,
  logoUrl: '' // NUEVO
});
const errors = ref({});

const equiposFiltrados = computed(() => {
  if (filtroDiv.value === 'todas') return equipos.value;
  return equipos.value.filter(e => e.division === parseInt(filtroDiv.value));
});

const abrirDialogNuevo = () => {
  form.value = { nombre: '', division: 1, logoUrl: '' }; // ACTUALIZADO
  modoEdicion.value = false;
  logoError.value = false; // NUEVO
  errors.value = {};
  dialog.value = true;
};

const editarEquipo = (equipo) => {
  form.value = { 
    ...equipo,
    logoUrl: equipo.logoUrl || '' // ACTUALIZADO
  };
  modoEdicion.value = true;
  logoError.value = false; // NUEVO
  errors.value = {};
  dialog.value = true;
};

const cerrarDialog = () => {
  dialog.value = false;
  form.value = { nombre: '', division: 1, logoUrl: '' }; // ACTUALIZADO
  logoError.value = false; // NUEVO
  errors.value = {};
};

const validar = () => {
  errors.value = {};
  if (!form.value.nombre || form.value.nombre.trim() === '') {
    errors.value.nombre = 'El nombre es requerido';
    return false;
  }
  if (!form.value.division || (form.value.division !== 1 && form.value.division !== 2)) {
    errors.value.division = 'Debes seleccionar una división';
    return false;
  }
  return true;
};

const guardar = async () => {
  if (!validar()) return;
  
  guardando.value = true;
  try {
    const data = { 
      nombre: form.value.nombre,
      division: Number(form.value.division),
      logoUrl: form.value.logoUrl || null // NUEVO: Guarda null si está vacío
    };
    
    if (modoEdicion.value) {
      await updateDocument('equipos', form.value.id, data);
    } else {
      await addDocument('equipos', data);
    }
    cerrarDialog();
    await cargarEquipos();
    emit('reload');
  } catch (error) {
    console.error('Error al guardar:', error);
    errors.value.general = 'Error al guardar el equipo';
  } finally {
    guardando.value = false;
  }
};

const confirmarEliminar = (equipo) => {
  if (confirm(`¿Estás seguro de eliminar el equipo "${equipo.nombre}"?`)) {
    eliminarEquipo(equipo);
  }
};

const eliminarEquipo = async (equipo) => {
  try {
    await deleteDocument('equipos', equipo.id);
    await cargarEquipos();
    emit('reload');
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar el equipo');
  }
};

const cargarEquipos = async () => {
  equipos.value = await getCollection('equipos');
};

onMounted(() => {
  cargarEquipos();
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

.equipo-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px !important;
  transition: all 0.2s ease;
  height: 100%;
}

.equipo-card:hover {
  border-color: #2563EB;
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
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
