<template>
  <div class="dashboard-layout">
    <Sidebar />
    <main class="main-content">
      <Topbar />

      <div class="dashboard-container">
        <div class="previsions-section">

          <!-- Header -->
          <div class="section-header">
            <h2>Previsiones Analíticas</h2>
            <p class="subtitle">HUD_PROYECCION: ACTIVO // RUTA OPTIMA CALCULADA</p>
          </div>



          <!-- Middle Row: Chart -->
          <div class="middle-blocks">
            <!-- Scissors Chart Panel -->
            <div class="panel prediction-panel">
              <div class="panel-header">
                <h3 class="with-icon">
                  <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                  Gráfico de Tijera (Deuda vs Ahorro)
                </h3>
              </div>
              <p class="panel-subtitle" style="display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.5rem;">
                <span>Cap. de ahorro mensual: <b class="highlight-green">{{ ahorroMonthly }}€</b> · Deuda total: <b class="highlight-red">{{ totalDebtComputed }}€</b></span>
                <span style="font-size: 0.75rem; color: #7a7a9c;">*Asigna qué porcentaje de tu capacidad de ahorro destinarás a pagar las deudas.</span>
              </p>
              <div class="chart-controls">
                <div class="control-col slider-col">
                  <div class="control-labels">
                    <span><b style="color:#FF6B6B">{{ debtAllocation }}%</b> a Deuda</span>
                    <span><b style="color:#00C805">{{ 100 - debtAllocation }}%</b> a Ahorro</span>
                  </div>
                  <input type="range" min="0" max="100" step="5" v-model.number="debtAllocation" class="allocation-slider" />
                </div>
                <div class="control-col date-col">
                  <div class="control-labels">
                    <span>
                      <svg viewBox="0 0 24 24" class="icon" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;color:#9E9E9E;"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
                      Periodo de la gráfica
                    </span>
                  </div>
                  <div style="display:flex; gap:0.5rem; align-items:center;">
                    <input type="month" v-model="projectionStart" class="months-select" style="width:160px;" />
                    <span style="color:#9E9E9E;font-weight:bold;">-</span>
                    <input type="month" v-model="projectionEnd" class="months-select" style="width:160px;" />
                  </div>
                </div>
              </div>
              <div class="scissors-chart">
                <VueApexCharts v-if="chartReady" type="line" height="100%" width="100%" :options="chartOptions" :series="chartSeries" />
                <div v-else class="chart-empty">
                  <svg viewBox="0 0 24 24" class="empty-icon"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                  <p>Añade deudas en el panel superior para ver la proyección</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Timeline -->
          <div class="bottom-blocks">
            <!-- Milestones Timeline -->
            <div class="panel timeline-panel">
              <h3 class="with-icon" style="margin-bottom: 2rem;">
                <svg viewBox="0 0 24 24" class="icon" style="color: #fcd34d;"><path fill="currentColor" d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
                Línea de Tiempo de Hitos (Seguimiento Activo)
              </h3>
              <div class="timeline-empty" v-if="milestones.length === 0">
                <p>Los hitos se generarán automáticamente cuando añadas deudas.</p>
              </div>
              <div class="timeline" v-else>
                <div class="timeline-item" v-for="milestone in milestones" :key="milestone.id">
                  <div class="timeline-marker" :class="{ 'marker-completed': milestone.status === 'completed' }"></div>
                  <div class="timeline-content" :class="{ 'content-completed': milestone.status === 'completed' }">
                    <div class="milestone-text">
                      <div class="milestone-month">MES {{ milestone.month }}</div>
                      <div class="milestone-title">{{ milestone.title }}</div>
                    </div>
                    <div class="milestone-icon" v-if="milestone.icon === 'check'">
                      <svg viewBox="0 0 24 24" class="icon-success"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </div>
                    <div class="milestone-icon" v-if="milestone.icon === 'car'">
                      <svg viewBox="0 0 24 24" class="icon-warning"><path fill="currentColor" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                    </div>
                    <div class="milestone-icon" v-if="milestone.icon === 'house'">
                      <svg viewBox="0 0 24 24" class="icon-brand"><path fill="currentColor" d="M12 3l10 9h-3v8h-6v-6h-2v6H5v-8H2l10-9z"/></svg>
                    </div>
                    <div class="milestone-status" v-if="milestone.status !== 'completed'">
                      <button class="btn-action">Marcar Conseguido</button>
                    </div>
                  </div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../store/auth';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar.vue';
