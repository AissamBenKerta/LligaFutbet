<template>
  <div>
    <!-- Header Principal -->
    <v-app-bar 
      color="white" 
      elevation="0" 
      :height="$vuetify.display.xs ? 56 : $vuetify.display.sm ? 64 : 72"
      class="border-b"
    >
      <v-container :fluid="$vuetify.display.xs">
        <v-row align="center" no-gutters>
          <!-- Logo y Nombre -->
          <v-col cols="auto">
            <div class="d-flex align-center" style="cursor: pointer;" @click="irInicio">
              <v-avatar 
                :size="$vuetify.display.xs ? 36 : $vuetify.display.sm ? 42 : 50" 
                class="mr-3"
              >
                <v-img :src="logoUrl" alt="Lliga Futbet" cover></v-img>
              </v-avatar>
              <div>
                <div 
                  :class="[
                    'font-weight-bold',
                    $vuetify.display.xs ? 'text-body-2' : $vuetify.display.sm ? 'text-body-1' : 'text-h6'
                  ]"
                >
                  Lliga Futbet
                </div>
                <div 
                  v-if="!$vuetify.display.xs"
                  class="text-caption text-grey-darken-1"
                >
                  {{ nombreDivision }}
                </div>
              </div>
            </div>
          </v-col>

          <v-spacer></v-spacer>

          <!-- Selector de División -->
          <v-col cols="auto">
            <v-btn-toggle
              v-model="divisionSeleccionada"
              color="primary"
              variant="outlined"
              mandatory
              :density="$vuetify.display.xs ? 'compact' : 'default'"
              divided
            >
              <v-btn 
                value="1" 
                :size="$vuetify.display.xs ? 'x-small' : $vuetify.display.sm ? 'small' : 'default'"
                @click="cambiarDivision(1)"
              >
                <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'">
                  1ª DIV
                </span>
              </v-btn>
              <v-btn 
                value="2" 
                :size="$vuetify.display.xs ? 'x-small' : $vuetify.display.sm ? 'small' : 'default'"
                @click="cambiarDivision(2)"
              >
                <span :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'">
                  2ª DIV
                </span>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Navigation -->
    <v-app-bar 
      color="white" 
      elevation="0"
      :height="$vuetify.display.xs ? 48 : 56"
      class="border-b"
    >
      <v-container :fluid="$vuetify.display.xs">
        <v-tabs 
          v-model="activeTab"
          color="primary"
          :align-tabs="$vuetify.display.xs ? 'center' : 'center'"
          :density="$vuetify.display.xs ? 'compact' : 'default'"
          slider-color="primary"
          show-arrows
          :height="$vuetify.display.xs ? 48 : 56"
        >
          <v-tab 
            :value="divisionSlug" 
            :to="`/${divisionSlug}`"
            :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'"
          >
            Inicio
          </v-tab>
          <v-tab 
            value="resultados" 
            :to="`/${divisionSlug}/resultados`"
            :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'"
          >
            Resultados
          </v-tab>
          <v-tab 
            value="calendario" 
            :to="`/${divisionSlug}/calendario`"
            :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'"
          >
            Calendario
          </v-tab>
          <v-tab 
            value="clasificacion" 
            :to="`/${divisionSlug}/clasificacion`"
            :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'"
          >
            <span v-if="$vuetify.display.xs">Clasif.</span>
            <span v-else>Clasificación</span>
          </v-tab>
          <v-tab 
            value="equipos" 
            :to="`/${divisionSlug}/equipos`"
            :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'"
          >
            Equipos
          </v-tab>
        </v-tabs>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDivision } from '../composables/useDivision';

const router = useRouter();
const { division, nombreDivision, divisionSlug } = useDivision();

const activeTab = ref('inicio');
const logoUrl = 'https://www.escoladefutboldesabadell.com/wp-content/uploads/2023/01/Logo_escola_80x80.png'; // Cambia por tu logo
const divisionSeleccionada = ref(divisionSlug.value);

watch(divisionSlug, (newDiv) => {
  divisionSeleccionada.value = newDiv;
});

const cambiarDivision = (div) => {
  const currentPath = router.currentRoute.value.path;
  const newPath = currentPath.replace(/\/(1|2)/, `/${div}`);
  router.push(newPath);
};

const irInicio = () => {
  router.push(`/${divisionSlug.value}`);
};
</script>

<style scoped>
.border-b {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

/* Eliminar espacios entre app-bars */
:deep(.v-toolbar__content) {
  padding: 0 !important;
}
</style>
