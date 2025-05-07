<template>
  <div class="home">
    <h1>Blog Simple</h1>

    <div class="filters" v-if="categoryStore.categories.length">
      <h3>Filtrar por categoría:</h3>
      <select v-model="selectedCategory" @change="filterByCategory">
        <option :value="null">Todas las categorías</option>
        <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div v-if="postStore.isLoading" class="loading">Cargando posts...</div>

    <div v-else-if="postStore.posts.length === 0" class="no-posts">
      No hay publicaciones disponibles.
    </div>

    <div v-else class="posts-list">
      <div v-for="post in postStore.posts" :key="post.id" class="post-card">
        <h2>
          <router-link :to="{ name: 'post-detail', params: { id: post.id } }">
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
        <p>{{ truncateContent(post.content) }}</p>
        <router-link :to="{ name: 'post-detail', params: { id: post.id } }" class="read-more">
          Leer más
        </router-link>
      </div>
    </div>

    <div class="pagination" v-if="postStore.pagination.lastPage > 1">
      <button
        :disabled="postStore.pagination.currentPage === 1"
        @click="changePage(postStore.pagination.currentPage - 1)"
      >
        Anterior
      </button>

      <span>Página {{ postStore.pagination.currentPage }} de {{ postStore.pagination.lastPage }}</span>

      <button
        :disabled="postStore.pagination.currentPage === postStore.pagination.lastPage"
        @click="changePage(postStore.pagination.currentPage + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePostStore } from '@/stores/posts';
import { useCategoryStore } from '@/stores/categories';

const postStore = usePostStore();
const categoryStore = useCategoryStore();
const selectedCategory = ref(null);

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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif; /* Añadido una fuente base */
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333; /* Añadido un color de texto */
}

.filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.filters h3 {
  margin-right: 10px;
  color: #555;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.loading,
.no-posts {
  text-align: center;
  padding: 20px;
  color: #777;
}

.posts-list {
  margin-top: 20px;
}

.post-card {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.post-card h2 {
  margin-bottom: 10px;
  color: #333;
}

.post-card h2 a {
  text-decoration: none;
  color: inherit;
}

.post-card h2 a:hover {
  color: #007bff; /* Añadido un color de hover para el enlace del título */
}

.post-meta {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 10px;
}

.post-categories {
  margin-bottom: 10px;
}

.category-badge {
  display: inline-block;
  padding: 5px 10px; /* Ajustado el padding para mejor apariencia */
  margin-right: 5px;
  background-color: #007bff; /* Cambiado a un color más llamativo */
  color: white; /* Texto blanco para mejor contraste */
  border-radius: 15px; /* Bordes más redondeados */
  font-size: 0.8rem;
}

.read-more {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 15px;
  text-decoration: none;
  background-color: #28a745; /* Color verde para "Leer más" */
  color: white;
  border-radius: 5px;
  font-size: 0.9rem;
}

.read-more:hover {
  background-color: #218838; /* Oscurecer al pasar el ratón */
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 15px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  color: #555;
  font-size: 0.9rem;
  align-self: center;
}
</style>