import Topbar from '../components/layout/Topbar.vue';
import VueApexCharts from 'vue3-apexcharts';

const authStore = useAuthStore();
const user = authStore.user || {};
const token = authStore.token;

const netIncome = parseFloat(user.net_monthly_income) || 2000;

// Debt state (read-only for charts)
const debts = ref([]);
const loadingDebt = ref(false);

// Chart state
const chartSeries = ref([]);
const chartReady = ref(false);
const ahorroMonthly = ref(0);
const milestones = ref([]);
const debtAllocation = ref(50);
const sumExpenses = ref(0);
const currentSavings = ref(parseFloat(localStorage.getItem('finlogic_current_savings_' + user.id)) || 0);

const targetSavings = computed(() => sumExpenses.value * 3);
const cushionMonths = computed(() => {
  if (sumExpenses.value <= 0) return 0;
  return (currentSavings.value / sumExpenses.value).toFixed(1);
});

watch(currentSavings, (val) => {
  localStorage.setItem('finlogic_current_savings_' + user.id, val);
  recalcChart();
});

const currentD = new Date();
const startYr = currentD.getFullYear();
const startMo = String(currentD.getMonth() + 1).padStart(2, '0');
const projectionStart = ref(`${startYr}-${startMo}`);

const futureD = new Date();
futureD.setFullYear(startYr + 3);
const futureMo = String(futureD.getMonth() + 1).padStart(2, '0');
const projectionEnd = ref(`${futureD.getFullYear()}-${futureMo}`);

watch([debtAllocation, projectionStart, projectionEnd], () => recalcChart());

const totalDebtComputed = computed(() => {
  return Math.round(debts.value.reduce((sum, d) => sum + parseFloat(d.amount), 0));
});

const chartOptions = ref({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'monospace',
    foreColor: '#9E9E9E',
    animations: { enabled: false }
  },
  colors: ['#00C805', '#FF6B6B'],
  stroke: {
    width: [2.5, 2.5],
    curve: 'smooth',
    colors: ['#00C805', '#FF6B6B']
  },
  fill: {
    type: ['solid', 'solid'],
    opacity: [0.08, 0.08],
  },
  xaxis: {
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    grid: { color: '#3a3a5c' }
  },
  yaxis: {
    labels: {
      formatter: (value) => value.toLocaleString('es-ES') + '€'
    }
  },
  grid: {
    borderColor: '#3a3a5c',
    strokeDashArray: 0,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: { colors: '#E0E0E0' }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => val.toLocaleString('es-ES') + '€'
    }
  },
  dataLabels: {
    enabled: false
  }
});

