<template>
  <div class="home">
    <!-- Nueva sección de introducción -->
    <section class="hero-section">
      <h1 class="hero-title">Bienvenido a Blog Simple</h1>
      <p class="hero-description">
        Comparte tus ideas, experiencias y conocimientos con el mundo. Blog Simple te permite crear, leer y explorar publicaciones de manera fácil y rápida. ¡Únete a nuestra comunidad de creadores y descubre historias inspiradoras!
      </p>
      <div class="hero-actions">
        <router-link v-if="isAuthenticated" :to="{ name: 'post-create' }" class="btn btn-primary">
          Crear un Nuevo Post
        </router-link>
        <router-link v-else to="/register" class="btn btn-primary">
          Únete Ahora
        </router-link>
        <router-link to="/posts" class="btn btn-secondary">
          Explorar Posts
        </router-link>
      </div>
    </section>

    <!-- Filtros de categorías -->
    <div class="filters" v-if="categoryStore.categories.length">
      <h3>Filtrar por categoría:</h3>
      <select v-model="selectedCategory" @change="filterByCategory" class="filter-select">
        <option :value="null">Todas las categorías</option>
        <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Estado de carga -->
    <div v-if="postStore.isLoading" class="loading">Cargando posts...</div>

    <!-- Sin publicaciones -->
    <div v-else-if="postStore.posts.length === 0" class="no-posts">
      No hay publicaciones disponibles.
    </div>

    <!-- Lista de publicaciones -->
    <div v-else class="posts-list">
      <div v-for="post in postStore.posts" :key="post.id" class="post-card">
        <h2>
          <router-link :to="{ name: 'post-detail', params: { id: post.id } }" class="post-title">
            {{ post.title }}
          </router-link>
        </h2>
        <p class="post-meta">
          Por: {{ post.user.name }} |
          {{ new Date(post.created_at).toLocaleString() }} |
          Comentarios: {{ post.comments_count }}
        </p>
        <div class="post-categories" v-if="post.categories && post.categories.length">
          <span v-for="category in post.categories" :key="category.id" class="category-badge">
            {{ category.name }}
          </span>
        </div>
        <p class="post-content">{{ truncateContent(post.content) }}</p>
        <router-link :to="{ name: 'post-detail', params: { id: post.id } }" class="read-more">
          Leer más
        </router-link>
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination" v-if="postStore.pagination.lastPage > 1">
      <button
        :disabled="postStore.pagination.currentPage === 1"
        @click="changePage(postStore.pagination.currentPage - 1)"
        class="pagination-button"
      >
        Anterior
      </button>

      <span class="pagination-info">Página {{ postStore.pagination.currentPage }} de {{ postStore.pagination.lastPage }}</span>

      <button
        :disabled="postStore.pagination.currentPage === postStore.pagination.lastPage"
        @click="changePage(postStore.pagination.currentPage + 1)"
        class="pagination-button"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from '@/stores/posts';
import { useCategoryStore } from '@/stores/categories';
import { useAuthStore } from '@/stores/auth';

const postStore = usePostStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const selectedCategory = ref(null);
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(async () => {
  try {
    await Promise.all([
      postStore.fetchPosts(),
      categoryStore.fetchCategories()
    ]);
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

const truncateContent = (content) => {
  if (content.length > 200) {
    return content.substring(0, 200) + '...';
  }
  return content;
};

const changePage = (page) => {
  postStore.fetchPosts(page, selectedCategory.value);
  window.scrollTo(0, 0);
};

const filterByCategory = () => {
  postStore.fetchPosts(1, selectedCategory.value);
};
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: #ffffff;
  color: #1e3a8a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Estilos para la nueva sección Hero */
.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: #ffffff;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="rgba(255,255,255,0.1)" d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"/></svg>') repeat;
  opacity: 0.3;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-description {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #ffffff;
  color: #1e3a8a;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background-color: transparent;
  color: #ffffff;
  border-color: #ffffff;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.btn-secondary:hover {
  background-color: #ffffff;
  color: #1e3a8a;
  transform: translateY(-2px);
}

/* Estilos existentes */
.filters {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filters h3 {
  margin: 0;
  color: #4b5563;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.loading,
.no-posts {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 1.1rem;
}

.posts-list {
  margin-top: 1.5rem;
}

.post-card {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.post-title {
  text-decoration: none;
  color: #1e3a8a;
  font-size: 1.5rem;
  font-weight: 600;
}

.post-title:hover {
  color: #3b82f6;
}

.post-meta {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.post-categories {
  margin-bottom: 0.75rem;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 9999px;
  font-size: 0.8rem;
  transition: background-color 0.3s ease;
}

.category-badge:hover {
  background-color: #2563eb;
}

.post-content {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.read-more {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  background-color: #10b981;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.read-more:hover {
  background-color: #059669;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #1e3a8a;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #1e3a8a;
}

.pagination-button:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.pagination-info {
  align-self: center;
  color: #4b5563;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .home {
    padding: 1rem 0.5rem;
  }

  .hero-section {
    padding: 2rem 0.5rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .post-card {
    padding: 1rem;
  }

  .post-title {
    font-size: 1.25rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pagination-button {
    width: 100%;
    text-align: center;
  }
}
</style>
