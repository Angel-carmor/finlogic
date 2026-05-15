<template>
  <header class="topbar">
    <div class="topbar-content">
      <!-- LEFT: Logo -->
      <div class="topbar-left">
        <router-link to="/dashboard" class="brand">
          <img src="/logo.png" alt="Logo" class="brand-logo" />
        </router-link>
      </div>

      <!-- CENTER: Main Navigation -->
      <div class="topbar-center">
        <nav class="main-nav">
          <router-link to="/dashboard" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            <span>{{ $t('sidebar.dashboard') }}</span>
          </router-link>
          <router-link to="/analytics" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
            <span>{{ $t('sidebar.analytics') }}</span>
          </router-link>
          <router-link to="/tracking" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>{{ $t('tracking.title') }}</span>
          </router-link>
          <router-link to="/investments" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
            <span>{{ $t('sidebar.investments') }}</span>
          </router-link>
          <router-link to="/financial-profile" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
            <span>{{ $t('sidebar.financial_profile') }}</span>
          </router-link>
        </nav>
      </div>

      <!-- RIGHT: Utils & Profile -->
      <div class="topbar-right">
        <!-- Language Selector -->
        <div class="util-item" ref="langContainer">
          <button class="util-btn" @click="isLangOpen = !isLangOpen">
            <span class="flag-icon">{{ currentLang.flag }}</span>
          </button>
          <Transition name="pop">
            <div v-if="isLangOpen" class="util-popover lang-popover">
              <button v-for="lang in languages" :key="lang.code" class="pop-item" :class="{ 'active': locale === lang.code }" @click="changeLocale(lang.code)">
                <span class="flag">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Restart Tour -->
        <div class="util-item">
          <button class="util-btn" @click="restartTour" :title="$t('topbar.restart_tour_tooltip')">
            <svg class="util-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
          </button>
        </div>

        <!-- Support -->
        <div class="util-item" ref="supportContainer">
          <button class="util-btn" @click="showSupport = !showSupport">
            <svg class="util-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
          </button>
          <Transition name="pop">
            <div v-if="showSupport" class="util-popover support-popover">
              <div class="pop-header">SOPORTE</div>
              <p class="pop-text">¿Necesitas ayuda? Escríbenos:</p>
              <div class="email-box" @click="copyEmail">
                <code>angel.cardenas.moraa@gmail.com</code>
                <span v-if="copied" class="copied-badge">¡Copiado!</span>
              </div>
            </div>
          </Transition>
        </div>

        <div class="nav-divider"></div>

        <!-- User Profile -->
        <div class="profile-item" ref="profileContainer">
          <button class="profile-btn" @click="isProfileOpen = !isProfileOpen">
            <div class="avatar">{{ userInitial }}</div>
            <span class="user-name">{{ userName }}</span>
            <svg class="chevron" :class="{ 'rotate': isProfileOpen }" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
          </button>
          <Transition name="pop">
            <div v-if="isProfileOpen" class="util-popover profile-popover">
              <button class="pop-item" @click="goToProfile">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                Mi Perfil
              </button>
              <div class="pop-divider"></div>
              <button class="pop-item logout" @click="handleLogout">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                Cerrar Sesión
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const router = useRouter();
const { locale } = useI18n();

const isProfileOpen = ref(false);
const isLangOpen = ref(false);
const showSupport = ref(false);
const copied = ref(false);

const langContainer = ref(null);
const supportContainer = ref(null);
const profileContainer = ref(null);

const userName = computed(() => authStore.user?.name || 'Angel');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const currentLang = computed(() => languages.find(l => l.code === locale.value) || languages[0]);

const changeLocale = (code) => {
  locale.value = code;
  localStorage.setItem('finlogic_locale', code);
  isLangOpen.value = false;
};

