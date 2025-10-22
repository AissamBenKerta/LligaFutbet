<template>
  <v-app>
    <AdminLayout>
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <!-- Header -->
        <div class="mb-6">
          <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold mb-2">
            Dashboard
          </h1>
          <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
            Resumen general de la liga
          </p>
        </div>

        <!-- Estadísticas Generales -->
        <v-row class="mb-6">
          <v-col cols="6" sm="6" md="3">
            <v-card elevation="0" class="rounded-lg pa-4 text-center">
              <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="primary" class="mb-3">
                <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-shield-star</v-icon>
              </v-avatar>
              <div :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold text-primary">
                {{ totalEquipos }}
              </div>
              <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                Equipos
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="3">
            <v-card elevation="0" class="rounded-lg pa-4 text-center">
              <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="success" class="mb-3">
                <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-account-group</v-icon>
              </v-avatar>
              <div :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold text-success">
                {{ totalJugadores }}
              </div>
              <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                Jugadores
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="3">
            <v-card elevation="0" class="rounded-lg pa-4 text-center">
              <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="warning" class="mb-3">
                <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-soccer</v-icon>
              </v-avatar>
              <div :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold text-warning">
                {{ totalPartidos }}
              </div>
              <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                Partidos
              </div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="3">
            <v-card elevation="0" class="rounded-lg pa-4 text-center">
              <v-avatar :size="$vuetify.display.xs ? 40 : 56" color="error" class="mb-3">
                <v-icon :size="$vuetify.display.xs ? 20 : 28" color="white">mdi-clock-alert</v-icon>
              </v-avatar>
              <div :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold text-error">
                {{ partidosPendientes }}
              </div>
              <div :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
                Pendientes
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Accesos Rápidos -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card elevation="0" class="rounded-lg">
              <v-card-title class="bg-grey-lighten-5 py-4">
                <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-lightning-bolt</v-icon>
                <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">
                  Accesos Rápidos
                </span>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text :class="$vuetify.display.xs ? 'pa-2' : 'pa-4'">
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-shield-plus"
                    title="Añadir Equipo"
                    to="/admin/equipos"
                    rounded="lg"
                  ></v-list-item>
                  
                  <v-list-item
                    prepend-icon="mdi-account-plus"
                    title="Añadir Jugador"
                    to="/admin/jugadores"
                    rounded="lg"
                  ></v-list-item>
                  
                  <v-list-item
                    prepend-icon="mdi-calendar-plus"
                    title="Crear Partido"
                    to="/admin/partidos"
                    rounded="lg"
                  ></v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card elevation="0" class="rounded-lg">
              <v-card-title class="bg-grey-lighten-5 py-4">
                <v-icon color="primary" :size="$vuetify.display.xs ? 20 : 24" class="mr-2">mdi-trophy</v-icon>
                <span :class="$vuetify.display.xs ? 'text-body-1' : 'text-h6'" class="font-weight-bold">
                  Máximos Goleadores
                </span>
              </v-card-title>

              <v-divider></v-divider>

              <v-list density="compact">
                <v-list-item
                  v-for="(jugador, index) in topGoleadores"
                  :key="jugador.id"
                >
                  <template v-slot:prepend>
                    <v-avatar :size="$vuetify.display.xs ? 28 : 32" :color="index < 3 ? 'primary' : 'grey-lighten-4'">
                      <span :class="[$vuetify.display.xs ? 'text-caption' : 'text-body-2', 'font-weight-bold', index < 3 ? 'text-white' : 'text-grey-darken-1']">
                        {{ index + 1 }}
                      </span>
                    </v-avatar>
                  </template>

                  <v-list-item-title :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'">
                    {{ jugador.nombre }} {{ jugador.apellidos }}
                  </v-list-item-title>

                  <template v-slot:append>
                    <v-chip :size="$vuetify.display.xs ? 'x-small' : 'small'" color="success">
                      <v-icon start :size="$vuetify.display.xs ? 12 : 16">mdi-soccer</v-icon>
                      {{ jugador.goles }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </AdminLayout>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFirestore } from '../composables/useFirestore';
import AdminLayout from '../components/AdminLayout.vue';

const { getCollection } = useFirestore();

const equipos = ref([]);
const jugadores = ref([]);
const partidos = ref([]);

const totalEquipos = computed(() => equipos.value.length);
const totalJugadores = computed(() => jugadores.value.length);
const totalPartidos = computed(() => partidos.value.length);
const partidosPendientes = computed(() => partidos.value.filter(p => !p.finalizado).length);

const topGoleadores = computed(() => {
  return [...jugadores.value]
    .filter(j => j.goles > 0)
    .sort((a, b) => b.goles - a.goles)
    .slice(0, 5);
});

const cargarDatos = async () => {
  equipos.value = await getCollection('equipos');
  jugadores.value = await getCollection('jugadores');
  partidos.value = await getCollection('partidos');
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
</style>
