<template>
  <div class="dashboard-layout">
    <main class="main-content">
      <TourGuide page="financial-profile" storageName="tour_seen_profile" />
      <Topbar />
      <div class="dashboard-container">

        <div class="unified-header" id="tour-fp-header">
          <h2 class="title">{{ $t('financial_profile.page_title') }}</h2>
          <p class="subtitle">{{ $t('financial_profile.page_sub') }}</p>
        </div>
        <p v-if="saveSuccess" class="save-success-banner">{{ $t('financial_profile.save_success') }}</p>

        <div class="fp-grid">

          <!-- COL LEFT -->
          <div class="fp-col">

            <!-- INGRESOS -->
            <div class="panel" id="tour-fp-income">
              <div class="panel-header-inline">
                <h3 class="section-title">
                  <svg viewBox="0 0 24 24" class="s-icon green"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                  {{ $t('financial_profile.income_title') }}
                </h3>
                <button class="btn-sync" @click="saveAll" :disabled="isSaving">
                  <svg viewBox="0 0 24 24" :class="{ 'spinning': isSaving }"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                  <span>{{ isSaving ? 'Guardando...' : 'Guardar' }}</span>
                </button>
              </div>
              <div class="two-col">
                <div class="field-group">
                  <label class="field-label">{{ $t('financial_profile.net_salary') }}</label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.net_monthly_income" min="0" step="50" />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">{{ $t('financial_profile.extra_income') }} <span class="badge-opt">{{ $t('financial_profile.optional') }}</span></label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.extra_income" min="0" step="10" />
                  </div>
                </div>
              </div>
              <div class="total-row">
                <span class="total-lbl">{{ $t('financial_profile.total_income') }}</span>
                <span class="total-val green-text">{{ totalIncome.toLocaleString('es-ES') }} €</span>
              </div>
            </div>

            <!-- GASTOS FIJOS -->
            <div class="panel" id="tour-fp-expenses">
              <div class="panel-header-inline">
                <h3 class="section-title">
                  <svg viewBox="0 0 24 24" class="s-icon yellow"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  {{ $t('financial_profile.fixed_expenses_title') }}
                </h3>
                <button class="btn-sync" @click="saveAll" :disabled="isSaving">
                  <svg viewBox="0 0 24 24" :class="{ 'spinning': isSaving }"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                  <span>{{ isSaving ? 'Guardando...' : 'Guardar' }}</span>
                </button>
              </div>
              <div class="two-col">
                <div class="field-group">
                  <label class="field-label">{{ $t('financial_profile.housing') }}</label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.housing" min="0" step="10" />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">{{ $t('financial_profile.utilities') }}</label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.utilities" min="0" step="10" />
                  </div>
                </div>
              </div>
              <div class="total-row">
                <span class="total-lbl">{{ $t('financial_profile.total_fixed') }}</span>
                <span class="total-val red-text">{{ totalFixed.toLocaleString('es-ES') }} €</span>
              </div>
            </div>

          </div>

          <!-- COL RIGHT: DEUDAS -->
          <div class="fp-col">
            <div class="panel debt-panel" id="tour-fp-debt">
              <div class="debt-header">
                <div>
                  <h3 class="section-title" style="margin-bottom:0.2rem">
                    <svg viewBox="0 0 24 24" class="s-icon red"><path fill="currentColor" d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                    {{ $t('financial_profile.debt_manager') }}
                  </h3>
                  <p class="panel-subtitle">{{ $t('financial_profile.debt_subtitle') }}</p>
                </div>
                <div class="debt-kpis">
                  <div class="kpi-box">
                    <span class="kpi-lbl">{{ $t('financial_profile.total_debt') }}</span>
                    <span class="kpi-val red-text">{{ totalDebt.toLocaleString('es-ES') }}€</span>
                  </div>
                  <div class="kpi-box">
                    <span class="kpi-lbl">{{ $t('financial_profile.monthly_fee') }}</span>
                    <span class="kpi-val yellow-text">{{ totalMonthlyPayment.toLocaleString('es-ES') }}€</span>
                  </div>
                </div>
              </div>



              <!-- Debt Table -->
              <div class="debt-table-wrapper" v-if="debts.length > 0">
                <div class="debt-table-header">
                  <span>{{ $t('financial_profile.debt_name') }}</span>
                  <span>{{ $t('financial_profile.debt_capital') }}</span>
                  <span>{{ $t('financial_profile.debt_interest') }}</span>
                  <span>{{ $t('financial_profile.debt_fee') }}</span>
                  <span class="text-right">ACCIONES</span>
                </div>
                <div class="debt-rows">
                  <div class="debt-row" v-for="debt in sortedDebts" :key="debt.id" :class="{ 'is-editing': editingId === debt.id }">
                    <template v-if="editingId === debt.id">
                      <div class="edit-mode-grid">
                        <input class="premium-edit-input" type="text" v-model="editDebt.name" />
                        <div class="input-unit">
                          <input class="premium-edit-input" type="number" v-model.number="editDebt.amount" min="0" />
                          <i>€</i>
                        </div>
                        <div class="input-unit">
                          <input class="premium-edit-input" type="number" v-model.number="editDebt.interest_rate" step="0.1" min="0" max="999" />
                          <i>%</i>
                        </div>
                        <div class="input-unit">
                          <input class="premium-edit-input" type="number" v-model.number="editDebt.monthly_payment" min="0" />
                          <i>€</i>
                        </div>
                        <div class="edit-actions">
                          <button class="icon-btn-circle save" @click="saveEdit" :disabled="loadingDebt" title="Guardar">✓</button>
                          <button class="icon-btn-circle cancel" @click="cancelEdit" :disabled="loadingDebt" title="Cancelar">×</button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <span class="d-name">{{ debt.name }}</span>
                      <span class="d-amount">{{ parseFloat(debt.amount).toLocaleString('es-ES') }}€</span>
                      <span class="d-rate" :class="rateClass(debt.interest_rate)">{{ parseFloat(debt.interest_rate || 0).toFixed(1) }}%</span>
                      <span class="d-payment">{{ parseFloat(debt.monthly_payment || 0).toLocaleString('es-ES') }}€</span>
                      <div class="item-actions">
                        <button class="icon-btn-circle edit" @click="startEdit(debt)" :disabled="loadingDebt" title="Editar">
                          <svg viewBox="0 0 24 24" class="icon-s"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="icon-btn-circle delete" @click="removeDebt(debt.id)" :disabled="loadingDebt" title="Eliminar">×</button>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="debt-empty" v-else>
                <p>{{ $t('financial_profile.no_debts') }}</p>
              </div>

              <!-- Add Debt Form -->
              <div class="add-form">
                <h4 class="add-form-title">{{ $t('financial_profile.new_debt') }}</h4>
                <div class="add-form-grid">
                  <div class="field-group">
                    <label class="field-label">{{ $t('financial_profile.debt_name') }}</label>
                    <input class="field-input" type="text" v-model="newDebt.name" :placeholder="$t('financial_profile.ph_name')" />
                  </div>
                  <div class="field-group">
                    <label class="field-label">{{ $t('financial_profile.capital_pending') }}</label>
                    <div class="currency-wrap"><span class="currency-symbol">€</span>
                      <input class="field-input currency-input" type="number" v-model.number="newDebt.amount" min="0" step="100" placeholder="0" />
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label">{{ $t('financial_profile.interest_rate') }}</label>
                    <div class="currency-wrap">
                      <input class="field-input percent-input" type="number" v-model.number="newDebt.interest_rate" min="0" max="999" step="0.1" placeholder="0.0" />
                      <span class="currency-symbol" style="left:auto;right:0.8rem">%</span>
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label">{{ $t('financial_profile.monthly_payment') }}</label>
                    <div class="currency-wrap"><span class="currency-symbol">€</span>
                      <input class="field-input currency-input" type="number" v-model.number="newDebt.monthly_payment" min="0" step="10" placeholder="0" />
                    </div>
                  </div>
                </div>
                <div class="add-form-action">
                  <button class="btn-primary" @click="addDebt" :disabled="loadingDebt || !newDebt.name || !newDebt.amount">
                    {{ loadingDebt ? $t('financial_profile.btn_adding') : $t('financial_profile.btn_add_debt') }}
                  </button>
                  <p v-if="debtError" class="error-msg">{{ debtError }}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- ── CONFIRMATION MODAL ── -->
    <ConfirmModal
      :show="showConfirmModal"
      title="Eliminar Deuda"
      message="¿Estás seguro de que quieres eliminar esta deuda de tu perfil financiero?"
      icon="💳"
      @confirm="onConfirmRemoveDebt"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../store/auth';
