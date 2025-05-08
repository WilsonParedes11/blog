<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style>
/* Estilos globales */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
  color: #333;
}

.main-content {
  min-height: calc(100vh - 160px);
}

h1, h2, h3 {
  margin-bottom: 15px;
}

a {
  color: #007bff;
}

.loading, .not-found {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
}

/* Estilos para formularios */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

button {
  cursor: pointer;
}
</style>
