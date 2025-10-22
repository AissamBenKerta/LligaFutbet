<template>
  <div>
    <!-- Header Principal -->
    <v-app-bar color="white" elevation="0" height="72" class="header-bar">
      <v-container class="d-flex align-center">
        <div class="d-flex align-center" style="cursor: pointer;" @click="irInicio">
          <v-avatar size="50" class="mr-3 logo-avatar">
            <v-img :src="logoUrl" alt="Lliga Futbet" cover></v-img>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold text-grey-darken-4">Lliga Futbet</div>
            <div class="text-caption text-grey-darken-1">{{ nombreDivision }}</div>
          </div>
        </div>
        
        <v-spacer></v-spacer>

        <!-- Selector de División -->
        <v-btn-toggle
          v-model="divisionSeleccionada"
          color="primary"
          variant="outlined"
          mandatory
          class="mr-4"
        >
          <v-btn value="1" size="small" @click="cambiarDivision(1)">
            1ª División
          </v-btn>
          <v-btn value="2" size="small" @click="cambiarDivision(2)">
            2ª División
          </v-btn>
        </v-btn-toggle>
      </v-container>
    </v-app-bar>

    <!-- Navigation -->
    <v-app-bar color="white" elevation="0" height="56" class="nav-bar">
      <v-container>
        <v-tabs 
          v-model="activeTab"
          color="primary"
          align-tabs="center"
          density="compact"
          slider-color="primary"
        >
          <v-tab :value="divisionSlug" :to="`/${divisionSlug}`" class="text-body-2">Inicio</v-tab>
          <v-tab value="resultados" :to="`/${divisionSlug}/resultados`" class="text-body-2">Resultados</v-tab>
          <v-tab value="calendario" :to="`/${divisionSlug}/calendario`" class="text-body-2">Calendario</v-tab>
          <v-tab value="clasificacion" :to="`/${divisionSlug}/clasificacion`" class="text-body-2">Clasificación</v-tab>
          <v-tab value="equipos" :to="`/${divisionSlug}/equipos`" class="text-body-2">Equipos</v-tab>
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
const logoUrl = 'https://www.escoladefutboldesabadell.com/wp-content/uploads/2023/01/Logo_escola_80x80.png'; // <-- TU LINK AQUÍ
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
.header-bar {
  border-bottom: 1px solid #E2E8F0 !important;
}

.nav-bar {
  border-bottom: 1px solid #E2E8F0 !important;
}

.logo-avatar {
  border: 2px solid #E2E8F0;
}
</style>
