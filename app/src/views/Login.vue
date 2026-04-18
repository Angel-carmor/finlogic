<template>
  <div class="auth-container">
    <h2>Login a FinLogic</h2>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required placeholder="tu@email.com" />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" v-model="password" required placeholder="••••••••" />
      </div>
      
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Entrar' }}
      </button>
      
      <p class="switch-auth">
        ¿No tienes cuenta? <router-link to="/register">Regístrate</router-link>
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
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.5rem;
}
input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
}
input:focus {
  border-color: #646cff;
}
button {
  padding: 0.75rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}
button:disabled {
  background-color: #a5a9ff;
}
.error-msg {
  color: #d32f2f;
  background-color: #fde0e0;
  padding: 0.5rem;
  border-radius: 4px;
}
.switch-auth {
  margin-top: 1.5rem;
  font-size: 0.9em;
  color: #666;
}
</style>