import { useFinanceStore } from '../store/finance';
import api from '../services/api';
import Topbar from '../components/layout/Topbar.vue';
import TourGuide from '../components/TourGuide.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';

const authStore = useAuthStore();
const financeStore = useFinanceStore();
const { t } = useI18n();
const user = computed(() => authStore.user || {});
const token = authStore.token;

const form = reactive({
  net_monthly_income: parseFloat(user.value.net_monthly_income) || 0,
  extra_income: parseFloat(user.value.extra_income) || 0,
  housing: parseFloat(user.value.housing) || 0,
  utilities: parseFloat(user.value.utilities) || 0,
});

const isSaving = ref(false);
const saveSuccess = ref(false);
const debts = ref([]);
const loadingDebt = ref(false);
const debtError = ref('');
const showConfirmModal = ref(false);
const debtToDelete = ref(null);
const newDebt = reactive({ name: '', amount: null, interest_rate: 0, monthly_payment: 0 });
const editingId = ref(null);
const editDebt = reactive({ name: '', amount: 0, interest_rate: 0, monthly_payment: 0 });

const totalIncome = computed(() => (form.net_monthly_income || 0) + (form.extra_income || 0));
const totalFixed = computed(() => (form.housing || 0) + (form.utilities || 0));
const totalDebt = computed(() => Math.round(debts.value.reduce((s, d) => s + parseFloat(d.amount), 0)));
const totalMonthlyPayment = computed(() => Math.round(debts.value.reduce((s, d) => s + parseFloat(d.monthly_payment || 0), 0)));

