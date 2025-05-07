<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>

    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          autocomplete="email"
        >
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
          autocomplete="current-password"
        >
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>

      <div class="register-link">
        ¿No tienes una cuenta?
        <router-link :to="{ name: 'register' }">Regístrate</router-link>
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
  email: '',
  password: ''
});

const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  try {
    error.value = '';
    isLoading.value = true;

    await authStore.login(formData);
    router.push({ name: 'home' });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Ha ocurrido un error al iniciar sesión.';
    }
    console.error('Error de inicio de sesión:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
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

.register-link {
  margin-top: 15px;
  text-align: center;
}
</style>
