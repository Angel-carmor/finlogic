<template>
  <div class="levers-container">
    <!-- STRATEGY TOGGLE -->
    <div class="strategy-toggle">
      <button 
        v-for="model in styleModels" 
        :key="model.id"
        :class="['toggle-btn', { active: financeStore.currentModelId === model.id }]"
        @click="financeStore.setModel(model.id)">
        {{ $t('models.' + model.key) }}
      </button>
    </div>

    <!-- MODEL TRACKER -->
    <div v-if="financeStore.currentModelId !== 'personalizado' && financeStore.modelDeviations" class="tracker-panel panel">
      <h4>🎯 {{ $t('budget.tracker_title') }} <span class="text-primary">{{ getModelName(financeStore.currentModelId) }}</span></h4>
      <p class="model-desc">{{ getModelDesc(financeStore.currentModelId) }}</p>
      <div class="tracker-grid">
        <div class="tracker-card">
          <span class="t-label">{{ $t('budget.tracker_needs') }}</span>
          <div class="t-values">
            <span class="t-actual" :class="{ 't-over': financeStore.modelDeviations.needs.diff > 0 }">€{{ financeStore.modelDeviations.needs.actual }}</span>
            <span class="t-target">/ €{{ financeStore.modelDeviations.needs.target }}</span>
          </div>
          <div class="t-diff" :class="financeStore.modelDeviations.needs.diff > 0 ? 'text-danger' : 'text-success'">
            {{ financeStore.modelDeviations.needs.diff > 0 ? '+' : '' }}{{ financeStore.modelDeviations.needs.diff }}€
          </div>
        </div>
        
        <div class="tracker-card">
          <span class="t-label">{{ $t('budget.tracker_desires') }}</span>
          <div class="t-values">
            <span class="t-actual" :class="{ 't-over': financeStore.modelDeviations.desires.diff > 0 }">€{{ financeStore.modelDeviations.desires.actual }}</span>
            <span class="t-target">/ €{{ financeStore.modelDeviations.desires.target }}</span>
          </div>
          <div class="t-diff" :class="financeStore.modelDeviations.desires.diff > 0 ? 'text-danger' : 'text-success'">
            {{ financeStore.modelDeviations.desires.diff > 0 ? '+' : '' }}{{ financeStore.modelDeviations.desires.diff }}€
          </div>
        </div>

        <div class="tracker-card">
          <span class="t-label">{{ $t('budget.tracker_savings') }}</span>
          <div class="t-values">
            <span class="t-actual" :class="{ 't-under': financeStore.modelDeviations.savings.diff < 0 }">€{{ financeStore.modelDeviations.savings.actual }}</span>
            <span class="t-target">/ €{{ financeStore.modelDeviations.savings.target }}</span>
          </div>
          <div class="t-diff" :class="financeStore.modelDeviations.savings.diff < 0 ? 'text-danger' : 'text-success'">
            {{ financeStore.modelDeviations.savings.diff > 0 ? '+' : '' }}{{ financeStore.modelDeviations.savings.diff }}€
          </div>
        </div>
      </div>
    </div>

    <div class="panel levers-panel">
      <div class="panel-header">
        <h3 class="with-icon">
          <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
          {{ $t('budget.title') }}
        </h3>
        <span class="income-reference">{{ $t('budget.income_ref') }} €{{ financeStore.netIncome.toLocaleString() }}</span>
      </div>
      
      <div class="fixed-blocks-container" v-if="fixedItems.length">
        <div class="fixed-block" v-for="item in fixedItems" :key="item.id">
          <div class="fb-icon">🔒</div>
          <div class="fb-content">
            <span class="fb-name">{{ $t('budget.' + (item.name === 'Vivienda' ? 'housing' : 'utilities')) }}</span>
            <span class="fb-amount">€{{ item.amount }}</span>
          </div>
        </div>
      </div>

      <div class="levers-list">
        <div class="levers-group" v-if="needsItems.length">
          <h4 class="group-title text-primary">{{ $t('budget.needs') }}</h4>
          <div class="slider-group" v-for="item in needsItems" :key="item.id">
            <div class="slider-info">
              <div class="label-wrapper">
                <input type="text" :value="item.name.startsWith('new') ? $t('budget.' + item.name) : item.name" @input="item.name = $event.target.value" class="solid-name-input necesidad" />
                <button class="icon-delete-btn" @click="financeStore.removeSlider(item.id)" title="Eliminar gasto">
                  <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
              <div class="values amount-input-wrapper">
                <input type="number" class="amount-input neon-text" :value="item.amount" @input="financeStore.handleSliderInput(item, parseInt($event.target.value) || 0); $event.target.value = item.amount" min="0" />
                <span class="currency-symbol neon-text">€</span>
              </div>
            </div>
            <input type="range" min="0" :max="financeStore.netIncome" :value="item.amount" @input="financeStore.handleSliderInput(item, parseInt($event.target.value) || 0); $event.target.value = item.amount" class="cyber-slider need-slider" :style="{ '--val': (financeStore.netIncome ? (item.amount / financeStore.netIncome) * 100 : 0) + '%' }" />
          </div>
        </div>

        <div class="levers-group" v-if="desiresItems.length">
          <h4 class="group-title text-warning">{{ $t('budget.desires') }}</h4>
          <div class="slider-group" v-for="item in desiresItems" :key="item.id">
            <div class="slider-info">
              <div class="label-wrapper">
                <input type="text" :value="item.name.startsWith('new') ? $t('budget.' + item.name) : item.name" @input="item.name = $event.target.value" class="solid-name-input deseo" />
                <button class="icon-delete-btn" @click="financeStore.removeSlider(item.id)" title="Eliminar gasto">
                  <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
              <div class="values amount-input-wrapper">
                <input type="number" class="amount-input neon-text" :value="item.amount" @input="financeStore.handleSliderInput(item, parseInt($event.target.value) || 0); $event.target.value = item.amount" min="0" />
                <span class="currency-symbol neon-text">€</span>
              </div>
            </div>
            <input type="range" min="0" :max="financeStore.netIncome" :value="item.amount" @input="financeStore.handleSliderInput(item, parseInt($event.target.value) || 0); $event.target.value = item.amount" class="cyber-slider desire-slider" :style="{ '--val': (financeStore.netIncome ? (item.amount / financeStore.netIncome) * 100 : 0) + '%' }" />
          </div>
        </div>
        
        <div class="add-buttons-row">
          <button class="add-slider-btn need-btn" @click="financeStore.addNewSlider('necesidad')">
            <svg width="16" height="16" viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            {{ $t('budget.add_need') }}
          </button>
          <button class="add-slider-btn desire-btn" @click="financeStore.addNewSlider('deseo')">
            <svg width="16" height="16" viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            {{ $t('budget.add_desire') }}
          </button>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" @click="saveUpdates">Guardar Actualizaciones</button>
          <button class="btn-secondary" @click="resetToDefault">Reiniciar Parámetros</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '../../store/finance';