// RADICAL PREVENTION: Watch for negative values and reset them instantly
import { watch } from 'vue';
watch(() => form.net_monthly_income, (val) => { if (val < 0) form.net_monthly_income = 0; });
watch(() => form.extra_income, (val) => { if (val < 0) form.extra_income = 0; });
watch(() => form.housing, (val) => { if (val < 0) form.housing = 0; });
watch(() => form.utilities, (val) => { if (val < 0) form.utilities = 0; });
watch(() => newDebt.interest_rate, (val) => { if (val > 999) newDebt.interest_rate = 999; if (val < 0) newDebt.interest_rate = 0; });
watch(() => editDebt.interest_rate, (val) => { if (val > 999) editDebt.interest_rate = 999; if (val < 0) editDebt.interest_rate = 0; });

const sortedDebts = computed(() => [...debts.value].sort((a, b) => parseFloat(b.interest_rate) - parseFloat(a.interest_rate)));

const rateClass = (rate) => {
  const r = parseFloat(rate || 0);
  if (r > 10) return 'rate-high';
  if (r > 5) return 'rate-mid';
  return 'rate-low';
};

const saveAll = async () => {
  isSaving.value = true;
  saveSuccess.value = false;
  try {
    await authStore.updateProfile({
      ...user.value,
      net_monthly_income: Math.max(0, form.net_monthly_income || 0),
      extra_income: Math.max(0, form.extra_income || 0),
      housing: Math.max(0, form.housing || 0),
      utilities: Math.max(0, form.utilities || 0),
    });
    localStorage.removeItem('finlogic_custom_budget_' + user.value.id);
    saveSuccess.value = true;
    setTimeout(() => saveSuccess.value = false, 5000);
  } finally { isSaving.value = false; }
};

const fetchDebts = async () => {
  try {
    const { data } = await api.get('/debts');
    debts.value = data.debts || [];
  } catch (e) { console.error(e); }
};

