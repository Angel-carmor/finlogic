<template>
  <div class="app-layout">
    <Sidebar />
    <main class="app-main">
      <Topbar />
      <div class="app-container">

        <!-- Page Header -->
        <div class="page-header">
          <div class="avatar-big">
            <span class="avatar-initials">{{ initials }}</span>
          </div>
          <div class="header-info">
            <h2 class="page-heading">{{ displayName }}</h2>
            <p class="page-sub">{{ user.email }}</p>
          </div>
        </div>

        <div class="profile-grid">

          <!-- Personal Info -->
          <div class="panel">
            <h3 class="panel-title">
              <span class="title-icon">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
                Información Personal
              </span>
            </h3>
            <div class="field-group">
              <label class="field-label">Nombre de usuario</label>
              <input class="field-input" type="text" v-model="form.name" placeholder="Tu nombre" />
            </div>
            <div class="field-group">
              <label class="field-label">Correo electrónico</label>
              <input class="field-input" type="email" :value="user.email" disabled />
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="savePersonal" :disabled="isSaving">
                {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
            <p v-if="success" class="success-msg">✓ Cambios guardados correctamente.</p>
          </div>

          <!-- Session -->
          <div class="panel">
            <h3 class="panel-title">
              <span class="title-icon">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M17 7l-1.4 1.4L17.2 10H9v2h8.2l-1.6 1.6L17 15l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"/></svg>
                Sesión y Acceso
              </span>
            </h3>
            <p class="session-hint">Cierra la sesión actual o cambia de cuenta en cualquier momento.</p>
            <div class="session-actions">
              <button class="btn-ghost" @click="switchAccount">Cambiar cuenta</button>
              <button class="btn-danger" @click="logout">Cerrar sesión</button>
            </div>

            <div class="section-divider" style="margin:1.5rem 0"></div>

            <h3 class="panel-title" style="margin-bottom:1rem">
              <span class="title-icon">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12 3l10 9h-3v8h-6v-6h-2v6H5v-8H2l10-9z"/></svg>
                Perfil Financiero
              </span>
            </h3>
            <p class="session-hint">Define tu situación real: ingresos, gastos fijos y deudas.</p>
            <div class="form-actions">
              <router-link to="/financial-profile" class="btn-primary" style="text-decoration:none;text-align:center">
                Ir a Sala de Máquinas →
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import Sidebar from '../components/layout/Sidebar.vue';
import Topbar from '../components/layout/Topbar.vue';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user || {});

const form = reactive({ name: user.value.name || '' });
const isSaving = ref(false);
const success = ref(false);

const initials = computed(() => {
  if (form.name) return form.name.slice(0, 2).toUpperCase();
  return (user.value.email || 'U').slice(0, 2).toUpperCase();
});
const displayName = computed(() => form.name || user.value.email || 'Usuario');

const savePersonal = async () => {
  isSaving.value = true;
  success.value = false;
  try {
    await authStore.updateProfile({ ...user.value, name: form.name });
    success.value = true;
    setTimeout(() => success.value = false, 3000);
  } finally { isSaving.value = false; }
};

const logout = () => { authStore.logout(); router.push('/login'); };
const switchAccount = () => { authStore.logout(); router.push('/login'); };
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
.avatar-big { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #1c2a40, #1A1A2E); border: 2px solid #0052FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 20px rgba(0,82,255,0.2); }
.avatar-initials { font-size: 1.6rem; font-weight: 800; color: #0052FF; }
.page-heading { margin: 0 0 0.3rem; font-size: 1.6rem; font-weight: 800; color: #E0E0E0; }
.page-sub { margin: 0; color: #9E9E9E; font-size: 0.9rem; }
.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
.title-icon { display: flex; align-items: center; gap: 0.5rem; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
.success-msg { margin: 0.5rem 0 0; text-align: right; font-size: 0.82rem; color: #00C805; }
.session-hint { color: #9E9E9E; font-size: 0.88rem; margin: 0 0 1.2rem; line-height: 1.5; }
.session-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
@media (max-width: 800px) { .profile-grid { grid-template-columns: 1fr; } }
</style>
