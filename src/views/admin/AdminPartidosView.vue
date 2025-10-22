<template>
  <v-app>
    <AdminLayout>
      <v-container :fluid="$vuetify.display.xs" class="py-6">
        <div class="mb-6">
          <h1 :class="$vuetify.display.xs ? 'text-h5' : 'text-h4'" class="font-weight-bold mb-2">
            Gestión de Partidos
          </h1>
          <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1">
            Administrar todos los partidos de la liga
          </p>
        </div>

        <PartidosManager />
      </v-container>
    </AdminLayout>
  </v-app>
</template>

<script setup>
import AdminLayout from '../../components/AdminLayout.vue';
import PartidosManager from '../../components/admin/PartidosManager.vue';
</script>
