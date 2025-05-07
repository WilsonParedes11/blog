<template>
  <div class="register-container">
    <h1>Registro</h1>

    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
        >
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
        >
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
          minlength="8"
        >
      </div>

      <div class="form-group">
        <label for="password_confirmation">Confirmar Contraseña</label>
        <input
          type="password"
          id="password_confirmation"
          v-model="formData.password_confirmation"
          required
        >
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <div class="login-link">
        ¿Ya tienes una cuenta?
        <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const error = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  try {
    // Validación simple
    if (formData.password !== formData.password_confirmation) {
      error.value = 'Las contraseñas no coinciden';
      return;
    }

    error.value = '';
    isLoading.value = true;

    await authStore.register(formData);
    router.push({ name: 'home' });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else if (err.response && err.response.data && err.response.data.errors) {
      // Mostrar el primer error de validación
      const firstError = Object.values(err.response.data.errors)[0][0];
      error.value = firstError;
    } else {
      error.value = 'Ha ocurrido un error al registrarse.';
    }
    console.error('Error de registro:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

.login-link {
  margin-top: 15px;
  text-align: center;
}
</style>
