<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <div class="header">
        <h2>Bienvenido a FinLogic</h2>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressWidth }"></div>
        </div>
        <p class="step-indicator">Paso {{ step }} de 5</p>
      </div>

      <transition name="slide-fade" mode="out-in">
        <div v-if="step === 1" key="step1" class="step-content">
          <h3>¿Cuál es tu ingreso neto mensual estable?</h3>
          <p class="subtitle">Solo ingresos recurrentes y seguros tras impuestos.</p>
          <div class="input-group">
            <span class="currency">$</span>
            <input 
              type="number" 
              v-model.number="profile.net_monthly_income" 
              placeholder="0.00" 
              min="0"
              @keyup.enter="nextStep"
            />
          </div>
        </div>

        <div v-else-if="step === 2" key="step2" class="step-content">
          <h3>¿Cuánto pagas de Vivienda al mes?</h3>
          <p class="subtitle">Incluye el alquiler o la cuota de tu hipoteca.</p>
          <div class="input-group">
            <span class="currency">$</span>
            <input 
              type="number" 
              v-model.number="profile.housing" 
              placeholder="0.00" 
              min="0"
              @keyup.enter="nextStep"
            />
          </div>
        </div>

        <div v-else-if="step === 3" key="step3" class="step-content">
          <h3>¿Cuánto sumas en Suministros?</h3>
          <p class="subtitle">Agua, luz, internet, gas y facturas esenciales del hogar.</p>
          <div class="input-group">
            <span class="currency">$</span>
            <input 
              type="number" 
              v-model.number="profile.utilities" 
              placeholder="0.00" 
              min="0"
              @keyup.enter="nextStep"
            />
          </div>
        </div>

        <div v-else-if="step === 4" key="step4" class="step-content">
          <h3>Contexto Financiero</h3>
          <p class="subtitle">Ayúdanos a entender tu situación actual.</p>
          
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="profile.has_emergency_fund" />
            <span class="custom-checkbox"></span>
            <span class="label-text">¿Tienes ahorros para emergencias? (mín. 3 meses)</span>
          </label>

          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="profile.stable_job" />
            <span class="custom-checkbox"></span>
            <span class="label-text">¿Tu trabajo o fuente de ingresos es estable?</span>
          </label>
        </div>

        <div v-else-if="step === 5" key="step5" class="step-content step-models">
          <h3>Elige tu Arquitectura de Gasto</h3>
          <p class="subtitle">Basado en tus datos, te sugerimos un plan. Selecciona uno para continuar.</p>
          
          <div class="models-grid">
            <div 
              v-for="model in availableModels" 
              :key="model.id"
              class="model-card"
              :class="{ 
                'recommended': model.id === recommendedModel,
                'selected': profile.planning_model === model.id 
              }"
              @click="profile.planning_model = model.id"
            >
              <div v-if="model.id === recommendedModel" class="badge">Recomendado</div>
              <h4>{{ model.name }}</h4>
              <p class="model-desc">{{ model.desc }}</p>
              <div class="distribution">
                <span class="dist-item"><span class="dot expenses"></span>{{ model.dist.expenses }} Gastos</span>
                <span class="dist-item" v-if="model.dist.debt"><span class="dot debt"></span>{{ model.dist.debt }} Deuda</span>
                <span class="dist-item" v-if="model.dist.leisure"><span class="dot leisure"></span>{{ model.dist.leisure }} Ocio</span>
                <span class="dist-item"><span class="dot savings"></span>{{ model.dist.savings }} Ahorro</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="actions">
        <button v-if="step > 1" @click="prevStep" class="btn-ghost">Atrás</button>
        <div class="spacer"></div>
        <button v-if="step < 5" @click="nextStep" :disabled="!canProceed" class="btn-primary">
          Siguiente
        </button>
        <button v-if="step === 5" @click="submitProfile" :disabled="isLoading || !profile.planning_model" class="btn-primary">
          {{ isLoading ? 'Guardando...' : 'Comenzar' }}
        </button>
      </div>

      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const step = ref(1);
const isLoading = ref(false);
const errorMsg = ref('');
const authStore = useAuthStore();
const router = useRouter();

const profile = reactive({
  net_monthly_income: null,
  housing: null,
  utilities: null,
  total_debt: 0, // Default to 0, no longer asked in step 3
  has_emergency_fund: false,
  stable_job: false,
  planning_model: null
});

const recommendedModel = ref(null);

