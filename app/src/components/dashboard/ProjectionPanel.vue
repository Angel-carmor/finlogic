<template>
  <div class="panel projection-panel">
    <h3 class="with-icon">
      <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
      {{ $t('analytics.scissors_chart') }}
    </h3>
    
    <div class="financial-chart-box">
      <VueApexCharts v-if="chartReady" type="line" height="100%" width="100%" :options="chartOptions" :series="chartSeries" />
      <div v-else class="chart-empty" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-muted);">
        <svg viewBox="0 0 24 24" style="width:40px; height:40px; opacity:0.3; margin-bottom:1rem;"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        <p style="font-size:0.9rem;">{{ $t('analytics.empty_chart') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useFinanceStore } from '../../store/finance';
import { useI18n } from 'vue-i18n';
import VueApexCharts from 'vue3-apexcharts';
import api from '../../services/api';

const authStore = useAuthStore();
const financeStore = useFinanceStore();
const { t } = useI18n();

const debts = ref([]);
const chartReady = ref(false);
const chartSeries = ref([]);
const currentSavings = ref(parseFloat(localStorage.getItem('finlogic_current_savings_' + (authStore.user?.id || ''))) || 0);

const chartOptions = ref({
  chart: { type: 'line', toolbar: { show: false }, fontFamily: 'monospace', foreColor: 'var(--text-muted)', animations: { enabled: false } },
  colors: ['#00C805', '#FF6B6B'],
  stroke: { width: [2.5, 2.5], curve: 'smooth', colors: ['#00C805', '#FF6B6B'] },
  fill: { type: ['solid', 'solid'], opacity: [0.08, 0.08] },
  xaxis: { categories: [], axisBorder: { show: false }, axisTicks: { show: false }, grid: { color: 'var(--border-color)' } },
  yaxis: { labels: { formatter: (value) => value.toLocaleString('es-ES') + '€' } },
  grid: { borderColor: 'var(--border-color)', strokeDashArray: 0, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
  legend: { position: 'top', horizontalAlign: 'right', labels: { colors: 'var(--text-main)' } },
  tooltip: { theme: 'dark', y: { formatter: (val) => val.toLocaleString('es-ES') + '€' } },
  dataLabels: { enabled: false }
});

function recalcChart() {
  const total = financeStore.totalDebtComputed || 0;
  
  const monthlyDebtPayment = total > 0 ? Math.max(10, financeStore.ahorroAmount * 0.5) : 0;
  const monthlySavings = Math.max(0, financeStore.ahorroAmount - monthlyDebtPayment);
  
  const labels = [];
  const deudaData = [];
  const ahorroData = [];
  let debtRemaining = total;
  let accumulatedSavings = currentSavings.value || 0;
  
  const dStart = new Date();
  const MONTHS = 36; // Proyección a 3 años

  const formatMonth = (date) => date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });

  labels.push(formatMonth(dStart));
  deudaData.push(Math.round(debtRemaining));
  ahorroData.push(Math.round(accumulatedSavings));

  for (let m = 1; m <= MONTHS; m++) {
    const currentM = new Date(dStart.getFullYear(), dStart.getMonth() + m, 1);
    labels.push(formatMonth(currentM));
    debtRemaining = Math.max(0, debtRemaining - monthlyDebtPayment);
    accumulatedSavings += (debtRemaining === 0 ? financeStore.ahorroAmount : monthlySavings);
    deudaData.push(Math.round(debtRemaining));
    ahorroData.push(Math.round(accumulatedSavings));
  }

  chartSeries.value = [
    { name: t('analytics.accumulated_savings'), type: 'area', data: ahorroData },
    { name: t('analytics.remaining_debt'), type: 'area', data: deudaData }
  ];

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, categories: labels }
  };
  chartReady.value = true;
}

async function fetchDebts() {
  try {
    const { data } = await api.get('/debts');
    debts.value = data.debts || [];
    financeStore.setDebts(debts.value);
    recalcChart();
  } catch (e) { console.error('Error fetching debts', e); }
}

watch(() => financeStore.ahorroAmount, () => recalcChart());

onMounted(() => {
  fetchDebts();
});
</script>

<style scoped>
.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.with-icon { display: flex; align-items: center; gap: 0.5rem; margin: 0 0 1.5rem 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.with-icon .icon { width: 16px; height: 16px; color: var(--color-primary); }

.financial-chart-box { width: 100%; height: 300px; margin-top: 1rem; }
</style>
