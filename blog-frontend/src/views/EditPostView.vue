<template>
  <div class="edit-post" v-if="loaded">
    <h1>Editar Publicación</h1>

    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="updatePost">
      <div class="form-group">
        <label for="title">Título</label>
        <input
          type="text"
          id="title"
          v-model="formData.title"
          required
        >
      </div>

      <div class="form-group">
        <label for="content">Contenido</label>
        <textarea
          id="content"
          v-model="formData.content"
          required
          rows="10"
        ></textarea>
      </div>

      <div class="form-group" v-if="categoryStore.categories.length">
        <label>Categorías</label>
        <div class="categories-select">
          <div v-for="category in categoryStore.categories" :key="category.id" class="category-checkbox">
            <input
              type="checkbox"
              :id="'category-' + category.id"
              :value="category.id"
              v-model="formData.categories"
            >
            <label :for="'category-' + category.id">{{ category.name }}</label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancel" class="cancel-button">Cancelar</button>
        <button type="submit" :disabled="isSubmitting" class="submit-button">
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>

  <div v-else-if="postStore.isLoading" class="loading">
    Cargando publicación...
  </div>

  <div v-else class="not-found">
    Post no encontrado o no tienes permisos para editarlo.
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/posts';
import { useCategoryStore } from '@/stores/categories';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const formData = reactive({
  title: '',
  content: '',
  categories: []
});

const error = ref('');
const isSubmitting = ref(false);
const loaded = ref(false);

onMounted(async () => {
  const postId = route.params.id;

  try {
    // Cargar post y categorías en paralelo
    await Promise.all([
      postStore.fetchPost(postId),
      categoryStore.fetchCategories()
    ]);

    // Verificar si el usuario es el autor
    if (postStore.post && postStore.post.user_id === authStore.user.id) {
      // Llenar el formulario con los datos del post
      formData.title = postStore.post.title;
      formData.content = postStore.post.content;
      formData.categories = postStore.post.categories
        ? postStore.post.categories.map(cat => cat.id)
        : [];

      loaded.value = true;
    } else {
      // Redirigir si no es el autor
      router.push({ name: 'home' });
    }
  } catch (err) {
    console.error('Error al cargar los datos:', err);
  }
});

const updatePost = async () => {
  try {
    error.value = '';
    isSubmitting.value = true;

    await postStore.updatePost(postStore.post.id, formData);
    router.push({ name: 'post-detail', params: { id: postStore.post.id } });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else if (err.response && err.response.data && err.response.data.errors) {
      // Mostrar el primer error de validación
      const firstError = Object.values(err.response.data.errors)[0][0];
      error.value = firstError;
    } else {
      error.value = 'Ha ocurrido un error al actualizar la publicación.';
    }
    console.error('Error al actualizar publicación:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  router.push({ name: 'post-detail', params: { id: postStore.post.id } });
};
</script>

<style scoped>
.edit-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"], textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.categories-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-checkbox {
  display: flex;
  align-items: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .submit-button {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
}

.submit-button {
  background-color: #28a745;
  color: white;
  border: none;
}

.submit-button:disabled {
  background-color: #cccccc;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}
</style>
