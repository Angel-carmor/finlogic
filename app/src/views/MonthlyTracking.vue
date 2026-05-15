<template>
  <div class="dashboard-layout">
    <main class="main-content">
      <TourGuide page="tracking" storageName="tour_seen_tracking" />
      <Topbar />
      <div class="dashboard-container">
        
        <!-- ── LOADING OVERLAY ── -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner"></div>
          <p>Cargando Seguimiento...</p>
        </div>

        <!-- ── NOTIFICATIONS ── -->
        <div v-if="trackingStore.error" class="alert-banner error">
          <span>⚠️</span> {{ trackingStore.error }}
          <button @click="trackingStore.error = null" class="close-alert">×</button>
        </div>
        <div v-if="successMsg" class="alert-banner success">
          <span>✅</span> {{ successMsg }}
        </div>

        <!-- ── HEADER ── -->
        <header class="unified-header">
          <h1 class="title">{{ $t('tracking.title') }}</h1>
          <p class="subtitle">{{ $t('tracking.subtitle') }}</p>
          
          <!-- Year Selector -->
          <div class="year-selector">
            <button @click="changeYear(-1)" class="year-btn">‹</button>
            <span class="year-label">{{ trackingStore.selectedYear }}</span>
            <button @click="changeYear(1)" class="year-btn" :disabled="trackingStore.selectedYear >= currentYear">›</button>
          </div>
        </header>

        <!-- ── CALENDAR HEATMAP ── -->
        <section class="calendar-section">
          <div class="calendar-grid">
            <div 
              v-for="(monthName, index) in months" 
              :key="index"
              class="month-card"
              :class="[
                getMonthStatus(index + 1),
                { 'is-active': trackingStore.selectedMonth === index + 1 },
                { 'is-current': isCurrentMonth(index + 1) }
              ]"
              @click="selectMonth(index + 1)"
            >
              <div class="month-head">
                <span class="m-name">{{ monthName }}</span>
                <span class="m-status-icon">{{ getStatusIcon(index + 1) }}</span>
              </div>
              <div class="m-body">
                <template v-if="getHistoryForMonth(index + 1)">
                  <div class="score-wrap">
                    <span class="m-score">{{ calculateMonthScore(getHistoryForMonth(index + 1)) }}</span>
                    <span class="m-score-label">PUNTOS</span>
                  </div>
                  <div class="mini-bar">
                    <div 
                      class="mini-fill" 
                      :style="{ width: calculateMonthScore(getHistoryForMonth(index + 1)) + '%' }"
                    ></div>
                  </div>
                </template>
                <template v-else>
                  <span class="m-empty">{{ isCurrentMonth(index + 1) ? $t('tracking.status_open') : '—' }}</span>
                </template>
              </div>
            </div>
          </div>
        </section>

        <!-- ── DETAIL PANEL ── -->
        <section v-if="trackingStore.data || isCurrentMonth(trackingStore.selectedMonth)" class="detail-section">
          <div class="detail-card">
            
            <div class="detail-header">
              <div class="d-info">
                <h2 class="d-title">{{ trackingStore.monthLabel }}</h2>
                <span class="d-badge" :class="isClosed(trackingStore.selectedMonth) ? 'b-closed' : 'b-open'">
                  {{ isClosed(trackingStore.selectedMonth) ? $t('tracking.status_closed') : $t('tracking.status_open') }}
                </span>
                <span v-if="!isClosed(trackingStore.selectedMonth)" class="d-draft-hint">
                  ({{ $t('tracking.live_draft') }})
                </span>
              </div>
              
              <div v-if="!isClosed(trackingStore.selectedMonth) && !isFutureMonth(trackingStore.selectedMonth)" class="d-actions">
                <button 
                  class="btn-close-month" 
                  @click="handleCloseMonth" 
                  :disabled="closing"
                >
                  {{ closing ? $t('tracking.btn_closing') : $t('tracking.btn_close_month') }}
                </button>
              </div>
              <div v-else-if="isClosed(trackingStore.selectedMonth)" class="d-actions">
                <button 
                  class="btn-reopen" 
                  @click="handleReopenMonth" 
                  :disabled="closing"
                >
                  {{ closing ? $t('tracking.btn_processing') : $t('tracking.btn_reopen') }}
                </button>
              </div>
            </div>

            <!-- KPI Summary -->
            <div class="kpi-grid">
              <div class="kpi-card k-main">
                <span class="k-label">{{ $t('tracking.income_ref') }}</span>
                <span class="k-value k-income">{{ fmt(trackingStore.data?.income || 0) }}</span>
              </div>
              <div class="kpi-card k-main">
                <span class="k-label">{{ $t('tracking.planned_savings') }}</span>
                <span class="k-value k-savings">{{ fmt(trackingStore.data?.savings || 0) }}</span>
              </div>
              <div class="kpi-card k-savings-acc">
                <span class="k-label">Ahorro Total Histórico</span>
                <span class="k-value k-savings">{{ fmt(trackingStore.totalAccumulatedSavings) }}</span>
              </div>
              <div class="kpi-card">
                <span class="k-label">{{ $t('tracking.total_budget_saved') }}</span>
                <span class="k-value">{{ fmt(trackingStore.totalBudget) }}</span>
              </div>
              <div class="kpi-card">
                <span class="k-label">{{ $t('tracking.total_debt_ref') }}</span>
                <span class="k-value k-debt">{{ fmt(trackingStore.data?.totalDebt || 0) }}</span>
              </div>
            </div>

            <!-- Distribution Health -->
            <div class="health-wrap">
              <h3 class="s-title">{{ $t('tracking.financial_health') }}</h3>
              <div class="health-bars">
                <div class="h-item">
                  <div class="h-info">
                    <span>{{ $t('tracking.needs') }}</span>
                    <span class="h-pct">{{ distribution.needs.pct }}%</span>
                  </div>
                  <div class="h-bar"><div class="h-fill needs-fill" :style="{ width: distribution.needs.pct + '%' }"></div></div>
                </div>
                <div class="h-item">
                  <div class="h-info">
                    <span>{{ $t('tracking.wants') }}</span>
                    <span class="h-pct">{{ distribution.wants.pct }}%</span>
                  </div>
                  <div class="h-bar"><div class="h-fill wants-fill" :style="{ width: distribution.wants.pct + '%' }"></div></div>
                </div>
                <div class="h-item">
                  <div class="h-info">
                    <span>{{ $t('tracking.savings') }}</span>
                    <span class="h-pct">{{ distribution.savings.pct }}%</span>
                  </div>
                  <div class="h-bar"><div class="h-fill savings-fill" :style="{ width: distribution.savings.pct + '%' }"></div></div>
                </div>
              </div>
            </div>

            <div class="breakdown-wrap">
              <h3 class="s-title">{{ $t('tracking.category_breakdown') }}</h3>
              
              <!-- Necesidades Section -->
              <div class="breakdown-group">
                <h4 class="g-title"><span class="dot blue-dot"></span> {{ $t('tracking.needs') }}</h4>
                <div class="dist-grid">
                  <div v-for="cat in needsCategories" :key="cat.category" class="dist-card">
                    <div class="dist-header">
                      <span class="dist-dot" :style="{ background: getCategoryColor(cat.category) }"></span>
                      <span class="dist-name">{{ translateCategory(cat.category) }}</span>
                    </div>
                    <div class="dist-body">
                      <span class="dist-value">{{ fmt(cat.budget_limit) }}</span>
                      <span class="dist-pct">{{ getWeightPct(cat.budget_limit) }}%</span>
                    </div>
                    <div class="dist-bar">
                      <div class="dist-fill" :style="{ width: getWeightPct(cat.budget_limit) + '%', background: getCategoryColor(cat.category) }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Deseos Section -->
              <div class="breakdown-group">
                <h4 class="g-title"><span class="dot gold-dot"></span> {{ $t('tracking.wants') }}</h4>
                <div class="dist-grid">
                  <div v-for="cat in wantsCategories" :key="cat.category" class="dist-card">
                    <div class="dist-header">
                      <span class="dist-dot" :style="{ background: getCategoryColor(cat.category) }"></span>
                      <span class="dist-name">{{ translateCategory(cat.category) }}</span>
                    </div>
                    <div class="dist-body">
                      <span class="dist-value">{{ fmt(cat.budget_limit) }}</span>
                      <span class="dist-pct">{{ getWeightPct(cat.budget_limit) }}%</span>
                    </div>
                    <div class="dist-bar">
                      <div class="dist-fill" :style="{ width: getWeightPct(cat.budget_limit) + '%', background: getCategoryColor(cat.category) }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Otros Section -->
              <div class="breakdown-group" v-if="otrosCategories.length > 0">
                <h4 class="g-title"><span class="dot" style="background:#9E9E9E"></span> Otros</h4>
                <div class="dist-grid">
                  <div v-for="cat in otrosCategories" :key="cat.category" class="dist-card">
                    <div class="dist-header">
                      <span class="dist-dot" :style="{ background: getCategoryColor(cat.category) }"></span>
                      <span class="dist-name">{{ translateCategory(cat.category) }}</span>
                    </div>
                    <div class="dist-body">
                      <span class="dist-value">{{ fmt(cat.budget_limit) }}</span>
                      <span class="dist-pct">{{ getWeightPct(cat.budget_limit) }}%</span>
                    </div>
                    <div class="dist-bar">
                      <div class="dist-fill" :style="{ width: getWeightPct(cat.budget_limit) + '%', background: getCategoryColor(cat.category) }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Global Comparison Section -->
            <div class="comparison-section" v-if="globalComparison.length > 0">
              <h3 class="s-title">Resumen Global vs Mes Anterior</h3>
              <div class="comp-grid">
                <div v-for="item in globalComparison" :key="item.label" class="comp-card global-comp">
                  <div class="comp-header">
                    <span class="comp-name">{{ item.label }}</span>
                    <span :class="['comp-badge', getVariationClass(item)]">
                      {{ item.variation > 0 ? '▲' : '▼' }} {{ Math.abs(item.variation).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="comp-body">
                    <div class="comp-val-group">
                      <span class="v-label">{{ $t('tracking.this_month') }}</span>
                      <span class="v-curr" :style="{ color: item.color }">{{ fmt(item.current) }}</span>
                    </div>
                    <div class="comp-val-group">
                      <span class="v-label">{{ $t('tracking.prev_month') }}</span>
                      <span class="v-prev">{{ fmt(item.previous) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Category Comparison Section -->
            <div class="comparison-section" v-if="trackingStore.comparisonData.length > 0">
              <h3 class="s-title">{{ $t('tracking.comparison_prev') }} (Por Categoría)</h3>
              
              <!-- Necesidades Comparison -->
              <div class="comparison-group" v-if="comparisonByGroup.necesidad.length > 0">
                <h4 class="g-title"><span class="dot blue-dot"></span> {{ $t('tracking.needs') }}</h4>
                <div class="comp-grid">
                  <div v-for="item in comparisonByGroup.necesidad" :key="item.category" class="comp-card">
                    <div class="comp-header">
                      <span class="comp-name">{{ translateCategory(item.category) }}</span>
                      <span :class="['comp-badge', item.variation > 0 ? 'b-up' : 'b-down']">
                        {{ item.variation > 0 ? '▲' : '▼' }} {{ Math.abs(item.variation).toFixed(1) }}%
                      </span>
                    </div>
                    <div class="comp-body">
                      <div class="comp-val-group">
                        <span class="v-label">{{ $t('tracking.this_month') }}</span>
                        <span class="v-curr">{{ fmt(item.current) }}</span>
                      </div>
                      <div class="comp-val-group">
                        <span class="v-label">{{ $t('tracking.prev_month') }}</span>
                        <span class="v-prev">{{ fmt(item.previous) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Deseos Comparison -->
              <div class="comparison-group" v-if="comparisonByGroup.deseo.length > 0">
                <h4 class="g-title"><span class="dot gold-dot"></span> {{ $t('tracking.wants') }}</h4>
                <div class="comp-grid">
                  <div v-for="item in comparisonByGroup.deseo" :key="item.category" class="comp-card">
                    <div class="comp-header">
                      <span class="comp-name">{{ translateCategory(item.category) }}</span>
                      <span :class="['comp-badge', item.variation > 0 ? 'b-up' : 'b-down']">
                        {{ item.variation > 0 ? '▲' : '▼' }} {{ Math.abs(item.variation).toFixed(1) }}%
                      </span>
                    </div>
                    <div class="comp-body">
                      <div class="comp-val-group">
                        <span class="v-label">{{ $t('tracking.this_month') }}</span>
                        <span class="v-curr">{{ fmt(item.current) }}</span>
                      </div>
                      <div class="comp-val-group">
                        <span class="v-label">{{ $t('tracking.prev_month') }}</span>
                        <span class="v-prev">{{ fmt(item.previous) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- Empty State -->
        <section v-else class="empty-state">
          <div class="e-icon">🔍</div>
          <h3>{{ $t('tracking.no_data') }}</h3>
          <p>{{ $t('tracking.select_month') }}</p>
        </section>

        <!-- ── MODAL DE CONFIRMACIÓN ── -->
        <ConfirmModal
          :show="showModal"
          :title="modalType === 'close' ? 'Cerrar Mes' : 'Reabrir Mes'"
          :message="modalType === 'close' 
            ? '¿Estás seguro de cerrar el mes? Se guardará una foto fija de tu presupuesto y gastos actuales.' 
            : '¿Estás seguro de reabrir el mes? Podrás volver a cerrarlo después de hacer cambios.'"
          :icon="modalType === 'close' ? '🔒' : '🔓'"
          @confirm="onConfirmModal"
          @cancel="showModal = false"
        />

      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useTrackingStore } from '../store/tracking';
import { useFinanceStore } from '../store/finance';
import { useAuthStore } from '../store/auth';
import Topbar from '../components/layout/Topbar.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import TourGuide from '../components/TourGuide.vue';

const trackingStore = useTrackingStore();
const financeStore = useFinanceStore();

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const closing = ref(false);
const isLoading = ref(true);
const successMsg = ref('');

// ── Modal State ──
const showModal = ref(false);
const modalType = ref(''); // 'close' or 'reopen'

// ── Lifecycle ──
onMounted(async () => {
  isLoading.value = true;
  financeStore.initBudget();
  
  try {
    // Asegurar que tenemos las deudas cargadas para el snapshot
    // y traer el historial y el tracking en paralelo
    await Promise.all([
      financeStore.debts.length === 0 ? financeStore.fetchDebts() : Promise.resolve(),
      trackingStore.fetchHistory(trackingStore.selectedYear),
      trackingStore.fetchTracking(trackingStore.selectedYear, trackingStore.selectedMonth)
    ]);
  } catch (err) {
    console.error('[MonthlyTracking] Error during mount:', err);
  } finally {
    isLoading.value = false;
  }
});

// ── Methods ──
function changeYear(delta) {
  const newYear = trackingStore.selectedYear + delta;
  trackingStore.setYear(newYear);
}

const selectMonth = (m) => {
  trackingStore.selectedMonth = m;
  trackingStore.fetchTracking(trackingStore.selectedYear, m);
};

const calculateMonthScore = (data) => {
  if (!data || !data.income) return 0;
  const net = data.income;

  // 1. Vector: Vivienda (35%)
  // Intentamos sacar solo vivienda + suministros si hay categorías, si no, estimamos un % de las necesidades
  let fixedExpenses = 0;
  if (data.categories && data.categories.length > 0) {
    fixedExpenses = data.categories
      .filter(c => ['housing', 'utilities', 'vivienda', 'suministros'].includes(c.category.toLowerCase()))
      .reduce((acc, c) => acc + (c.actual_amount || c.budget_limit), 0);
  } else {
    // Si no hay categorías, estimamos que vivienda es el 60% de las necesidades (ajuste para no penalizar)
    fixedExpenses = data.needs * 0.6;
  }

  const fixedPct = (fixedExpenses / net) * 100;
  let housingScore = 0;
  if (fixedPct <= 30) housingScore = 35;
  else if (fixedPct < 50) housingScore = 35 * (1 - (fixedPct - 30) / 20);

  // 2. Vector: Ahorro (40%)
  const savingsPct = (data.savings / net) * 100;
  let savingsScore = Math.min(40, (savingsPct / 20) * 40);

  // 3. Vector: Ocio (15%)
  const desiresPct = (data.wants / net) * 100;
  let controlScore = 0;
  if (desiresPct <= 20) controlScore = 15;
  else if (desiresPct < 40) controlScore = 15 * (1 - (desiresPct - 20) / 20);

  // 4. Vector: Seguridad (10%) - Usamos el estado actual del usuario
  const authStore = useAuthStore();
  let safetyScore = 0;
  if (authStore.user?.has_emergency_fund) safetyScore += 6;
  if (authStore.user?.stable_job) safetyScore += 4;

  const total = housingScore + savingsScore + controlScore + safetyScore;
  return Math.max(0, Math.min(100, Math.round(total)));
};

function isCurrentMonth(m) {
  return trackingStore.selectedYear === currentYear && m === currentMonth;
}

function isFutureMonth(m) {
  if (trackingStore.selectedYear > currentYear) return true;
  if (trackingStore.selectedYear === currentYear && m > currentMonth) return true;
  return false;
}

function isClosed(m) {
  return !!getHistoryForMonth(m);
}

function getHistoryForMonth(m) {
  return trackingStore.historyMap[m] || null;
}

function getMonthStatus(m) {
  if (isClosed(m)) return `status-${getHistoryForMonth(m).status}`;
  if (isCurrentMonth(m)) return 'status-open';
  return 'status-empty';
}

function getStatusIcon(m) {
  const h = getHistoryForMonth(m);
  if (h) {
    if (h.status === 'danger') return '🔴';
    if (h.status === 'warning') return '🟡';
    return '✅';
  }
  if (isCurrentMonth(m)) return '🔵';
  return '';
}

function handleCloseMonth() {
  modalType.value = 'close';
  showModal.value = true;
}

function handleReopenMonth() {
  modalType.value = 'reopen';
  showModal.value = true;
}

async function onConfirmModal() {
  showModal.value = false;
  closing.value = true;
  trackingStore.error = null;
  successMsg.value = '';
  
  try {
    if (modalType.value === 'close') {
      await trackingStore.closeMonth(trackingStore.selectedYear, trackingStore.selectedMonth);
      if (!trackingStore.error) {
        successMsg.value = '¡Mes cerrado y guardado con éxito!';
      }
    } else {
      await trackingStore.reopenMonth(trackingStore.selectedYear, trackingStore.selectedMonth);
      successMsg.value = 'Mes reabierto correctamente.';
    }
    setTimeout(() => { successMsg.value = ''; }, 4000);
  } catch (err) {
    console.error('Action error:', err);
  } finally {
    closing.value = false;
  }
}

// ── Formatting ──
const fmt = (val) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

const CAT_LABELS = {
  Housing:   'Vivienda',
  Utilities: 'Suministros',
  housing:   'Vivienda',
  utilities: 'Suministros',
  food:      'Alimentación',
  transport: 'Transporte',
  leisure:   'Ocio',
  salary:    'Ingresos',
};
function translateCategory(cat) {
  if (!cat) return 'Desconocido';
  const low = cat.toLowerCase();
  return CAT_LABELS[low] || cat;
}

const getCategoryColor = (cat) => {
  if (!cat) return '#3a3a5c';
  const colors = {
    housing: '#3b82f6',
    utilities: '#9E9E9E',
    food: '#00C805',
    transport: '#00C805',
    leisure: '#fcd34d'
  };
  return colors[cat.toLowerCase()] || '#3a3a5c';
};

const getWeightPct = (val) => {
  if (!trackingStore.totalBudget) return 0;
  return Math.round((val / trackingStore.totalBudget) * 100);
};

const distribution = computed(() => {
  const income = trackingStore.data?.income || financeStore.netIncome || 0;
  if (!income) return { needs: { pct: 0 }, wants: { pct: 0 }, savings: { pct: 0 } };

  const categories = trackingStore.data?.categories || [];
  const source = categories.length > 0 ? categories : financeStore.budgetItems;

  const needs = source
    .filter(c => c.type === 'necesidad' || c.category_type === 'necesidad')
    .reduce((sum, c) => sum + (c.budget_limit || c.amount || 0), 0);
    
  const wants = source
    .filter(c => c.type === 'deseo' || c.category_type === 'deseo')
    .reduce((sum, c) => sum + (c.budget_limit || c.amount || 0), 0);

  const savings = trackingStore.data?.savings || financeStore.ahorroAmount || 0;

  return {
    needs: { pct: Math.round((needs / income) * 100) },
    wants: { pct: Math.round((wants / income) * 100) },
    savings: { pct: Math.round((savings / income) * 100) }
  };
});

const needsCategories = computed(() => {
  const categories = trackingStore.data?.categories || [];
  const source = categories.length > 0 ? categories : financeStore.budgetItems;
  return source.filter(c => c.type === 'necesidad' || c.category_type === 'necesidad');
});

const wantsCategories = computed(() => {
  const categories = trackingStore.data?.categories || [];
  const source = categories.length > 0 ? categories : financeStore.budgetItems;
  return source.filter(c => c.type === 'deseo' || c.category_type === 'deseo');
});

const otrosCategories = computed(() => {
  const categories = trackingStore.data?.categories || [];
  const source = categories.length > 0 ? categories : financeStore.budgetItems;
  return source.filter(c => c.type !== 'necesidad' && c.category_type !== 'necesidad' && c.type !== 'deseo' && c.category_type !== 'deseo');
});

const comparisonByGroup = computed(() => {
  const groups = { necesidad: [], deseo: [], otros: [] };
  trackingStore.comparisonData.forEach(item => {
    const type = item.type === 'necesidad' ? 'necesidad' : (item.type === 'deseo' ? 'deseo' : 'otros');
    groups[type].push(item);
  });
  return groups;
});

const globalComparison = computed(() => {
  const d = trackingStore.data;
  if (!d || d.prev_income === undefined) return [];

  const metrics = [
    { label: 'Ingresos', current: d.income, previous: d.prev_income, color: '#00C805', type: 'positive' },
    { label: 'Gastos Totales', current: d.totalBudget, previous: d.prev_total_budget, color: '#ff4d4f', type: 'negative' },
    { label: 'Ahorro Mensual', current: d.savings, previous: d.prev_savings, color: '#3b82f6', type: 'positive' },
    { label: 'Deuda Total', current: d.totalDebt, previous: d.prev_total_debt, color: '#fcd34d', type: 'negative' }
  ];

  return metrics.map(m => {
    const variation = m.previous > 0 ? ((m.current - m.previous) / m.previous) * 100 : 0;
    return { ...m, variation };
  }).filter(m => m.previous > 0);
});

const getVariationClass = (item) => {
  const v = item.variation;
  if (v === 0) return 'b-neutral';
  
  if (item.type === 'positive') {
    return v > 0 ? 'b-up-good' : 'b-down-bad';
  } else {
    // Para gastos/deuda, subir es malo, bajar es bueno
    return v > 0 ? 'b-up-bad' : 'b-down-good';
  }
};

const globalBarClass = computed(() => {
  const p = trackingStore.globalPct;
  if (p >= 100) return 'fill-danger';
  if (p >= 80)  return 'fill-warning';
  return 'fill-ok';
});
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  color: #E0E0E0;
  font-family: 'Inter', sans-serif;
}

.main-content {
  padding-top: 140px;
  padding-bottom: 4rem;
  width: 100%;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 0 2rem 5rem;
}

/* ── Notifications ── */
.alert-banner {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  animation: slideDown 0.3s ease;
}

.alert-banner.error {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.3);
}

.alert-banner.success {
  background: rgba(0, 200, 5, 0.1);
  color: #00C805;
  border: 1px solid rgba(0, 200, 5, 0.3);
}

.close-alert {
  margin-left: auto;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── View Header ── */
.unified-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.year-selector {
  display: flex;
  align-items: center;
  background: var(--bg-panel);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem 1.2rem;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.year-btn {
  background: transparent; border: none; color: #9E9E9E;
  font-size: 1.5rem; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 50%;
}
.year-btn:hover:not(:disabled) { color: var(--color-primary); background: rgba(255,255,255,0.05); }
.year-btn:disabled { opacity: 0.1; cursor: default; }
.year-label { font-weight: 800; color: #fff; font-size: 1.2rem; font-family: monospace; }

/* ── Calendar Heatmap ── */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.month-card {
  background: var(--bg-panel);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px; /* Altura unificada */
}

.month-card:hover { transform: translateY(-4px); border-color: #0052FF; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
.month-card.is-active { border-color: #0052FF; background: rgba(0, 82, 255, 0.1); }

.month-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.m-name { font-weight: 700; color: #fff; text-transform: capitalize; }
.score-wrap { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 0.4rem; }
.m-score { font-size: 1.6rem; font-weight: 900; color: #fff; }
.m-score-label { font-size: 0.6rem; font-weight: 800; color: #666; text-transform: uppercase; }

.mini-bar { width: 100%; height: 4px; background: #3a3a5c; border-radius: 2px; overflow: hidden; }
.mini-fill { height: 100%; transition: width 0.5s; background: #3b82f6; }

/* Status Colors */
.status-ok .m-score { color: #00C805; }
.status-ok .mini-fill { background: #00C805; }
.status-warning .m-score { color: #fcd34d; }
.status-warning .mini-fill { background: #fcd34d; }
.status-danger .m-score { color: #ff4d4f; }
.status-danger .mini-fill { background: #ff4d4f; }

.status-open { border: 2px dashed #0052FF; animation: pulse-blue 2s infinite; }
@keyframes pulse-blue {
  0% { box-shadow: 0 0 0 0 rgba(0, 82, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 82, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 82, 255, 0); }
}

.m-empty { color: #666; font-style: italic; font-size: 0.85rem; }

/* ── Detail Panel ── */
.detail-card {
  background: var(--bg-panel);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.d-title { font-size: 2.2rem; font-weight: 900; color: #fff; margin: 0; text-transform: capitalize; }
.d-badge {
  display: inline-block; padding: 0.3rem 0.8rem; border-radius: 8px;
  font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-top: 0.5rem;
}
.b-open { background: rgba(0, 82, 255, 0.2); color: #0052FF; border: 1px solid #0052FF; }
.b-closed { background: rgba(0, 200, 5, 0.1); color: #00C805; border: 1px solid #00C805; }

.btn-close-month {
  background: #0052FF; color: #fff; border: none;
  padding: 1rem 2rem; border-radius: 14px;
  font-weight: 800; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(0, 82, 255, 0.4);
}
.btn-close-month:hover { background: #0043D1; transform: translateY(-2px); }
.btn-close-month:active { transform: translateY(0); }

.btn-reopen {
  background: transparent;
  color: #9E9E9E;
  border: 1px solid #3a3a5c;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reopen:hover { border-color: #ff4d4f; color: #ff4d4f; background: rgba(255, 77, 79, 0.05); }

/* KPI Detail */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.2rem;
}

.kpi-card {
  background: #0F0F1A;
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid rgba(255,255,255,0.05);
}

.k-label { font-size: 0.8rem; color: #9E9E9E; text-transform: uppercase; font-weight: 700; }
.k-value { font-size: 1.8rem; font-weight: 900; color: #fff; }
.k-income { color: #00C805; }
.k-debt { color: #fcd34d; }
.k-savings { color: #00C805; text-decoration: underline; }

.k-main { background: #1a1a2e; border: 1px solid #3a3a5c; }

.fill-ok { background: #00C805; }
.fill-warning { background: #fcd34d; }
.fill-danger { background: #ff4d4f; }

.k-savings-acc {
  background: linear-gradient(135deg, rgba(0, 200, 5, 0.1) 0%, rgba(15, 15, 26, 1) 100%);
  border: 1px solid rgba(0, 200, 5, 0.2) !important;
}

/* Breakdown Distribution */
.breakdown-group { margin-top: 2rem; }
.g-title { 
  font-size: 0.9rem; font-weight: 800; color: #666; 
  text-transform: uppercase; margin-bottom: 1.2rem; 
  display: flex; align-items: center; gap: 0.5rem;
}
.dot { width: 6px; height: 6px; border-radius: 50%; }
.blue-dot { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
.gold-dot { background: #fcd34d; box-shadow: 0 0 10px #fcd34d; }

.dist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
}

.dist-card {
  background: #0F0F1A;
  padding: 1.2rem;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.03);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: transform 0.2s;
}
.dist-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.1); }

.dist-header { display: flex; align-items: center; gap: 0.6rem; }
.dist-dot { width: 8px; height: 8px; border-radius: 50%; }
.dist-name { font-weight: 700; color: #9E9E9E; font-size: 0.9rem; text-transform: uppercase; }

.dist-body { display: flex; justify-content: space-between; align-items: baseline; }
.dist-value { font-size: 1.4rem; font-weight: 900; color: #fff; }
.dist-pct { font-size: 0.85rem; font-weight: 700; color: #666; }

.dist-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.dist-fill { height: 100%; border-radius: 3px; opacity: 0.8; }

/* Financial Health */
.health-wrap { background: #0F0F1A; padding: 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.03); }
.health-bars { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 1.5rem; }
.h-item { display: flex; flex-direction: column; gap: 0.8rem; }
.h-info { display: flex; justify-content: space-between; font-weight: 700; color: #9E9E9E; text-transform: uppercase; font-size: 0.8rem; }
.h-pct { color: #fff; font-size: 1rem; }
.h-bar { width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; }
.h-fill { height: 100%; border-radius: 5px; }
.needs-fill { background: #3b82f6; }
.wants-fill { background: #fcd34d; }
.savings-fill { background: #00C805; }

/* Comparison Grid */
.comp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.comparison-group {
  margin-bottom: 2rem;
}
.comparison-group .g-title {
  margin-bottom: 0.8rem;
}

.comp-card {
  background: var(--bg-panel);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.comp-header { display: flex; justify-content: space-between; align-items: center; }
.comp-name { font-weight: 800; color: #fff; font-size: 1rem; }

.comp-badge {
  padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.75rem; font-weight: 800;
}
.b-up { background: rgba(255, 77, 79, 0.1); color: #ff4d4f; }
.b-down { background: rgba(0, 200, 5, 0.1); color: #00C805; }

/* Nuevas clases de variación semántica */
.b-up-good { background: rgba(0, 200, 5, 0.1); color: #00C805; }
.b-down-good { background: rgba(0, 200, 5, 0.1); color: #00C805; }
.b-up-bad { background: rgba(255, 77, 79, 0.1); color: #ff4d4f; }
.b-down-bad { background: rgba(255, 77, 79, 0.1); color: #ff4d4f; }
.b-neutral { background: rgba(255, 255, 255, 0.05); color: #9E9E9E; }

.global-comp {
  border-left: 4px solid var(--color-primary);
}

.comp-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.comp-val-group { display: flex; flex-direction: column; gap: 0.3rem; }
.v-label { font-size: 0.7rem; color: #666; text-transform: uppercase; font-weight: 700; }
.v-curr { font-size: 1.2rem; font-weight: 900; color: #fff; }
.v-prev { font-size: 1.1rem; font-weight: 700; color: #9E9E9E; }

/* ── Loading Overlay ── */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: var(--bg-panel);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  gap: 1.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.8rem;
}
</style>
