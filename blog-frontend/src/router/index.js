import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import PostDetailView from '@/views/PostDetailView.vue';
import CreatePostView from '@/views/CreatePostView.vue';
import EditPostView from '@/views/EditPostView.vue';
import ProfileView from '@/views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true }
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: PostDetailView
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: CreatePostView,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-post/:id',
      name: 'edit-post',
      component: EditPostView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    }
  ]
});

// Navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
