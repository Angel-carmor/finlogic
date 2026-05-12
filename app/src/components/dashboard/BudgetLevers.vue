<template>
  <div class="levers-container">
    <!-- STRATEGY TOGGLE -->
    <div class="strategy-toggle">
      <button 
        v-for="model in styleModels" 
        :key="model.id"
        :class="['toggle-btn', { active: financeStore.currentModelId === model.id }]"
        @click="financeStore.setModel(model.id)">
        {{ model.name }}
      </button>
    </div>

    <div class="panel levers-panel">
      <div class="panel-header">
        <h3 class="with-icon">
          <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
          Control de Gastos
        </h3>
      </div>
      
      <div class="levers-list">
        <div class="slider-group" v-for="item in financeStore.budgetItems" :key="item.id">
          <div class="slider-info">
            <div class="label-wrapper">
              <span v-if="item.locked" class="locked-icon">🔒</span>
              <input v-if="item.isCustom" type="text" v-model="item.name" class="custom-name-input" placeholder="Nombre..." />
              <span v-else class="cat-name">{{ item.name }}</span>
              <button v-if="item.isCustom" class="delete-btn" @click="financeStore.removeSlider(item.id)">×</button>
            </div>
            <div class="values amount-input-wrapper">
              <input 
                type="number"
                class="amount-input"
                :class="{ 'neon-text': !item.locked }"
                :value="item.amount"
                @input="financeStore.handleSliderInput(item, parseInt($event.target.value) || 0)"
                :disabled="item.locked"
                min="0"
              />
              <span class="currency-symbol" :class="{ 'neon-text': !item.locked }">€</span>
            </div>
          </div>
          <!-- Binding amount -->
          <input 
            type="range" 
            min="0" 
            :max="financeStore.netIncome" 
            :value="item.amount"
            @input="financeStore.handleSliderInput(item, parseInt($event.target.value) || 0)"
            :disabled="item.locked"
            class="cyber-slider"
            :class="{ 'locked-slider': item.locked }"
          />
        </div>
        
        <button class="add-slider-btn" @click="financeStore.addNewSlider()">
          <svg width="16" height="16" viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Añadir Palanca
        </button>

        <div class="action-buttons">
          <button class="btn-primary" @click="saveUpdates">Guardar Actualizaciones</button>
          <button class="btn-secondary" @click="resetToDefault">Reiniciar Parámetros</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../../store/finance';

const financeStore = useFinanceStore();

const styleModels = [
  { id: 'personalizado', name: 'Personalizado' },
  { id: 'salvavidas', name: 'Salvavidas' },
  { id: 'rescate', name: 'Rescate' },
  { id: 'equilibrio', name: 'Equilibrio' },
  { id: 'acelerador', name: 'Acelerador' }
];

const saveUpdates = () => {
  financeStore.saveToLocal();
  alert('Actualizaciones guardadas correctamente.');
};

const resetToDefault = () => {
  financeStore.resetToDefault();
  alert('Parámetros restablecidos al modelo inicial.');
};
</script>

<style scoped>
.levers-container { display: flex; flex-direction: column; gap: 2rem; }
.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.with-icon { display: flex; align-items: center; gap: 0.5rem; margin: 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.with-icon .icon { width: 16px; height: 16px; color: var(--color-primary); }

.strategy-toggle { display: flex; justify-content: center; gap: 0; background: var(--bg-base); border-radius: 20px; padding: 4px; width: fit-content; margin: 0 auto; border: 1px solid var(--border-color); }
.toggle-btn { background: transparent; border: none; color: var(--text-muted); padding: 0.6rem 2rem; border-radius: 16px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 600; font-size: 0.85rem; transition: all 0.3s; }
.toggle-btn.active { background: var(--color-primary); color: #FFFFFF; border: 1px solid var(--color-primary); }

.levers-list { display: flex; flex-direction: column; gap: 1.2rem; }
.slider-group { display: flex; flex-direction: column; }
.slider-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.85rem; }
.label-wrapper { display: flex; align-items: center; gap: 0.5rem; }
.cat-name { color: var(--text-main); font-weight: 600; }
.locked-icon { filter: grayscale(100%); opacity: 0.5; font-size: 14px; }
.amount-input-wrapper { display: flex; align-items: center; gap: 4px; }
.amount-input { background: var(--border-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 8px; outline: none; color: var(--text-muted); font-weight: 700; font-family: monospace; font-size: 1.15rem; width: 85px; text-align: right; transition: all 0.3s; }
.amount-input.neon-text { color: var(--color-success); border-color: rgba(0,200,5,0.3); }
.amount-input:focus { border-color: var(--color-success); box-shadow: 0 0 5px rgba(0,200,5,0.2); }
.amount-input:disabled { background: transparent; border-color: transparent; padding-right: 0; color: var(--text-main); }
.amount-input::-webkit-inner-spin-button, .amount-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.amount-input[type=number] { -moz-appearance: textfield; appearance: textfield; }
.currency-symbol { color: var(--text-muted); font-weight: 700; font-family: monospace; font-size: 1.15rem; }
.neon-text { color: var(--color-success); text-shadow: 0 0 5px rgba(0,200,5,0.3); }

.cyber-slider { -webkit-appearance: none; width: 100%; height: 6px; background: var(--bg-base); border-radius: 3px; outline: none; }
.cyber-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--color-success); cursor: pointer; box-shadow: 0 0 8px var(--color-success); }
.locked-slider::-webkit-slider-thumb { background: var(--border-color); box-shadow: none; cursor: not-allowed; }
.locked-slider { background: var(--bg-base); }

.custom-name-input { background: transparent; border: none; border-bottom: 1px dashed var(--border-color); color: var(--text-main); outline: none; font-family: 'Inter', monospace; width: 120px; }
.custom-name-input:focus { border-color: var(--color-success); }
.delete-btn { background: rgba(255, 107, 107, 0.1); color: var(--color-danger); border: none; border-radius: 4px; padding: 0 0.4rem; cursor: pointer; font-weight: bold; }
.delete-btn:hover { background: var(--color-danger); color: white; }

.add-slider-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: transparent; border: 1px dashed var(--border-color); color: var(--text-muted); padding: 0.8rem; border-radius: 8px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 600; transition: all 0.3s; margin-top: 0.5rem; }
.add-slider-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: rgba(59, 130, 246, 0.05); }

.action-buttons { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem; border-top: 1px dashed var(--border-color); padding-top: 1.5rem; }
.btn-primary { background: var(--color-primary); color: #FFFFFF; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 700; transition: all 0.3s; }
.btn-primary:hover { box-shadow: 0 0 15px rgba(59,130,246,0.4); transform: translateY(-1px); background: #2563eb; }
.btn-secondary { background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); padding: 0.8rem; border-radius: 8px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 600; transition: all 0.3s; }
.btn-secondary:hover { border-color: var(--text-main); color: var(--text-main); background: var(--border-color); }
</style>
