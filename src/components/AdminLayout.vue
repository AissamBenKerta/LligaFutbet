<template>
  <div>
    <!-- App Bar -->
    <v-app-bar 
      color="white" 
      elevation="0"
      :height="$vuetify.display.xs ? 56 : 64"
      class="border-b"
    >
      <v-container :fluid="$vuetify.display.xs">
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <!-- Menu toggle móvil -->
            <v-app-bar-nav-icon 
              v-if="$vuetify.display.xs"
              @click="drawer = !drawer"
            ></v-app-bar-nav-icon>
            
            <!-- Logo y título -->
            <v-row v-else align="center" no-gutters>
              <v-col cols="auto">
                <v-avatar size="40" color="primary" class="mr-3">
                  <v-icon size="20" color="white">mdi-shield-star</v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div :class="$vuetify.display.xs ? 'text-body-2' : 'text-h6'" class="font-weight-bold">
                  Admin Panel
                </div>
                <div v-if="!$vuetify.display.xs" class="text-caption text-grey-darken-1">
                  Lliga Futbet
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="auto">
            <v-btn
              variant="text"
              :size="$vuetify.display.xs ? 'small' : 'default'"
              @click="irAWeb"
            >
              <v-icon :start="!$vuetify.display.xs">mdi-web</v-icon>
              <span v-if="!$vuetify.display.xs">Ver Web</span>
            </v-btn>
            
            <v-btn
              variant="text"
              color="error"
              :size="$vuetify.display.xs ? 'small' : 'default'"
              @click="cerrarSesion"
            >
              <v-icon :start="!$vuetify.display.xs">mdi-logout</v-icon>
              <span v-if="!$vuetify.display.xs">Salir</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!$vuetify.display.xs"
      :temporary="$vuetify.display.xs"
      :width="$vuetify.display.xs ? 280 : 260"
    >
      <!-- Logo en drawer móvil -->
      <div v-if="$vuetify.display.xs" class="pa-4 border-b">
        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <v-avatar size="40" color="primary" class="mr-3">
              <v-icon size="20" color="white">mdi-shield-star</v-icon>
            </v-avatar>
          </v-col>
          <v-col>
            <div class="text-body-1 font-weight-bold">Admin Panel</div>
            <div class="text-caption text-grey-darken-1">Lliga Futbet</div>
          </v-col>
        </v-row>
      </div>

      <v-list density="compact" class="pa-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          to="/admin"
          exact
          rounded="lg"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-shield-star"
          title="Equipos"
          value="equipos"
          to="/admin/equipos"
          rounded="lg"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Jugadores"
          value="jugadores"
          to="/admin/jugadores"
          rounded="lg"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-soccer"
          title="Partidos"
          value="partidos"
          to="/admin/partidos"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido -->
    <v-main>
      <slot></slot>
    </v-main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { logout } = useAuth();

const drawer = ref(true);

const cerrarSesion = async () => {
  await logout();
  router.push('/login');
};

const irAWeb = () => {
  router.push('/1');
};
</script>

<style scoped>
.border-b {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