function recalcChart() {
  const total = totalDebtComputed.value;
  if (total <= 0) {
    chartReady.value = false;
    milestones.value = [{ id: 1, month: 2, title: 'Fondo de Seguridad Inicial: Completado', status: 'completed', icon: 'check' }];
    return;
  }

  const monthlyDebtPayment = Math.max(10, ahorroMonthly.value * (debtAllocation.value / 100));
  const monthlySavings = Math.max(0, ahorroMonthly.value - monthlyDebtPayment);

  const labels = [];
  const deudaData = [];
  const ahorroData = [];
  let debtRemaining = total;
  let accumulatedSavings = currentSavings.value || 0;
  let crossingMonth = null;
  
  const dStart = new Date(projectionStart.value || new Date());
  const dEnd = new Date(projectionEnd.value || new Date());
  let MONTHS = (dEnd.getFullYear() - dStart.getFullYear()) * 12 + (dEnd.getMonth() - dStart.getMonth());
  if (MONTHS < 1) MONTHS = 1;
  if (MONTHS > 360) MONTHS = 360;

  const formatMonth = (date) => {
    return date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
  };

  labels.push(formatMonth(dStart));
  deudaData.push(Math.round(debtRemaining));
  ahorroData.push(Math.round(accumulatedSavings));

  for (let m = 1; m <= MONTHS; m++) {
    const currentM = new Date(dStart.getFullYear(), dStart.getMonth() + m, 1);
    labels.push(formatMonth(currentM));
    debtRemaining = Math.max(0, debtRemaining - monthlyDebtPayment);
    accumulatedSavings += (debtRemaining === 0 ? ahorroMonthly.value : monthlySavings);
    deudaData.push(Math.round(debtRemaining));
    ahorroData.push(Math.round(accumulatedSavings));
    if (crossingMonth === null && accumulatedSavings >= debtRemaining) crossingMonth = m;
  }

  chartSeries.value = [
    {
      name: 'Ahorro Acumulado',
      type: 'area',
      data: ahorroData
    },
    {
      name: 'Deuda Restante',
      type: 'area',
      data: deudaData
    }
  ];

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: labels
    }
  };
  chartReady.value = true;

  // Milestones
  const newMilestones = [
    { id: 1, month: 2, title: 'Fondo de Seguridad Inicial: Completado', status: 'completed', icon: 'check' }
  ];
  if (crossingMonth) {
    newMilestones.push({ id: 2, month: crossingMonth, title: 'Libertad Financiera (Ahorro supera Deuda)', status: 'future', icon: 'house' });
  }
  const zeroDebtMonth = deudaData.findIndex(d => d === 0);
  if (zeroDebtMonth > 0 && zeroDebtMonth <= MONTHS) {
    newMilestones.push({ id: 3, month: zeroDebtMonth, title: 'Liquidación Total de Deuda', status: 'future', icon: 'car' });
  }
  milestones.value = newMilestones;
}

// Watch deudas para recalcular chart en tiempo real
watch(debts, () => recalcChart(), { deep: true });

// API calls
async function fetchDebts() {
  try {
    const { data } = await api.get('/debts');
    debts.value = data.debts || [];
  } catch (e) {
    console.error('Error fetching debts', e);
  }
}



onMounted(async () => {
  // Calculate savings
  const savedBudget = localStorage.getItem('finlogic_custom_budget_' + user.id);
  let expenses = 0;
  if (savedBudget) {
    const items = JSON.parse(savedBudget);
    expenses = items.reduce((acc, i) => acc + i.amount, 0);
  } else {
    expenses = (parseFloat(user.housing) || 600) + (parseFloat(user.utilities) || 150) + 350 + 150 + 200;
  }
  sumExpenses.value = expenses;
  ahorroMonthly.value = Math.max(0, netIncome - expenses);

  await fetchDebts();
  recalcChart();
});
</script>

<style scoped>
.dashboard-layout { display: flex; height: 100vh; background-color: var(--bg-base); font-family: 'Inter', sans-serif; color: var(--text-main); }
.main-content { flex: 1; padding: 2rem; overflow-y: auto; background: var(--bg-base); }
.dashboard-container { max-width: 1300px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }

.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem 2rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.with-icon { display: flex; align-items: center; gap: 0.6rem; margin: 0 0 1.25rem 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; }
.with-icon .icon { width: 16px; height: 16px; color: var(--color-primary); }

.previsions-section { display: flex; flex-direction: column; gap: 2rem; }
.section-header { display: flex; flex-direction: column; gap: 0.4rem; }
.section-header h2 { margin: 0; font-size: 1.8rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.5px; }
.section-header .subtitle { margin: 0; font-size: 0.78rem; font-family: monospace; color: var(--text-muted); letter-spacing: 1.2px; }

