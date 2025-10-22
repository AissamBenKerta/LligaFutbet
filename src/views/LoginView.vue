<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Panel Izquierdo - Solo Desktop -->
          <v-col v-if="!$vuetify.display.xs" cols="12" md="6" class="d-flex align-center justify-center login-banner">
            <div class="text-center pa-8">
              <v-avatar size="120" color="white" class="elevation-8 mb-6">
                <v-icon size="64" color="primary">mdi-shield-star</v-icon>
              </v-avatar>
              <h1 class="text-h3 font-weight-bold text-white mb-4">Lliga Futbet</h1>
              <p class="text-h6 text-white opacity-90">Panel de Administración</p>
            </div>
          </v-col>

          <!-- Panel Derecho - Formulario -->
          <v-col cols="12" md="6" class="d-flex align-center justify-center pa-4">
            <v-card 
              :width="$vuetify.display.xs ? '100%' : 480" 
              elevation="0"
              class="rounded-lg pa-4"
            >
              <v-card-text :class="$vuetify.display.xs ? 'pa-4' : 'pa-8'">
                <!-- Logo móvil -->
                <div v-if="$vuetify.display.xs" class="text-center mb-6">
                  <v-avatar size="80" color="primary" class="mb-3">
                    <v-icon size="40" color="white">mdi-shield-star</v-icon>
                  </v-avatar>
                  <h1 class="text-h5 font-weight-bold">Lliga Futbet</h1>
                  <p class="text-body-2 text-grey-darken-1">Panel de Administración</p>
                </div>

                <h2 :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="font-weight-bold mb-2">
                  Iniciar Sesión
                </h2>
                <p :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'" class="text-grey-darken-1 mb-6">
                  Accede al panel de administración
                </p>

                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    :disabled="loading"
                    required
                    class="mb-4"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    :disabled="loading"
                    required
                    class="mb-4"
                  ></v-text-field>

                  <v-alert
                    v-if="error"
                    type="error"
                    variant="tonal"
                    :density="$vuetify.display.xs ? 'compact' : 'comfortable'"
                    class="mb-4"
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    :size="$vuetify.display.xs ? 'default' : 'large'"
                    block
                    :loading="loading"
                    class="mb-4"
                  >
                    Iniciar Sesión
                  </v-btn>

                  <v-btn
                    variant="text"
                    color="grey-darken-1"
                    :size="$vuetify.display.xs ? 'small' : 'default'"
                    block
                    @click="volverInicio"
                  >
                    Volver al inicio
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { login: authLogin } = useAuth();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const login = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authLogin(email.value, password.value);
    router.push('/admin');
  } catch (err) {
    error.value = 'Credenciales incorrectas';
  } finally {
    loading.value = false;
  }
};

const volverInicio = () => {
  router.push('/1');
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.login-banner {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-primary-darken-1)) 100%);
}

.rounded-lg {
  border-radius: 12px !important;
  border: 1px solid rgb(var(--v-theme-grey-lighten-3));
}

.opacity-90 {
  opacity: 0.9;
}
</style>
