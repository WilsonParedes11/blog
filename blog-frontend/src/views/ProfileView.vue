<template>
  <div class="profile">
    <h1>Mi Perfil</h1>

    <div class="user-info">
      <h2>{{ authStore.user.name }}</h2>
      <p>{{ authStore.user.email }}</p>
    </div>

    <div class="my-posts-section">
      <h2>Mis Publicaciones</h2>

      <div v-if="isLoading" class="loading">Cargando publicaciones...</div>

      <div v-else-if="posts.length === 0" class="no-posts">
        No has creado ninguna publicación todavía.
        <router-link :to="{ name: 'create-post' }" class="create-post-link">
          Crear mi primera publicación
        </router-link>
      </div>

      <div v-else class="posts-list">
        <div v-for="post in posts" :key="post.id" class="post-item">
          <h3>
            <router-link :to="{ name: 'post-detail', params: { id: post.id } }">
              {{ post.title }}
            </router-link>
          </h3>
          <p class="post-date">{{ new Date(post.created_at).toLocaleString() }}</p>
          <div class="post-actions">
            <router-link :to="{ name: 'edit-post', params: { id: post.id } }" class="edit-button">
              Editar
            </router-link>
            <button @click="() => confirmDelete(post.id)" class="delete-button">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const posts = ref([])
const isLoading = ref(false)

onMounted(() => {
  fetchUserPosts()
})

const fetchUserPosts = async () => {
  isLoading.value = true
  try {
    // Asumimos que hay un endpoint para obtener posts por usuario
    const response = await api.get('/user/posts')
    posts.value = response.data
  } catch (error) {
    console.error('Error al cargar las publicaciones del usuario:', error)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = (postId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    deletePost(postId)
  }
}

const deletePost = async (postId) => {
  try {
    // Eliminar el post
    await api.delete(`/posts/${postId}`)
    // Actualizar la lista de posts
    posts.value = posts.value.filter((post) => post.id !== postId)
  } catch (error) {
    console.error('Error al eliminar la publicación:', error)
    alert('No se pudo eliminar la publicación.')
  }
}
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.my-posts-section {
  margin-top: 30px;
}

.no-posts {
  margin: 20px 0;
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.create-post-link {
  display: block;
  margin-top: 10px;
  color: #007bff;
}

.post-item {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.post-date {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 10px;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

.edit-button {
  background-color: #007bff;
  color: white;
  text-decoration: none;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
}
</style>