const addDebt = async () => {
  if (!newDebt.name || !newDebt.amount || newDebt.amount <= 0) {
    debtError.value = 'Introduce un nombre y un importe válido.';
    return;
  }
  debtError.value = '';
  loadingDebt.value = true;
  try {
    const { data } = await api.post('/debts', {
      name: newDebt.name,
      amount: newDebt.amount,
      interest_rate: newDebt.interest_rate || 0,
      monthly_payment: newDebt.monthly_payment || 0,
    });
    debts.value = data.debts || [];
    newDebt.name = '';
    newDebt.amount = null;
    newDebt.interest_rate = 0;
    newDebt.monthly_payment = 0;
  } catch (e) {
    debtError.value = e.response?.data?.error || 'Error al añadir la deuda.';
  } finally { loadingDebt.value = false; }
};

const removeDebt = (id) => {
  debtToDelete.value = id;
  showConfirmModal.value = true;
};

const onConfirmRemoveDebt = async () => {
  const id = debtToDelete.value;
  if (!id) return;

  loadingDebt.value = true;
  showConfirmModal.value = false;
  try {
    const { data } = await api.delete(`/debts/${id}`);
    debts.value = data.debts || [];
  } catch (e) {
    debtError.value = 'Error al eliminar.';
  } finally {
    loadingDebt.value = false;
    debtToDelete.value = null;
  }
};

const startEdit = (debt) => {
  editingId.value = debt.id;
  Object.assign(editDebt, {
    name: debt.name,
    amount: parseFloat(debt.amount),
    interest_rate: parseFloat(debt.interest_rate),
    monthly_payment: parseFloat(debt.monthly_payment)
  });
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async () => {
  if (!editDebt.name || editDebt.amount < 0) return;
  loadingDebt.value = true;
  try {
    const { data } = await api.put(`/debts/${editingId.value}`, editDebt);
    debts.value = data.debts || [];
    // Update store
    financeStore.setDebts(debts.value);
    editingId.value = null;
    debtError.value = '';
  } catch (e) {
    console.error(e);
    debtError.value = e.response?.data?.error || 'Error al actualizar la deuda.';
  } finally {
    loadingDebt.value = false;
  }
};

onMounted(() => {
  fetchDebts();
});
</script>

<style scoped>
.dashboard-layout { min-height: 100vh; font-family: 'Inter', sans-serif; color: var(--text-main); }
.main-content { padding-top: 140px; padding-bottom: 4rem; width: 100%; }
.dashboard-container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; display: flex; flex-direction: column; gap: 2.5rem; }

.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; flex-wrap:wrap; gap:1rem; }
.page-heading { margin:0 0 0.3rem; font-size:1.6rem; font-weight:800; color:var(--text-main); }
.page-sub { margin:0; color:var(--text-muted); font-size:0.85rem; font-family:monospace; letter-spacing:1px; }
.save-all-btn { padding:0.8rem 1.8rem; font-size:0.95rem; align-self:flex-start; }
.save-success-banner { background:rgba(0,200,5,0.08); border:1px solid rgba(0,200,5,0.25); color:var(--color-success); padding:0.7rem 1rem; border-radius:8px; font-size:0.85rem; margin-bottom:1.5rem; }

.fp-grid { display:grid; grid-template-columns:1fr 1.1fr; gap:1.5rem; align-items:start; }
.fp-col { display:flex; flex-direction:column; gap:1.5rem; }

