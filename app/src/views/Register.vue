<template>
  <div class="auth-container panel">
    <h2 class="auth-title">Registro en FinLogic</h2>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="field-group">
        <label class="field-label">Email</label>
        <input class="field-input" type="email" v-model="email" required placeholder="tu@email.com" />
      </div>
      <div class="field-group">
        <label class="field-label">Contraseña</label>
        <input class="field-input" type="password" v-model="password" required placeholder="••••••••" />
      </div>
      <div class="field-group">
        <label class="field-label">Repetir Contraseña</label>
        <input class="field-input" type="password" v-model="confirmPassword" required placeholder="••••••••" />
      </div>
      
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <button class="btn-primary" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Creando cuenta...' : 'Registrarse' }}
      </button>
      
      <p class="switch-auth">
        ¿Ya tienes cuenta? <router-link class="neon" to="/login">Entra aquí</router-link>
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
const confirmPassword = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden.';
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  if (!passwordRegex.test(password.value)) {
    errorMsg.value = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    return;
  }

  try {
    isLoading.value = true;
    errorMsg.value = '';
    await authStore.register(email.value, password.value);
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
.auth-title {
  color: #E0E0E0;
  margin-top: 0;
  margin-bottom: 1.5rem;
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
