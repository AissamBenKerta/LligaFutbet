import { ref } from 'vue';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

const user = ref(null);
const loading = ref(true);

export function useAuth() {
  const error = ref(null);

  // Inicializar el estado del usuario
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    loading.value = false;
  });

  // Login
  const login = async (email, password) => {
    error.value = null;
    loading.value = true;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      return true;
    } catch (err) {
      error.value = getErrorMessage(err.code);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Register (para crear el primer admin)
  const register = async (email, password) => {
    error.value = null;
    loading.value = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      return true;
    } catch (err) {
      error.value = getErrorMessage(err.code);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    error.value = null;
    try {
      await signOut(auth);
      user.value = null;
      return true;
    } catch (err) {
      error.value = 'Error al cerrar sesión';
      return false;
    }
  };

  // Mensajes de error en español
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-not-found':
        return 'No existe una cuenta con ese email';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas';
      default:
        return 'Error de autenticación';
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
}
