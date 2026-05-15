import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/analytics', component: () => import('../views/Analytics.vue'), meta: { requiresAuth: true } },
  { path: '/tracking', component: () => import('../views/MonthlyTracking.vue'), meta: { requiresAuth: true } },
  { path: '/investments', component: () => import('../views/Investments.vue'), meta: { requiresAuth: true } },
  { path: '/onboarding', component: () => import('../views/Onboarding.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true } },
  { path: '/financial-profile', component: () => import('../views/FinancialProfile.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const user = authStore.user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && isAuthenticated) {
    next('/dashboard');
  } else if (isAuthenticated && to.path !== '/onboarding' && user && !user.onboarding_completed) {
    next('/onboarding');
  } else if (isAuthenticated && to.path === '/onboarding' && user && user.onboarding_completed) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