/* Layout Rows */
.top-blocks { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; align-items: start; }
@media (max-width: 900px) { .top-blocks { grid-template-columns: 1fr; } }
.middle-blocks { display: flex; flex-direction: column; margin-bottom: 1.5rem; }
.bottom-blocks { display: flex; flex-direction: column; margin-bottom: 1.5rem; }

/* Emergency Fund Panel */
.emergency-fund-panel { display: flex; flex-direction: column; height: 100%; }
.ef-content { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem; }
.ef-summary { display: flex; justify-content: space-between; align-items: center; background: rgba(0, 200, 5, 0.05); border: 1px solid rgba(0, 200, 5, 0.15); border-radius: 8px; padding: 1.2rem; }
.ef-label { font-size: 0.8rem; font-family: monospace; letter-spacing: 1px; color: var(--text-muted); font-weight: 700; }
.ef-input-group { display: flex; align-items: center; gap: 0.5rem; }
.ef-input { font-size: 1.8rem; font-weight: 700; color: var(--color-success); width: 140px; text-align: right; background: transparent; border: none; border-bottom: 1px dashed rgba(0, 200, 5, 0.5); border-radius: 0; padding: 0 0 0.2rem 0; box-shadow: none; }
.ef-input:focus { border-bottom: 1px solid var(--color-success); outline: none; background: transparent; }
.ef-unit { font-size: 1.8rem; font-weight: 700; color: var(--color-success); }

.ef-progress-container { display: flex; flex-direction: column; gap: 0.5rem; padding: 0 0.5rem; }
.ef-progress-bar { height: 12px; background: var(--border-color); border-radius: 6px; overflow: hidden; }
.ef-progress-fill { height: 100%; background: var(--color-success); border-radius: 6px; transition: width 0.3s ease; }
.ef-progress-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-family: monospace; color: var(--text-muted); }
.ef-message { font-size: 0.95rem; color: var(--text-main); line-height: 1.6; margin: 0; padding: 1rem; background: rgba(37, 37, 64, 0.5); border-radius: 8px; text-align: center; }

/* Chart */
.prediction-panel { display: flex; flex-direction: column; }
.panel-subtitle { color: var(--text-muted); font-size: 0.85rem; margin: 0 0 1.5rem 0; }
.highlight-green { color: var(--color-success); }
.highlight-red { color: var(--color-danger); }
.scissors-chart { height: 320px; position: relative; }
.chart-empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); text-align: center; }
.chart-empty .empty-icon { width: 40px; height: 40px; opacity: 0.3; }
.chart-empty p { font-size: 0.9rem; max-width: 280px; line-height: 1.5; }

