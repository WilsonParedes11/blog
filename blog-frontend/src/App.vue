<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff; /* Fondo blanco explícito */
  width: 100%;
}

.main-content {
  flex: 1 0 auto;
  min-height: calc(100vh - 160px);
  width: 100%;
  padding: 0;
}

/* Transiciones suaves para el cambio de vistas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos globales */
:global(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:global(html, body) {
  height: 100%;
  font-family: 'Arial', 'Helvetica', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #ffffff; /* Fondo blanco para el body */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:global(h1, h2, h3) {
  margin-bottom: 15px;
  color: #1e3a8a;
}

:global(a) {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

:global(a:hover) {
  color: #2563eb;
}

:global(.loading, .not-found) {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #6b7280;
}

/* Estilos para formularios */
:global(input, textarea, select) {
  font-family: inherit;
  font-size: inherit;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

:global(input:focus, textarea:focus, select:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

:global(button) {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  transition: background-color 0.3s ease;
}

:global(button:focus) {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