const availableModels = [
  { id: 'acelerador', name: 'Acelerador', desc: '(35/10/55) Máxima optimización para inversión y crecimiento.', dist: { expenses: '35%', leisure: '10%', savings: '55%' } },
  { id: 'equilibrio', name: 'Equilibrio', desc: '(50/30/20) Estructura 50/30/20 para estabilidad a largo plazo.', dist: { expenses: '50%', leisure: '30%', savings: '20%' } },
  { id: 'salvavidas', name: 'Salvavidas', desc: '(65/5/30) Enfoque en saneamiento y reducción de deuda.', dist: { expenses: '65%', leisure: '5%', savings: '30%' } },
  { id: 'contingencia', name: 'Contingencia', desc: '(85/0/15) Prioridad en cubrir necesidades y fondo de reserva.', dist: { expenses: '85%', leisure: '0%', savings: '15%' } }
];

const progressWidth = computed(() => {
  return `${(step.value / 5) * 100}%`;
});

const canProceed = computed(() => {
  if (step.value === 1) return profile.net_monthly_income !== null && profile.net_monthly_income >= 0;
  if (step.value === 2) return profile.housing !== null && profile.housing >= 0;
  if (step.value === 3) return profile.utilities !== null && profile.utilities >= 0;
  return true;
});

const calculateRecommendation = () => {
  const income = profile.net_monthly_income || 1;
  const loads = (profile.housing || 0) + (profile.utilities || 0);
  const ratio = loads / income;

  if (ratio > 0.5) {
    recommendedModel.value = 'contingencia';
  } else if (!profile.has_emergency_fund) {
    recommendedModel.value = 'salvavidas';
  } else if (ratio < 0.2 && profile.stable_job && profile.has_emergency_fund) {
    recommendedModel.value = 'acelerador';
  } else {
    recommendedModel.value = 'equilibrio';
  }
};

const nextStep = () => {
  if (canProceed.value && step.value < 5) {
    if (step.value === 4) {
      calculateRecommendation();
    }
    step.value++;
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};

const submitProfile = async () => {
  try {
    isLoading.value = true;
    errorMsg.value = '';
    await authStore.updateProfile(profile);
    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = error;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.onboarding-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #f1f5f9;
}

.onboarding-card {
  width: 100%;
  max-width: 500px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h2 {
  font-size: 1.8rem;
  margin: 0 0 1rem;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.progress-bar {
  height: 6px;
  background: #3a3a5c;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-indicator {
  font-size: 0.85rem;
  color: #9E9E9E;
  margin: 0;
}

.step-content {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.step-content h3 {
  font-size: 1.4rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: #E0E0E0;
}

.subtitle {
  color: #9E9E9E;
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 1.2rem;
  font-size: 1.2rem;
  color: #E0E0E0;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 1rem 1rem 1rem 2.8rem;
  background: #1A1A2E;
  border: 2px solid #3a3a5c;
  border-radius: 12px;
  color: white;
  font-size: 1.2rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-group input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  margin-bottom: 1.2rem;
  padding: 1rem;
  background: #1A1A2E;
  border: 1px solid #3a3a5c;
  border-radius: 12px;
  transition: border-color 0.2s, background-color 0.2s;
}

.checkbox-wrapper:hover {
  border-color: #9E9E9E;
}

.checkbox-wrapper input {
  display: none;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #9E9E9E;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-wrapper input:checked + .custom-checkbox {
  background: #6366f1;
  border-color: #6366f1;
}

.checkbox-wrapper input:checked + .custom-checkbox::after {
  content: '✓';
  color: white;
  font-weight: bold;
}

.label-text {
  font-size: 1rem;
  color: #E0E0E0;
  line-height: 1.4;
}

.actions {
  display: flex;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.spacer {
  flex: 1;
}

button {
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
}

.btn-primary:disabled {
  background: #9E9E9E;
  box-shadow: none;
  color: #9E9E9E;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  border: 1px solid #9E9E9E;
  color: #E0E0E0;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.error-msg {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(239, 68, 68, 0.1);
  color: #FF6B6B;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  text-align: center;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

/* Models Grid UI */
.step-models {
  min-height: 280px;
}

.models-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.model-card {
  position: relative;
  background: #1A1A2E;
  border: 2px solid #3a3a5c;
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.model-card:hover {
  border-color: #9E9E9E;
  transform: translateY(-2px);
}

.model-card.selected {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.model-card.recommended {
  border-color: #10b981;
}

.model-card.recommended.selected {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

.badge {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #10b981;
  color: white;
  font-size: 0.70rem;
  font-weight: bold;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.model-card h4 {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
  color: #E0E0E0;
}

.model-desc {
  font-size: 0.8rem;
  color: #9E9E9E;
  margin: 0 0 1rem;
  line-height: 1.3;
}

.distribution {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #E0E0E0;
}

.dist-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.expenses { background-color: #FF3B30; }
.dot.debt { background-color: #f59e0b; }
.dot.leisure { background-color: #3b82f6; }
.dot.savings { background-color: #10b981; }

@media (max-width: 600px) {
  .models-grid {
    grid-template-columns: 1fr;
  }
}

/* Remove arrows from number input */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
