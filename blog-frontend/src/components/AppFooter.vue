<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p>Blog Simple - Creado con Laravel 12 y Vue.js</p>
      <p>© {{ new Date().getFullYear() }}</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 50px;
  padding: 20px 0;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
