<template>
  <div class="auth-container panel">
    <div class="logo-container">
      <img src="/logo.png" alt="FinLogic Logo" class="auth-logo" />
    </div>
    <h2 class="auth-title">Inicia Sesión</h2>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="field-group">
        <label class="field-label">Email</label>
        <input class="field-input" type="email" v-model="email" required placeholder="tu@email.com" />
      </div>
      <div class="field-group">
        <label class="field-label">Contraseña</label>
        <input class="field-input" type="password" v-model="password" required placeholder="••••••••" />
      </div>
      
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <button class="btn-primary" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Entrar' }}
      </button>
      
      <p class="switch-auth">
        ¿No tienes cuenta? <router-link class="neon" to="/register">Regístrate</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMsg.value = '';
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = error;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 100px auto;
  text-align: center;
}
.logo-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}
.auth-logo {
  max-width: 280px;
  height: auto;
}
.auth-title {
  color: #E0E0E0;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.error-msg {
  color: #FF3B30;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
}
.switch-auth {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #9E9E9E;
}
.switch-auth a {
  text-decoration: none;
  font-weight: 600;
}
.switch-auth a:hover {
  text-decoration: underline;
}
</style>