import { useI18n } from 'vue-i18n';

const financeStore = useFinanceStore();
const { t } = useI18n();

const fixedItems = computed(() => financeStore.budgetItems.filter(i => i.locked));
const variableItems = computed(() => financeStore.budgetItems.filter(i => !i.locked));
const needsItems = computed(() => variableItems.value.filter(i => i.type === 'necesidad'));
const desiresItems = computed(() => variableItems.value.filter(i => i.type === 'deseo'));

const styleModels = [
  { id: 'personalizado', key: 'free_mode' },
  { id: 'equilibrio', key: 'balance' },
  { id: 'acelerador', key: 'accelerator' },
  { id: 'salvavidas', key: 'lifesaver' },
  { id: 'rescate', key: 'rescue' }
];

const getModelName = (id) => {
  const model = styleModels.find(m => m.id === id);
  return model ? t('models.' + model.key) : id;
};
const getModelDesc = (id) => {
  const model = styleModels.find(m => m.id === id);
  return model ? t('models.' + model.key + '_desc') : '';
};

const saveUpdates = () => {
  financeStore.saveToLocal();
  alert(t('budget.save_updates'));
};

const resetToDefault = () => {
  financeStore.resetToDefault();
};
</script>

<style scoped>
.levers-container { display: flex; flex-direction: column; gap: 1.5rem; }
.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.income-reference { font-size: 0.85rem; font-weight: 700; color: var(--color-success); background: rgba(0, 200, 5, 0.1); padding: 0.3rem 0.8rem; border-radius: 20px; border: 1px solid rgba(0, 200, 5, 0.2); font-family: monospace; }
.with-icon { display: flex; align-items: center; gap: 0.5rem; margin: 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.with-icon .icon { width: 16px; height: 16px; color: var(--color-primary); }

.strategy-toggle { display: flex; justify-content: center; gap: 0; background: var(--bg-base); border-radius: 20px; padding: 4px; width: fit-content; margin: 0 auto; border: 1px solid var(--border-color); }
.toggle-btn { background: transparent; border: none; color: var(--text-muted); padding: 0.6rem 2rem; border-radius: 16px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 600; font-size: 0.85rem; transition: all 0.3s; }
.toggle-btn.active { background: var(--color-primary); color: #FFFFFF; border: 1px solid var(--color-primary); }

.tracker-panel { border-left: 4px solid var(--color-primary); }
.tracker-panel h4 { margin: 0 0 0.2rem 0; font-size: 0.95rem; }
.model-desc { margin: 0 0 1rem 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; font-weight: 500; font-style: italic; }
.tracker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.tracker-card { background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px dashed var(--border-color); display: flex; flex-direction: column; gap: 0.4rem; }
.t-label { font-size: 0.75rem; text-transform: uppercase; font-weight: 600; color: var(--text-muted); }
.t-values { display: flex; align-items: baseline; gap: 0.5rem; }
.t-actual { font-size: 1.3rem; font-weight: 800; font-family: monospace; }
.t-target { font-size: 0.9rem; color: var(--text-muted); font-family: monospace; }
.t-over { color: var(--color-danger); }
.t-under { color: var(--color-danger); }
.t-diff { font-size: 0.8rem; font-weight: 700; font-family: monospace; padding-top: 0.4rem; border-top: 1px solid rgba(255,255,255,0.05); }

.fixed-blocks-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.fixed-block { background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 1rem; display: flex; align-items: center; gap: 1rem; }
.fb-icon { font-size: 1.2rem; filter: grayscale(100%); opacity: 0.5; }
.fb-content { display: flex; flex-direction: column; gap: 0.2rem; }
.fb-name { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.fb-amount { font-size: 1.2rem; font-family: monospace; font-weight: 700; color: var(--text-main); }

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

.cyber-slider { -webkit-appearance: none; width: 100%; height: 6px; background: linear-gradient(to right, var(--color-success) var(--val, 0%), var(--bg-base) var(--val, 0%)); border-radius: 3px; outline: none; }
.cyber-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--color-success); cursor: pointer; box-shadow: 0 0 8px var(--color-success); }
.locked-slider::-webkit-slider-thumb { background: var(--border-color); box-shadow: none; cursor: not-allowed; }
.locked-slider { background: linear-gradient(to right, var(--border-color) var(--val, 0%), var(--bg-base) var(--val, 0%)); }

.levers-group { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 0.5rem; background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); }
.group-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0 0 0.5rem 0; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
.text-primary { color: var(--color-primary); }
.text-warning { color: #f59e0b; }

.solid-name-input { background: var(--bg-base); border: 1px solid var(--border-color); color: var(--text-main); outline: none; font-family: 'Inter', monospace; width: 140px; font-weight: 600; padding: 6px 10px; border-radius: 6px; transition: all 0.3s; }
.solid-name-input.necesidad { color: var(--color-primary); }
.solid-name-input.deseo { color: #f59e0b; }
.solid-name-input:focus { border-color: var(--text-muted); box-shadow: 0 0 5px rgba(255,255,255,0.1); }

.icon-delete-btn { background: transparent; color: var(--text-muted); border: none; padding: 4px; cursor: pointer; transition: all 0.2s; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.icon-delete-btn:hover { background: rgba(255, 77, 79, 0.1); color: var(--color-danger); }

.need-slider { background: linear-gradient(to right, var(--color-primary) var(--val, 0%), var(--bg-base) var(--val, 0%)); }
.need-slider::-webkit-slider-thumb { background: var(--color-primary); box-shadow: 0 0 8px var(--color-primary); }
.desire-slider { background: linear-gradient(to right, #f59e0b var(--val, 0%), var(--bg-base) var(--val, 0%)); }
.desire-slider::-webkit-slider-thumb { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }

.add-buttons-row { display: flex; gap: 1rem; margin-top: 0.5rem; }
.add-slider-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: transparent; border: 1px dashed var(--border-color); padding: 0.8rem; border-radius: 8px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 600; transition: all 0.3s; }
.need-btn { color: var(--color-primary); border-color: rgba(59, 130, 246, 0.5); }
.need-btn:hover { background: rgba(59, 130, 246, 0.1); border-color: var(--color-primary); }
.desire-btn { color: #f59e0b; border-color: rgba(245, 158, 11, 0.5); }
.desire-btn:hover { background: rgba(245, 158, 11, 0.1); border-color: #f59e0b; }

.action-buttons { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem; border-top: 1px dashed var(--border-color); padding-top: 1.5rem; }
.btn-primary { background: var(--color-primary); color: #FFFFFF; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 700; transition: all 0.3s; }
.btn-primary:hover { box-shadow: 0 0 15px rgba(59,130,246,0.4); transform: translateY(-1px); background: #2563eb; }
.btn-secondary { background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); padding: 0.8rem; border-radius: 8px; cursor: pointer; font-family: 'Inter', monospace; font-weight: 600; transition: all 0.3s; }
.btn-secondary:hover { border-color: var(--text-main); color: var(--text-main); background: var(--border-color); }
</style>