const copyEmail = () => {
  navigator.clipboard.writeText('angel.cardenas.moraa@gmail.com');
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const restartTour = () => {
  // Limpiar todas las llaves independientes
  const tourKeys = [
    'tour_seen_dashboard',
    'tour_seen_analytics',
    'tour_seen_investments',
    'tour_seen_profile',
    'tour_seen_tracking'
  ];
  tourKeys.forEach(key => localStorage.removeItem(key));
  
  localStorage.removeItem('finlogic_tour_active');
  localStorage.removeItem('finlogic_tour_phase');
  
  // Redirigir al dashboard para empezar de cero
  router.push('/dashboard').then(() => {
    location.reload();
  });
};

const goToProfile = () => {
  isProfileOpen.value = false;
  router.push('/profile');
};

const handleClickOutside = (e) => {
  if (langContainer.value && !langContainer.value.contains(e.target)) isLangOpen.value = false;
  if (supportContainer.value && !supportContainer.value.contains(e.target)) showSupport.value = false;
  if (profileContainer.value && !profileContainer.value.contains(e.target)) isProfileOpen.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 95px;
  background: rgba(10, 10, 18, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.topbar-content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 2;
}

.topbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 1;
}

.brand-logo { height: 75px; width: auto; transition: transform 0.2s; }
.brand-logo:hover { transform: scale(1.05); }

.main-nav { display: flex; gap: 0.2rem; }

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9E9E9E;
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.nav-link:hover { color: #fff; background: rgba(255,255,255,0.05); }
.nav-link.router-link-active { color: var(--color-primary); background: rgba(59, 130, 246, 0.1); }

.nav-icon { width: 16px; height: 16px; }

.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0;
  flex-shrink: 0;
}

.util-item { position: relative; }
.util-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #9E9E9E;
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.util-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: var(--color-primary); transform: translateY(-2px); }

.util-icon { width: 20px; height: 20px; }
.flag-icon { font-size: 1.2rem; }

.profile-item { position: relative; }
.profile-btn {
  background: transparent; border: none;
  display: flex; align-items: center; gap: 0.8rem;
  cursor: pointer; padding: 0.5rem 1rem; border-radius: 14px;
  transition: background 0.2s;
}
.profile-btn:hover { background: rgba(255,255,255,0.05); }

.avatar {
  width: 36px; height: 36px;
  background: var(--color-primary);
  color: #fff; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.user-name { color: #fff; font-size: 0.9rem; font-weight: 700; }
.chevron { width: 18px; height: 18px; color: #666; transition: transform 0.2s; }
.chevron.rotate { transform: rotate(180deg); }

.util-popover {
  position: absolute;
  top: calc(100% + 15px);
  right: -5px;
  background: #0D0D16;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 0.8rem;
  min-width: 220px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.7);
  z-index: 1001;
}

.pop-item {
  width: 100%; padding: 0.8rem 1.2rem;
  display: flex; align-items: center; gap: 1rem;
  background: transparent; border: none;
  color: #9E9E9E; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; border-radius: 12px; transition: all 0.2s;
}
.pop-item:hover { background: rgba(255,255,255,0.06); color: #fff; transform: translateX(5px); }
.pop-item.active { color: var(--color-primary); background: rgba(59, 130, 246, 0.1); }
.pop-item svg { width: 20px; height: 20px; }

.pop-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 0.5rem 0; }
.logout { color: #ff4d4f !important; }
.logout:hover { background: rgba(255, 77, 79, 0.1) !important; }

.support-popover { width: 320px; padding: 1.5rem; }
.pop-header { font-size: 0.75rem; font-weight: 900; color: #555; letter-spacing: 1.5px; margin-bottom: 1rem; }
.pop-text { font-size: 0.85rem; color: #9E9E9E; line-height: 1.5; margin-bottom: 1.2rem; }
.email-box {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08);
  padding: 1rem; border-radius: 12px; cursor: pointer; position: relative;
  transition: all 0.2s;
}
.email-box:hover { border-color: var(--color-primary); background: rgba(59, 130, 246, 0.05); }
.email-box code { font-size: 0.8rem; color: var(--color-primary); font-family: 'JetBrains Mono', monospace; }

.copied-badge {
  position: absolute; top: -12px; right: 0;
  background: var(--color-success); color: #fff;
  font-size: 0.65rem; font-weight: 800; padding: 0.3rem 0.7rem; border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 200, 5, 0.3);
}

/* Animations */
.pop-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.pop-leave-active { transition: all 0.2s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-15px) scale(0.95); }

@media (max-width: 1200px) {
  .nav-link span { display: none; }
  .topbar-center { position: relative; transform: none; left: 0; }
}
</style>
