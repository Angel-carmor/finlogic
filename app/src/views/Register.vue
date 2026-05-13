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
        <div class="password-wrapper">
          <input class="field-input" :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="••••••••" />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword" title="Mostrar/Ocultar contraseña">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Repetir Contraseña</label>
        <div class="password-wrapper">
          <input class="field-input" :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required placeholder="••••••••" />
          <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword" title="Mostrar/Ocultar contraseña">
            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
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
const showPassword = ref(false);
const showConfirmPassword = ref(false);
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
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.password-wrapper .field-input {
  width: 100%;
  padding-right: 2.5rem;
}
.toggle-password {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toggle-password:hover {
  opacity: 0.8;
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
