<template>
  <div class="app-layout">
    <Sidebar />
    <main class="app-main">
      <Topbar />
      <div class="app-container">

        <div class="page-header">
          <div>
            <h2 class="page-heading">Perfil Financiero</h2>
            <p class="page-sub">Sala de Máquinas · Define tu realidad económica actual</p>
          </div>
          <button class="btn-primary save-all-btn" @click="saveAll" :disabled="isSaving">
            {{ isSaving ? 'Sincronizando...' : '💾 Guardar y Sincronizar' }}
          </button>
        </div>
        <p v-if="saveSuccess" class="save-success-banner">✓ Datos sincronizados correctamente con la base de datos.</p>

        <div class="fp-grid">

          <!-- COL LEFT -->
          <div class="fp-col">

            <!-- INGRESOS -->
            <div class="panel">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" class="s-icon green"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                Ingresos
              </h3>
              <div class="two-col">
                <div class="field-group">
                  <label class="field-label">Sueldo Neto Mensual</label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.net_monthly_income" min="0" step="50" />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Otros Ingresos <span class="badge-opt">Opcional</span></label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.extra_income" min="0" step="10" />
                  </div>
                </div>
              </div>
              <div class="total-row">
                <span class="total-lbl">Total ingreso mensual estimado</span>
                <span class="total-val green-text">{{ totalIncome.toLocaleString('es-ES') }} €</span>
              </div>
            </div>

            <!-- GASTOS FIJOS -->
            <div class="panel">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" class="s-icon yellow"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                Gastos Fijos
              </h3>
              <div class="two-col">
                <div class="field-group">
                  <label class="field-label">Vivienda / Hipoteca</label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.housing" min="0" step="10" />
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">Suministros (Luz, Agua, etc.)</label>
                  <div class="currency-wrap"><span class="currency-symbol">€</span>
                    <input class="field-input currency-input" type="number" v-model.number="form.utilities" min="0" step="10" />
                  </div>
                </div>
              </div>
              <div class="total-row">
                <span class="total-lbl">Total gastos fijos</span>
                <span class="total-val red-text">{{ totalFixed.toLocaleString('es-ES') }} €</span>
              </div>
            </div>

          </div>

          <!-- COL RIGHT: DEUDAS -->
          <div class="fp-col">
            <div class="panel debt-panel">
              <div class="debt-header">
                <div>
                  <h3 class="section-title" style="margin-bottom:0.2rem">
                    <svg viewBox="0 0 24 24" class="s-icon red"><path fill="currentColor" d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                    Gestor de Deudas
                  </h3>
                  <p class="panel-subtitle">Añade cada deuda por separado para proyecciones precisas.</p>
                </div>
                <div class="debt-kpis">
                  <div class="kpi-box">
                    <span class="kpi-lbl">TOTAL DEUDA</span>
                    <span class="kpi-val red-text">{{ totalDebt.toLocaleString('es-ES') }}€</span>
                  </div>
                  <div class="kpi-box">
                    <span class="kpi-lbl">CUOTA/MES</span>
                    <span class="kpi-val yellow-text">{{ totalMonthlyPayment.toLocaleString('es-ES') }}€</span>
                  </div>
                </div>
              </div>



              <!-- Debt Table -->
              <div class="debt-table" v-if="debts.length > 0">
                <div class="debt-table-head">
                  <span>Nombre</span><span>Capital</span><span>Interés</span><span>Cuota/mes</span><span></span>
                </div>
                <div class="debt-table-row" v-for="debt in sortedDebts" :key="debt.id">
                  <span class="d-name">{{ debt.name }}</span>
                  <span class="d-amount">{{ parseFloat(debt.amount).toLocaleString('es-ES') }}€</span>
                  <span class="d-rate" :class="rateClass(debt.interest_rate)">{{ parseFloat(debt.interest_rate || 0).toFixed(1) }}%</span>
                  <span class="d-payment">{{ parseFloat(debt.monthly_payment || 0).toLocaleString('es-ES') }}€</span>
                  <button class="btn-del" @click="removeDebt(debt.id)" :disabled="loadingDebt">×</button>
                </div>
              </div>
              <div class="debt-empty" v-else>
                <p>Sin deudas registradas. Añade la primera abajo.</p>
              </div>

              <!-- Add Debt Form -->
              <div class="add-form">
                <h4 class="add-form-title">+ Nueva Deuda</h4>
                <div class="add-form-grid">
                  <div class="field-group">
                    <label class="field-label">Nombre</label>
                    <input class="field-input" type="text" v-model="newDebt.name" placeholder="Ej: Tarjeta VISA, Coche..." />
                  </div>
                  <div class="field-group">
                    <label class="field-label">Capital pendiente (€)</label>
                    <div class="currency-wrap"><span class="currency-symbol">€</span>
                      <input class="field-input currency-input" type="number" v-model.number="newDebt.amount" min="0" step="100" placeholder="0" />
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label">Tipo de interés (%)</label>
                    <div class="currency-wrap">
                      <input class="field-input" type="number" v-model.number="newDebt.interest_rate" min="0" max="100" step="0.1" placeholder="0.0" />
                      <span class="currency-symbol" style="left:auto;right:0.8rem">%</span>
                    </div>
                  </div>
                  <div class="field-group">
                    <label class="field-label">Cuota mensual (€)</label>
                    <div class="currency-wrap"><span class="currency-symbol">€</span>
                      <input class="field-input currency-input" type="number" v-model.number="newDebt.monthly_payment" min="0" step="10" placeholder="0" />
                    </div>
                  </div>
                </div>
                <div class="add-form-action">
                  <button class="btn-primary" @click="addDebt" :disabled="loadingDebt || !newDebt.name || !newDebt.amount">
                    {{ loadingDebt ? 'Añadiendo...' : 'Añadir Deuda' }}
                  </button>
                  <p v-if="debtError" class="error-msg">{{ debtError }}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar.vue';
