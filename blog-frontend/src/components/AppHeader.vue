<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link :to="{ name: 'home' }" class="logo-link">Blog Simple</router-link>
      </div>

      <nav class="nav-menu">
        <router-link :to="{ name: 'home' }" class="nav-link">Inicio</router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link :to="{ name: 'create-post' }" class="nav-link">Crear Post</router-link>
          <router-link :to="{ name: 'profile' }" class="nav-link">Mi Perfil</router-link>
          <button @click="logout" class="logout-button">Cerrar Sesión</button>
        </template>

        <template v-else>
          <router-link :to="{ name: 'login' }" class="nav-link">Iniciar Sesión</router-link>
          <router-link :to="{ name: 'register' }" class="nav-link button">Registrarse</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  try {
    await authStore.logout();
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<style scoped>
.app-header {
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
}

.nav-link:hover, .logo-link:hover {
  color: #007bff;
}

.nav-link.button, .logout-button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.logout-button {
  background-color: #6c757d;
}

.nav-link.button:hover {
  background-color: #0069d9;
  color: white;
}

.logout-button:hover {
  background-color: #5a6268;
}
</style>