.chart-controls { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; padding: 1.2rem; background: rgba(37, 37, 64, 0.4); border: 1px dashed var(--border-color); border-radius: 8px; }
.control-col { display: flex; flex-direction: column; gap: 0.6rem; }
.slider-col { flex: 1; }
.date-col { width: 350px; }
.control-labels { display: flex; justify-content: space-between; font-size: 0.8rem; font-family: monospace; color: var(--text-muted); }
.allocation-slider { width: 100%; accent-color: var(--color-danger); cursor: pointer; margin-top: 5px; }
.months-select { background: var(--border-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.35rem 0.5rem; color: var(--text-main); font-family: 'Inter', sans-serif; font-size: 0.85rem; outline: none; cursor: pointer; }

/* Debt panel */
.debt-panel { display: flex; flex-direction: column; gap: 0; }

.debt-summary { display: flex; justify-content: space-between; align-items: center; background: rgba(252, 165, 165, 0.05); border: 1px solid rgba(252, 165, 165, 0.15); border-radius: 8px; padding: 0.8rem 1rem; margin-bottom: 1.2rem; }
.debt-total { display: flex; flex-direction: column; gap: 0.15rem; }
.dt-label { font-size: 0.7rem; font-family: monospace; letter-spacing: 1px; color: var(--text-muted); }
.dt-value { font-size: 1.5rem; font-weight: 700; color: var(--color-danger); letter-spacing: -0.5px; }
.debt-count { font-size: 0.78rem; font-family: monospace; color: var(--text-muted); }

.debt-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem; max-height: 200px; overflow-y: auto; }
.debt-item { display: flex; align-items: center; justify-content: space-between; background: var(--border-color); border-radius: 6px; padding: 0.7rem 0.8rem; border: 1px solid var(--border-color); transition: border-color 0.2s; }
.debt-item:hover { border-color: var(--border-color); }
.debt-info { display: flex; justify-content: space-between; flex: 1; gap: 1rem; align-items: center; }
.debt-name { font-size: 0.88rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.debt-amount { font-size: 0.88rem; font-family: monospace; color: var(--color-danger); font-weight: 600; white-space: nowrap; }
.btn-remove { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem; display: flex; transition: color 0.2s; flex-shrink: 0; }
.btn-remove:hover:not(:disabled) { color: #FF3B30; }
.btn-remove .icon { width: 16px; height: 16px; }
.btn-remove:disabled { opacity: 0.4; cursor: not-allowed; }

.debt-empty { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.2rem; padding: 1.5rem 0; border: 1px dashed var(--border-color); border-radius: 8px; }

.add-debt-form { display: flex; flex-direction: column; gap: 0.7rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem; }
.form-row { display: flex; gap: 0.5rem; }
.input-field { flex: 1; background: var(--border-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.6rem 0.8rem; color: var(--text-main); font-size: 0.85rem; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; }
.input-field:focus { border-color: var(--color-primary); }
.input-field::placeholder { color: var(--text-muted); }
.input-amount { width: 90px; flex: none; }
.btn-add { background: var(--color-primary); color: #FFFFFF; border: none; border-radius: 6px; padding: 0.7rem 1rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; letter-spacing: 0.3px; }
.btn-add:hover:not(:disabled) { box-shadow: 0 0 12px rgba(0,82,255,0.4); background: #2563eb; }
.btn-add:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-add .icon { width: 16px; height: 16px; }
.error-msg { color: var(--color-danger); font-size: 0.8rem; font-family: monospace; margin: 0; }

/* Timeline */
.timeline-panel { padding: 2rem; }
.timeline-empty { color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1rem; font-family: monospace; }
.timeline { display: flex; flex-direction: column; gap: 1.5rem; position: relative; padding-left: 1rem; border-left: 2px solid var(--border-color); margin-left: 10px; }
.timeline-item { position: relative; }
.timeline-marker { position: absolute; left: -24px; top: 22px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--text-muted); background: var(--bg-panel); transition: all 0.3s; }
.timeline-marker.marker-completed { border-color: var(--color-success); background: var(--color-success); box-shadow: 0 0 8px rgba(0,255,102,0.4); }
.timeline-content { background: var(--border-color); border-radius: 8px; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-color); transition: border-color 0.3s; }
.timeline-content:hover { border-color: var(--border-color); }
.timeline-content.content-completed { border-color: rgba(0,255,102,0.2); background: rgba(0,255,102,0.02); }
.milestone-month { font-family: monospace; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem; letter-spacing: 1px; }
.milestone-title { font-size: 0.95rem; color: var(--text-main); font-weight: 500; }
.milestone-icon { flex-shrink: 0; margin-left: 1rem; }
.icon-success { width: 24px; height: 24px; color: var(--color-success); }
.icon-warning { width: 24px; height: 24px; color: #fcd34d; }
.icon-brand { width: 24px; height: 24px; color: var(--color-primary); }
.milestone-status { margin-left: auto; padding-left: 1rem; }
.btn-action { background: var(--border-color); border: 1px dashed var(--text-muted); color: var(--text-main); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-family: monospace; transition: all 0.2s; }
.btn-action:hover { border-color: #fcd34d; color: #fcd34d; background: rgba(252, 211, 77, 0.05); }

@media (max-width: 900px) {
  .top-row { grid-template-columns: 1fr; }
}
</style>
