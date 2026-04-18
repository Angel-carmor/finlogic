<template>
  <div class="auth-container">
    <h2>Registro en FinLogic</h2>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required placeholder="tu@email.com" />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" v-model="password" required placeholder="••••••••" />
      </div>
      <div class="form-group">
        <label>Repetir Contraseña</label>
        <input type="password" v-model="confirmPassword" required placeholder="••••••••" />
      </div>
      
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Creando cuenta...' : 'Registrarse' }}
      </button>
      
      <p class="switch-auth">
        ¿Ya tienes cuenta? <router-link to="/login">Entra aquí</router-link>
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
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}
button:disabled {
  background-color: #8eeacb;
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
