<template>
  <header class="topbar">
    <div class="topbar-left">

      
      <nav class="top-nav">
        <a href="#" class="nav-item active">Telemetría</a>
      </nav>
    </div>
    
    <div class="topbar-right">
      <button class="icon-btn">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
      </button>
      <button class="icon-btn energy">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.39 11.05 10.64 7.11 14 1h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>
      </button>
      
      <div class="profile-container">
        <button class="profile-pic" @click="toggleProfileMenu"></button>
        
        <div v-if="isProfileMenuOpen" class="profile-menu">
          <button class="menu-item" @click="goToProfile">Perfil</button>
          <div class="divider"></div>
          <button class="menu-item logout" @click="handleLogout">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isProfileMenuOpen = ref(false);

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const goToProfile = () => {
  isProfileMenuOpen.value = false;
  router.push('/profile');
};

// Close menu when clicking outside
const closeMenu = (e) => {
  if (!e.target.closest('.profile-container')) {
    isProfileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: #E0E0E0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #3a3a5c;
  position: relative;
  z-index: 100;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.topbar h1 { 
  margin: 0; 
  font-size: 1.2rem; 
  color: #0052FF;
  font-weight: 800;
  letter-spacing: 2px;
}

.top-nav {
  display: flex;
  gap: 2rem;
}

.top-nav .nav-item {
  color: #9E9E9E;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.top-nav .nav-item:hover, .top-nav .nav-item.active {
  color: #0052FF;
  border-bottom-color: #0052FF;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #9E9E9E;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn .icon {
  width: 20px;
  height: 20px;
}

.icon-btn.energy {
  color: #0052FF;
  filter: drop-shadow(0 0 5px rgba(0,82,255,0.5));
}

.profile-container {
  position: relative;
}

.profile-pic {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a3a5c, #3a3a5c);
  border: 2px solid #3a3a5c;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.3s;
}

.profile-pic:hover {
  border-color: #0052FF;
}

.profile-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #252540;
  border: 1px solid #3a3a5c;
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 150px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.menu-item {
  background: transparent;
  border: none;
  color: #E0E0E0;
  padding: 0.8rem 1.5rem;
  text-align: left;
  cursor: pointer;
  font-family: 'Inter', monospace;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.menu-item:hover {
  background: rgba(0, 82, 255, 0.1);
  color: #FFFFFF;
}

.menu-item.logout {
  color: #FF3B30;
}

.menu-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #FF6B6B;
}

.divider {
  height: 1px;
  background: #3a3a5c;
  margin: 0.2rem 0;
}
</style>