.panel-header-inline { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
.section-title { display:flex; align-items:center; gap:0.6rem; margin:0; font-size:0.78rem; color:var(--text-muted); font-weight:700; letter-spacing:1.5px; text-transform:uppercase; }

.btn-sync {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: var(--color-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn-sync:hover:not(:disabled) { background: rgba(59, 130, 246, 0.2); border-color: var(--color-primary); }
.btn-sync svg { width: 14px; height: 14px; }
.btn-sync .spinning { animation: spin 1s linear infinite; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.s-icon { width:16px; height:16px; flex-shrink:0; }
.s-icon.green { color:var(--color-success); }
.s-icon.yellow { color:#fcd34d; }
.s-icon.blue { color:var(--color-primary); }
.s-icon.red { color:var(--color-danger); }

.two-col { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem 1rem; }
.context-grid { display:flex; flex-direction:column; gap:0.8rem; }

.total-row { display:flex; justify-content:space-between; align-items:center; background:var(--bg-base); border:1px solid var(--border-color); border-radius:8px; padding:0.8rem 1rem; margin-top:1rem; }
.total-lbl { font-size:0.82rem; color:var(--text-muted); }
.total-val { font-size:1.2rem; font-weight:800; font-family:monospace; }
.green-text { color:var(--color-success); }
.red-text { color:var(--color-danger); }
.yellow-text { color:#fcd34d; }
.badge-opt { margin-left:0.4rem; background:var(--border-color); color:var(--text-muted); border-radius:4px; padding:0.1rem 0.4rem; font-size:0.68rem; font-weight:600; text-transform:none; letter-spacing:0; }

/* Debt Panel */
.debt-panel { display:flex; flex-direction:column; gap:1.2rem; }
.debt-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; }
.panel-subtitle { margin:0.2rem 0 0; font-size:0.8rem; color:var(--text-muted); }
.debt-kpis { display:flex; gap:1.5rem; }
.kpi-box { display:flex; flex-direction:column; align-items:flex-end; }
.kpi-lbl { font-size:0.65rem; font-family:monospace; letter-spacing:1px; color:var(--text-muted); }
.kpi-val { font-size:1.4rem; font-weight:800; font-family:monospace; }



/* --- REDESIGN: DEBT TABLE --- */
.debt-table-wrapper { border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; background: rgba(255,255,255,0.02); }
.debt-table-header { display: grid; grid-template-columns: 2fr 1fr 0.8fr 1fr 100px; padding: 0.8rem 1.2rem; background: var(--bg-base); font-size: 0.65rem; font-family: monospace; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid var(--border-color); }
.debt-row { display: grid; grid-template-columns: 2fr 1fr 0.8fr 1fr 100px; padding: 1rem 1.2rem; align-items: center; border-bottom: 1px solid var(--border-color); transition: all 0.3s; }
.debt-row:last-child { border-bottom: none; }
.debt-row:hover { background: rgba(59, 130, 246, 0.05); }
.debt-row.is-editing { background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--color-primary); }

.d-name { font-weight: 600; color: #fff; font-size: 0.95rem; }
.d-amount { font-family: monospace; color: var(--color-danger); font-weight: 700; font-size: 1rem; }
.d-rate { font-family: monospace; font-size: 0.85rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(0,0,0,0.2); width: fit-content; font-weight: 700; }
.d-payment { font-family: monospace; color: var(--text-muted); font-weight: 600; font-size: 0.95rem; }

.item-actions, .edit-actions { display: flex; gap: 0.4rem; justify-content: flex-end; }
.text-right { text-align: right; }

.icon-btn-circle { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-color); background: var(--bg-panel); color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 1rem; }
.icon-btn-circle:hover:not(:disabled) { border-color: #fff; color: #fff; background: var(--border-color); }
.icon-btn-circle.edit:hover:not(:disabled) { color: var(--color-primary); border-color: var(--color-primary); background: rgba(59, 130, 246, 0.1); }
.icon-btn-circle.delete:hover:not(:disabled) { color: var(--color-danger); border-color: var(--color-danger); background: rgba(255, 107, 107, 0.1); }
.icon-btn-circle.save { color: var(--color-success); border-color: var(--color-success); }
.icon-btn-circle.save:hover:not(:disabled) { background: rgba(0, 200, 5, 0.1); }
.icon-s { width: 14px; height: 14px; }

/* EDIT MODE */
.edit-mode-grid { display: contents; }
.premium-edit-input { background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem 0.6rem; color: #fff; font-size: 0.85rem; width: 90%; outline: none; }
.premium-edit-input:focus { border-color: var(--color-primary); }
.input-unit { position: relative; width: 90%; }
.input-unit i { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); font-style: normal; font-size: 0.7rem; color: var(--text-muted); }

@media (max-width:900px) {
  .fp-grid { grid-template-columns:1fr; }
  .debt-table-header, .debt-row { grid-template-columns: 1fr 1fr 1fr 40px; padding: 0.8rem; }
  .d-payment { display:none; }
}
</style>