import Topbar from '../components/layout/Topbar.vue';

const authStore = useAuthStore();
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
const newDebt = reactive({ name: '', amount: null, interest_rate: 0, monthly_payment: 0 });

const totalIncome = computed(() => (form.net_monthly_income || 0) + (form.extra_income || 0));
const totalFixed = computed(() => (form.housing || 0) + (form.utilities || 0));
const totalDebt = computed(() => Math.round(debts.value.reduce((s, d) => s + parseFloat(d.amount), 0)));
const totalMonthlyPayment = computed(() => Math.round(debts.value.reduce((s, d) => s + parseFloat(d.monthly_payment || 0), 0)));

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
      net_monthly_income: form.net_monthly_income,
      extra_income: form.extra_income,
      housing: form.housing,
      utilities: form.utilities,
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

const removeDebt = async (id) => {
  loadingDebt.value = true;
  try {
    const { data } = await api.delete(`/debts/${id}`);
    debts.value = data.debts || [];
  } catch (e) {
    debtError.value = 'Error al eliminar.';
  } finally { loadingDebt.value = false; }
};

onMounted(() => {
  fetchDebts();
});
</script>

<style scoped>
.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; flex-wrap:wrap; gap:1rem; }
.page-heading { margin:0 0 0.3rem; font-size:1.6rem; font-weight:800; color:var(--text-main); }
.page-sub { margin:0; color:var(--text-muted); font-size:0.85rem; font-family:monospace; letter-spacing:1px; }
.save-all-btn { padding:0.8rem 1.8rem; font-size:0.95rem; align-self:flex-start; }
.save-success-banner { background:rgba(0,200,5,0.08); border:1px solid rgba(0,200,5,0.25); color:var(--color-success); padding:0.7rem 1rem; border-radius:8px; font-size:0.85rem; margin-bottom:1.5rem; }

.fp-grid { display:grid; grid-template-columns:1fr 1.1fr; gap:1.5rem; align-items:start; }
.fp-col { display:flex; flex-direction:column; gap:1.5rem; }

.section-title { display:flex; align-items:center; gap:0.6rem; margin:0 0 1.2rem; font-size:0.78rem; color:var(--text-muted); font-weight:700; letter-spacing:1.5px; text-transform:uppercase; }
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



/* Debt Table */
.debt-table { border:1px solid var(--border-color); border-radius:8px; overflow:hidden; }
.debt-table-head { display:grid; grid-template-columns:1fr 100px 80px 100px 36px; padding:0.5rem 1rem; background:var(--bg-base); font-size:0.68rem; font-family:monospace; letter-spacing:1px; color:var(--text-muted); }
.debt-table-row { display:grid; grid-template-columns:1fr 100px 80px 100px 36px; padding:0.8rem 1rem; align-items:center; border-top:1px solid var(--border-color); transition:background 0.2s; }
.debt-table-row:hover { background:rgba(59,130,246,0.04); }
.d-name { font-size:0.88rem; color:var(--text-main); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.d-amount { font-family:monospace; font-weight:700; color:var(--color-danger); font-size:0.88rem; }
.d-rate { font-family:monospace; font-weight:700; font-size:0.88rem; }
.d-payment { font-family:monospace; font-weight:600; color:var(--text-muted); font-size:0.88rem; }
.rate-high { color:var(--color-danger); }
.rate-mid { color:#fcd34d; }
.rate-low { color:var(--color-success); }
.btn-del { background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:1.2rem; border-radius:4px; padding:0.1rem 0.4rem; transition:all 0.2s; }
.btn-del:hover:not(:disabled) { background:rgba(255,107,107,0.1); color:var(--color-danger); }
.debt-empty { text-align:center; padding:2rem; color:var(--text-muted); font-size:0.85rem; border:1px dashed var(--border-color); border-radius:8px; }

/* Add Form */
.add-form { border-top:1px solid var(--border-color); padding-top:1.2rem; }
.add-form-title { margin:0 0 0.8rem; font-size:0.72rem; font-family:monospace; letter-spacing:1.5px; color:var(--text-muted); }
.add-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem 1rem; }
.add-form-action { display:flex; align-items:center; gap:1rem; margin-top:0.8rem; }
.error-msg { color:var(--color-danger); font-size:0.8rem; font-family:monospace; margin:0; }

@media (max-width:900px) {
  .fp-grid { grid-template-columns:1fr; }
  .two-col { grid-template-columns:1fr; }
  .add-form-grid { grid-template-columns:1fr; }
  .debt-table-head, .debt-table-row { grid-template-columns:1fr 90px 70px 36px; }
  .d-payment { display:none; }
}
</style>
