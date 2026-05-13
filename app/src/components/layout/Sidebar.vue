<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="brand">
      <div v-if="!isCollapsed" class="logo-container">
        <img src="/logo.png" alt="Finlogic Logo" class="brand-logo" />
      </div>
      <button class="toggle-btn" @click="toggleSidebar" :title="isCollapsed ? 'Expandir menú' : 'Contraer menú'">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      </button>
    </div>
    
    <nav class="nav-menu">
      <router-link to="/dashboard" class="nav-item">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        <span v-if="!isCollapsed" class="nav-text">{{ $t('sidebar.dashboard') }}</span>
      </router-link>
      <router-link to="/analytics" class="nav-item">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        <span v-if="!isCollapsed" class="nav-text">{{ $t('sidebar.analytics') }}</span>
      </router-link>
      <router-link to="/investments" class="nav-item">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M3.5 18.5l6-6 4 4L22 6.92 20.59 5.5l-7.09 7.09-4-4L2 16.08z"/></svg>
        <span v-if="!isCollapsed" class="nav-text">{{ $t('sidebar.investments') }}</span>
      </router-link>
      <router-link to="/financial-profile" class="nav-item">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
        <span v-if="!isCollapsed" class="nav-text">{{ $t('sidebar.financial_profile') }}</span>
      </router-link>
    </nav>

    <div class="sidebar-bottom">
      <router-link to="/profile" class="nav-item profile-item">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span v-if="!isCollapsed" class="nav-text">{{ $t('sidebar.profile') }}</span>
      </router-link>
      <button @click="handleLogout" class="mission-btn" :title="isCollapsed ? $t('sidebar.logout') : ''">
        <svg v-if="isCollapsed" viewBox="0 0 24 24" class="icon logout-icon"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
        <span v-else>{{ $t('sidebar.logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #1A1A2E;
  color: #9E9E9E;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  border-right: 1px solid #3a3a5c;
  font-family: 'Inter', monospace;
  transition: width 0.3s ease;
}
.sidebar.collapsed {
  width: 80px;
}

.brand {
  padding: 1rem 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto; /* Permite que el contenedor se adapte al tamaño real de la imagen */
}
.sidebar.collapsed .brand {
  padding: 0;
  justify-content: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.brand-logo { 
  width: 100%;
  max-width: 270px;
  max-height: 85px;
  height: auto;
  object-fit: contain;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #9E9E9E;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
}
.toggle-btn:hover {
  background: #3a3a5c;
  color: #0052FF;
}
.toggle-btn .icon {
  width: 24px;
  height: 24px;
}

.nav-menu { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  gap: 0.2rem; 
}

.nav-item { 
  color: #9E9E9E; 
  text-decoration: none; 
  padding: 1rem 2rem; 
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid transparent;
  transition: all 0.3s;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  padding: 1rem 0;
  justify-content: center;
}

.nav-item .icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-item:hover, .router-link-active { 
  background: rgba(0, 82, 255, 0.1); 
  color: #FFFFFF; 
  border-left-color: #0052FF;
}

.sidebar-bottom { 
  margin-top: auto; 
  padding: 0 2rem; 
  display: flex;
  flex-direction: column;
}
.sidebar.collapsed .sidebar-bottom {
  padding: 0 1rem;
}
.profile-item {
  padding: 1rem 0;
  border-left: none;
  margin-bottom: 0.8rem;
  border-radius: 8px;
}
.sidebar.collapsed .profile-item {
  padding: 1rem 0;
  justify-content: center;
}


.mission-btn { 
  width: 100%; 
  padding: 0.8rem; 
  background: #0052FF; 
  color: #FFFFFF; 
  border: none; 
  border-radius: 20px; 
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer; 
  transition: all 0.3s;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.mission-btn:hover { 
  background: #0043D1; 
  box-shadow: 0 0 10px rgba(0,82,255,0.3);
}

.sidebar.collapsed .mission-btn {
  padding: 0.8rem 0;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin: 0 auto;
}
.logout-icon {
  width: 20px;
  height: 20px;
}
</style>
