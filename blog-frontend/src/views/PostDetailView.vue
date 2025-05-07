<template>
  <div class="post-detail" v-if="postStore.post">
    <button @click="goBack" class="back-button">← Volver</button>

    <article class="post">
      <h1>{{ postStore.post.title }}</h1>

      <div class="post-meta">
        Por: {{ postStore.post.user.name }} |
        {{ new Date(postStore.post.created_at).toLocaleString() }}
      </div>

      <div class="post-categories" v-if="postStore.post.categories && postStore.post.categories.length">
        <span v-for="category in postStore.post.categories" :key="category.id" class="category-badge">
          {{ category.name }}
        </span>
      </div>

      <div class="post-content">
        {{ postStore.post.content }}
      </div>

      <div class="post-actions" v-if="isAuthor">
        <router-link :to="{ name: 'edit-post', params: { id: postStore.post.id } }" class="edit-button">
          Editar
        </router-link>
        <button @click="confirmDelete" class="delete-button">Eliminar</button>
      </div>
    </article>

    <section class="comments-section">
      <h2>Comentarios ({{ commentStore.comments.length }})</h2>

      <div class="add-comment" v-if="authStore.isAuthenticated">
        <h3>Añadir un comentario</h3>
        <textarea
          v-model="commentContent"
          placeholder="Escribe tu comentario..."
          rows="4"
        ></textarea>
        <button @click="addComment" :disabled="!commentContent.trim() || commentStore.isLoading">
          {{ commentStore.isLoading ? 'Enviando...' : 'Comentar' }}
        </button>
      </div>

      <div v-else class="login-prompt">
        <p>Debes <router-link :to="{ name: 'login' }">iniciar sesión</router-link> para comentar.</p>
      </div>

      <div class="comments-list" v-if="commentStore.comments.length">
        <div v-for="comment in commentStore.comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <strong>{{ comment.user.name }}</strong>
            <span class="comment-date">
              {{ new Date(comment.created_at).toLocaleString() }}
            </span>
          </div>
          <p>{{ comment.content }}</p>
          <button
            v-if="isCommentAuthor(comment)"
            @click="deleteComment(comment.id)"
            class="delete-comment-button"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div v-else class="no-comments">
        No hay comentarios todavía. ¡Sé el primero en comentar!
      </div>
    </section>
  </div>

  <div v-else-if="postStore.isLoading" class="loading">
    Cargando publicación...
  </div>

  <div v-else class="not-found">
    Post no encontrado.
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/posts';
import { useCommentStore } from '@/stores/comments';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const commentStore = useCommentStore();
const authStore = useAuthStore();

const commentContent = ref('');

onMounted(async () => {
  const postId = route.params.id;

  try {
    await postStore.fetchPost(postId);
    await commentStore.fetchComments(postId);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
});

const isAuthor = computed(() => {
  if (!authStore.isAuthenticated || !postStore.post || !authStore.user) {
    return false;
  }
  return postStore.post.user_id === authStore.user.id;
});

const isCommentAuthor = (comment) => {
  if (!authStore.isAuthenticated || !authStore.user) {
    return false;
  }
  return comment.user_id === authStore.user.id;
};

const goBack = () => {
  router.back();
};

const confirmDelete = () => {
  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    deletePost();
  }
};

const deletePost = async () => {
  try {
    await postStore.deletePost(postStore.post.id);
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    alert('No se pudo eliminar la publicación.');
  }
};

const addComment = async () => {
  if (!commentContent.value.trim()) return;

  try {
    await commentStore.createComment(postStore.post.id, commentContent.value);
    commentContent.value = '';
  } catch (error) {
    console.error('Error al añadir comentario:', error);
    alert('No se pudo añadir el comentario.');
  }
};

const deleteComment = async (commentId) => {
  if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
    try {
      await commentStore.deleteComment(commentId);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      alert('No se pudo eliminar el comentario.');
    }
  }
};
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  padding: 5px 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.post {
  margin-bottom: 30px;
}

.post-meta {
  font-size: 0.9rem;
  color: #666;
  margin: 10px 0;
}

.post-categories {
  margin-bottom: 20px;
}

.category-badge {
  display: inline-block;
  padding: 3px 8px;
  margin-right: 5px;
  background-color: #e9ecef;
  border-radius: 10px;
  font-size: 0.75rem;
}

.post-content {
  line-height: 1.6;
  margin-bottom: 30px;
  white-space: pre-line;
}

.post-actions {
  margin-top: 20px;
}

.edit-button, .delete-button {
  display: inline-block;
  padding: 5px 15px;
  margin-right: 10px;
  border-radius: 4px;
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

.comments-section {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.add-comment textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-comment button {
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-comment button:disabled {
  background-color: #cccccc;
}

.comment {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.comment-header {
  margin-bottom: 10px;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.delete-comment-button {
  padding: 3px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.login-prompt {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}
</style>
