<template>
  <div class="create-post">
    <h1>Crear Nueva Publicación</h1>

    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="createPost">
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
          {{ isSubmitting ? 'Publicando...' : 'Publicar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/posts';
import { useCategoryStore } from '@/stores/categories';

const router = useRouter();
const postStore = usePostStore();
const categoryStore = useCategoryStore();

const formData = reactive({
  title: '',
  content: '',
  categories: []
});

const error = ref('');
const isSubmitting = ref(false);

onMounted(async () => {
  try {
    await categoryStore.fetchCategories();
  } catch (err) {
    console.error('Error al cargar las categorías:', err);
  }
});

const createPost = async () => {
  try {
    error.value = '';
    isSubmitting.value = true;

    await postStore.createPost(formData);
    router.push({ name: 'home' });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else if (err.response && err.response.data && err.response.data.errors) {
      // Mostrar el primer error de validación
      const firstError = Object.values(err.response.data.errors)[0][0];
      error.value = firstError;
    } else {
      error.value = 'Ha ocurrido un error al crear la publicación.';
    }
    console.error('Error al crear publicación:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  router.push({ name: 'home' });
};
</script>

<style scoped>
.create-post {
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
