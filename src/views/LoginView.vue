<template>
  <v-app>
    <v-main class="login-main">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="5" lg="4" xl="3">
            <!-- Logo y título -->
            <div class="text-center mb-8">
              <v-avatar color="primary" size="72" class="mb-4 elevation-3">
                <v-icon color="white" size="40">mdi-soccer</v-icon>
              </v-avatar>
              <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Liga Fútbol Sala</h1>
              <p class="text-body-2 text-grey-darken-1">Panel de Administración</p>
            </div>

            <!-- Tarjeta de Login -->
            <v-card elevation="0" class="login-card">
              <v-card-text class="pa-8">
                <h2 class="text-h5 font-weight-bold text-grey-darken-4 mb-2">Iniciar Sesión</h2>
                <p class="text-body-2 text-grey-darken-1 mb-6">Accede al panel de administración</p>

                <v-form @submit.prevent="handleLogin">
                  <!-- Email -->
                  <v-text-field
                    v-model="email"
                    label="Correo electrónico"
                    type="email"
                    variant="outlined"
                    color="primary"
                    prepend-inner-icon="mdi-email-outline"
                    :error-messages="emailError"
                    class="mb-3"
                    required
                  ></v-text-field>

                  <!-- Password -->
                  <v-text-field
                    v-model="password"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    color="primary"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    :error-messages="passwordError"
                    class="mb-4"
                    required
                  ></v-text-field>

                  <!-- Remember me -->
                  <div class="d-flex justify-space-between align-center mb-6">
                    <v-checkbox
                      v-model="rememberMe"
                      label="Recordarme"
                      color="primary"
                      hide-details
                      density="compact"
                    ></v-checkbox>
                    <v-btn variant="text" size="small" color="primary">
                      ¿Olvidaste tu contraseña?
                    </v-btn>
                  </div>

                  <!-- Error message -->
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mb-4"
                  >
                    {{ errorMessage }}
                  </v-alert>

                  <!-- Submit button -->
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-4"
                  >
                    Iniciar Sesión
                  </v-btn>
                </v-form>

                <!-- Divider -->
                <v-divider class="my-6"></v-divider>

                <!-- Back to home -->
                <div class="text-center">
                  <v-btn variant="text" color="grey-darken-1" to="/" prepend-icon="mdi-arrow-left">
                    Volver al inicio
                  </v-btn>
                </div>
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
const { login } = useAuth();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const emailError = ref('');
const passwordError = ref('');

const handleLogin = async () => {
  // Reset errors
  emailError.value = '';
  passwordError.value = '';
  errorMessage.value = '';

  // Validation
  if (!email.value) {
    emailError.value = 'El correo es requerido';
    return;
  }
  if (!password.value) {
    passwordError.value = 'La contraseña es requerida';
    return;
  }

  loading.value = true;

  try {
    const success = await login(email.value, password.value);
    
    if (success) {
      router.push('/admin');
    } else {
      errorMessage.value = 'Credenciales incorrectas';
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión. Intenta de nuevo.';
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-main {
  background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
  min-height: 100vh;
}

.login-card {
  border: 1px solid #E2E8F0;
  border-radius: 16px !important;
  background: white;
}

@media (max-width: 600px) {
  .login-card .pa-8 {
    padding: 24px !important;
  }
}
</style>
