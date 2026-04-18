<template>
  <aside class="sidebar">
    <div class="brand">
      <h2>FinLogic</h2>
    </div>
    
    <nav class="nav-menu">
      <router-link to="/dashboard" class="nav-item active">Resumen</router-link>
      <router-link to="#" class="nav-item">Transacciones</router-link>
      <router-link to="#" class="nav-item">Presupuestos</router-link>
    </nav>

    <div class="sidebar-bottom">
      <p class="email">{{ userEmail }}</p>
      <button @click="handleLogout" class="logout-btn">Salir</button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const userEmail = computed(() => authStore.user?.email || 'Usuario');

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #1e293b;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-right: 1px solid #334155;
}
.brand h2 { margin-top: 0; color: #6366f1; }
.nav-menu { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; margin-top: 2rem; }
.nav-item { color: #94a3b8; text-decoration: none; padding: 0.5rem; border-radius: 6px; }
.nav-item:hover, .nav-item.active { background: #334155; color: white; }
.sidebar-bottom { margin-top: auto; border-top: 1px solid #334155; padding-top: 1rem; text-align: center; }
.email { font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; word-break: break-all; }
.logout-btn { width: 100%; padding: 0.5rem; background: transparent; border: 1px solid #ef4444; color: #ef4444; border-radius: 6px; cursor: pointer; }
.logout-btn:hover { background: rgba(239, 68, 68, 0.1); }
</style>
