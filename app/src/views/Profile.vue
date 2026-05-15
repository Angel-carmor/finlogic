<template>
  <div class="app-layout">
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
                {{ $t('profile.personal_info') }}
              </span>
            </h3>
            <div class="field-group">
              <label class="field-label">{{ $t('profile.username') }}</label>
              <input class="field-input" type="text" v-model="form.name" placeholder="Tu nombre" />
            </div>
            <div class="field-group">
              <label class="field-label">{{ $t('profile.email') }}</label>
              <input class="field-input" type="email" :value="user.email" disabled />
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="savePersonal" :disabled="isSaving">
                {{ isSaving ? $t('profile.saving') : $t('profile.save_changes') }}
              </button>
            </div>
            <p v-if="success" class="success-msg">{{ $t('profile.success_save') }}</p>
          </div>

          <!-- Session -->
          <div class="panel">
            <h3 class="panel-title">
              <span class="title-icon">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M17 7l-1.4 1.4L17.2 10H9v2h8.2l-1.6 1.6L17 15l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"/></svg>
                {{ $t('profile.session_access') }}
              </span>
            </h3>
            <p class="session-hint">{{ $t('profile.session_hint') }}</p>
            <div class="session-actions">
              <button class="btn-ghost" @click="switchAccount">{{ $t('profile.switch_account') }}</button>
              <button class="btn-danger" @click="logout">{{ $t('profile.logout') }}</button>
            </div>

            <div class="section-divider" style="margin:1.5rem 0"></div>

            <h3 class="panel-title" style="margin-bottom:1rem">
              <span class="title-icon">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12 3l10 9h-3v8h-6v-6h-2v6H5v-8H2l10-9z"/></svg>
                {{ $t('profile.financial_profile_title') }}
              </span>
            </h3>
            <p class="session-hint">{{ $t('profile.financial_profile_hint') }}</p>
            <div class="form-actions">
              <router-link to="/financial-profile" class="btn-primary" style="text-decoration:none;text-align:center">
                {{ $t('profile.go_to_engine') }}
              </router-link>
            </div>
          </div>

          <!-- Language Preferences -->
          <div class="panel">
            <h3 class="panel-title">
              <span class="title-icon">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.69 10.56 9.12 9.5 10.45 8.94 9.77 8.47 9.06 8.08 8.32H6.08c.47 1.09 1.12 2.12 1.92 3.07L3.1 16.27l1.41 1.41 4.99-5 2.54 2.51.83-.83zm5.63-2.62h-2.2l-3.2 9h2.1l.8-2.3h3.2l.8 2.3h2.1l-3.6-9zm-1.8 5l1-2.8 1 2.8h-2z"/></svg>
                {{ $t('profile.language_preferences') }}
              </span>
            </h3>
            <p class="session-hint">{{ $t('profile.language_hint') }}</p>
            <div class="field-group">
              <label class="field-label">{{ $t('profile.select_language') }}</label>
              <LanguageSelector v-model="currentLocale" @change="changeLanguage" />
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
import { useI18n } from 'vue-i18n';
import Topbar from '../components/layout/Topbar.vue';
import LanguageSelector from '../components/common/LanguageSelector.vue';

const { locale } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user || {});

const form = reactive({ name: user.value.name || '' });
const isSaving = ref(false);
const success = ref(false);
const currentLocale = ref(locale.value);

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

const changeLanguage = () => {
  locale.value = currentLocale.value;
  localStorage.setItem('finlogic_locale', currentLocale.value);
};

const logout = () => { authStore.logout(); router.push('/login'); };
const switchAccount = () => { authStore.logout(); router.push('/login'); };
</script>

<style scoped>
.app-layout { min-height: 100vh; font-family: 'Inter', sans-serif; color: var(--text-main); }
.app-main { padding-top: 140px; padding-bottom: 4rem; width: 100%; }
.app-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; flex-direction: column; gap: 2.5rem; }

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
.language-select {
  cursor: pointer;
  background-color: rgba(0,0,0,0.2);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0.8rem;
  border-radius: 6px;
  width: 100%;
  font-family: 'Inter', sans-serif;
  outline: none;
}
.language-select option {
  background: var(--bg-panel);
  color: var(--text-main);
}
@media (max-width: 800px) { .profile-grid { grid-template-columns: 1fr; } }
</style>
