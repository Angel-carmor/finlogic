<template>
  <div class="dashboard-layout">
    <Sidebar />
    <main class="main-content">
      <TourGuide page="investments" />
      <Topbar />

      <div class="dashboard-container">
        <!-- Header Section -->
        <div class="top-section panel" id="tour-investments-header">
          <div class="portfolio-info">
            <h2 class="title">{{ $t('investments_page.portfolio_total') }}</h2>
            <div class="kpi-val green-text">
              {{ totalMarketValue >= totalInvested ? '' : '' }}€ {{ totalMarketValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </div>
            <div class="kpi-var" :class="totalChange >= 0 ? 'green-text' : 'red-text'">
              {{ totalChange >= 0 ? '+' : '' }}€{{ totalChange.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ({{ totalChangePercent.toFixed(2) }}%)
            </div>
          </div>
          
          <div class="portfolio-chart" v-if="investments.length > 0" id="tour-investments-chart">
            <div class="chart-wrapper">
              <apexchart type="donut" height="150" :options="chartOptions" :series="chartSeries"></apexchart>
            </div>
            <div class="chart-legend">
              <div class="legend-item"><span class="dot" style="background: #3b82f6;"></span> {{ $t('investments_page.stocks') }}<br/><strong>{{ (chartSeries[0] / totalMarketValue * 100).toFixed(0) || 0 }}%</strong></div>
              <div class="legend-item"><span class="dot" style="background: #00C805;"></span> {{ $t('investments_page.crypto') }}<br/><strong>{{ (chartSeries[1] / totalMarketValue * 100).toFixed(0) || 0 }}%</strong></div>
              <div class="legend-item"><span class="dot" style="background: #9E9E9E;"></span> {{ $t('investments_page.cash') }}<br/><strong>0%</strong></div>
            </div>
          </div>
        </div>

        <div class="middle-blocks">
          
          <!-- Posiciones Abiertas -->
          <div class="left-col" id="tour-investments-positions">
            <h3 class="section-title">
              <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
              {{ $t('investments_page.open_positions') }}
            </h3>
            
            <div class="positions-list" v-if="investments.length > 0">
              <div class="position-card panel" v-for="inv in investments" :key="inv.id">
                <div class="card-icon">
                  <!-- Stock Icon -->
                  <svg v-if="!isCrypto(inv.ticker)" viewBox="0 0 24 24" class="icon blue-text"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                  <!-- Crypto Icon -->
                  <svg v-else viewBox="0 0 24 24" class="icon red-text"><path fill="currentColor" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14.93V19h-2v-2.07A4.06 4.06 0 018 13.5v-1h2.15a2.53 2.53 0 002.85 2.41 2.34 2.34 0 002-2.28c0-2.31-4.85-1.52-4.85-4.57 0-1.4 1.13-2.6 2.85-2.93V3h2v2.07c1.47.3 2.5 1.5 2.5 3.03h-2.15a1.86 1.86 0 00-1.85-1.63 1.83 1.83 0 00-1.85 1.77c0 2 4.85 1.19 4.85 4.39A3.89 3.89 0 0113 16.93z"/></svg>
                  <span style="font-size: 0.7rem; color: #9E9E9E; text-transform: uppercase;">{{ isCrypto(inv.ticker) ? 'Crypto' : 'Stock' }}</span>
                </div>
                
                <div class="card-name">
                  <div class="t-name">{{ inv.name }}</div>
                  <div class="t-ticker">{{ inv.ticker || 'N/A' }}</div>
                </div>
                
                <div class="card-data">
                  <div class="kpi-lbl">{{ $t('investments_page.invested') }}</div>
                  <div class="card-val">€{{ parseFloat(inv.amount).toLocaleString('es-ES') }}</div>
                </div>
                
                <div class="card-data">
                  <div class="kpi-lbl">{{ $t('investments_page.current_value') }}</div>
                  <div class="card-val" v-if="inv.marketData">
                    €{{ (parseFloat(inv.amount) * (1 + inv.marketData.changePercent / 100)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                  <div class="card-val" v-else>€{{ parseFloat(inv.amount).toLocaleString('es-ES') }}</div>
                </div>
                
                <div class="card-data" style="text-align: right;">
                  <div class="kpi-lbl">{{ $t('investments_page.var_24h') }}</div>
                  <div class="card-val" v-if="inv.marketData" :class="inv.marketData.change >= 0 ? 'green-text' : 'red-text'">
                    {{ inv.marketData.change >= 0 ? '+' : '' }}{{ inv.marketData.changePercent.toFixed(2) }}%
                    <div style="font-size: 0.7rem; color: #9E9E9E;">Perfección 24h</div>
                  </div>
                  <div class="card-val" v-else>-</div>
                </div>
                
                <button class="btn-del" @click="removeInvestment(inv.id)" title="Cerrar posición">×</button>
              </div>
            </div>
            <div class="market-empty panel" v-else>
              <p>{{ $t('investments_page.no_positions') }}</p>
            </div>
          </div>

          <!-- Columna Derecha -->
          <div class="right-col">
            <!-- Top Ganadores / Perdedores -->
            <div class="panel winners-losers">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M3.5 18.5l6-6 4 4L22 6.92 20.59 5.5l-7.09 7.09-4-4L2 17.08z"/></svg>
                {{ $t('investments_page.top_winners_losers') }}
              </h3>
              
              <div class="tabs">
                <div class="tab active">{{ $t('investments_page.winners') }}</div>
                <div class="tab">{{ $t('investments_page.losers') }}</div>
              </div>
              
              <div class="top-list">
                <div class="top-item" v-for="inv in topGainers" :key="inv.id">
                  <span>{{ inv.name }} ({{ inv.ticker }})</span>
                  <span class="green-text">+{{ inv.marketData.changePercent.toFixed(2) }}%</span>
                </div>
                <div class="top-item" v-for="inv in topLosers" :key="inv.id">
                  <span>{{ inv.name }} ({{ inv.ticker }})</span>
                  <span class="red-text">{{ inv.marketData.changePercent.toFixed(2) }}%</span>
                </div>
              </div>
            </div>

            <!-- Formulario de Inversión -->
            <div class="panel add-panel" id="tour-investments-add">
              <h3 class="section-title" style="color: #3b82f6;">
                {{ $t('investments_page.add_position') }}
              </h3>
              <div class="add-form">
                <div class="field-group" style="position: relative;">
                  <label class="field-label">{{ $t('investments_page.ticker_symbol') }}</label>
                  <input class="field-input" type="text" v-model="newInvestment.ticker" @input="debouncedSearch" :placeholder="$t('investments_page.ph_ticker')" style="text-transform: uppercase;" autocomplete="off" />
                  
                  <!-- Autocomplete Dropdown -->
                  <div class="autocomplete-dropdown" v-if="searchResults.length > 0 && showDropdown">
                    <div class="ac-item" v-for="res in searchResults" :key="res.ticker" @click="selectTicker(res)">
                      <span class="ac-ticker">{{ res.ticker }}</span>
                      <span class="ac-name">{{ res.name }} ({{ res.exch }})</span>
                    </div>
                  </div>
                </div>
                <div class="field-group">
                  <label class="field-label">{{ $t('investments_page.asset_name') }}</label>
                  <input class="field-input" type="text" v-model="newInvestment.name" :placeholder="$t('investments_page.ph_name')" />
                </div>
                <div class="field-group">
                  <label class="field-label">{{ $t('investments_page.capital_invested') }}</label>
                  <div class="currency-wrap">
                    <input class="field-input currency-input" type="number" v-model.number="newInvestment.amount" min="0" step="10" placeholder="0" />
                  </div>
                </div>
                
                <div class="add-form-action" style="margin-top: 1rem;">
                  <button class="btn-primary" @click="addInvestment" :disabled="loading || !newInvestment.name || !newInvestment.amount">
                    {{ loading ? $t('investments_page.btn_processing') : $t('investments_page.btn_add') }}
                  </button>
                  <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
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
import { useI18n } from 'vue-i18n';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar.vue';
import Topbar from '../components/layout/Topbar.vue';
import VueApexCharts from 'vue3-apexcharts';
import TourGuide from '../components/TourGuide.vue';

const apexchart = VueApexCharts;

const authStore = useAuthStore();
const { t } = useI18n();
const user = authStore.user || {};

const investments = ref([]);
const loading = ref(false);
const errorMsg = ref('');
const searchResults = ref([]);
const showDropdown = ref(false);
let searchTimeout = null;

const newInvestment = reactive({
  ticker: '',
  name: '',
  amount: null,
  annual_return: 0,
  monthly_contribution: 0
});

// Helpers
const isCrypto = (ticker) => {
  if (!ticker) return false;
  return ticker.includes('-USD') || ticker.includes('BTC') || ticker.includes('ETH');
};

// KPIs
const totalInvested = computed(() => {
  return investments.value.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
});

const totalMarketValue = computed(() => {
  return investments.value.reduce((sum, inv) => {
    const base = parseFloat(inv.amount);
    if (inv.marketData && inv.marketData.changePercent) {
      return sum + (base * (1 + inv.marketData.changePercent / 100));
    }
    return sum + base;
  }, 0);
});

const totalChange = computed(() => totalMarketValue.value - totalInvested.value);
const totalChangePercent = computed(() => {
  if (totalInvested.value === 0) return 0;
  return (totalChange.value / totalInvested.value) * 100;
});

// Chart
const chartSeries = computed(() => {
  let crypto = 0;
  let stock = 0;
  investments.value.forEach(inv => {
    const val = inv.marketData && inv.marketData.changePercent 
      ? parseFloat(inv.amount) * (1 + inv.marketData.changePercent / 100) 
      : parseFloat(inv.amount);
    if (isCrypto(inv.ticker)) crypto += val;
    else stock += val;
  });
  return [stock, crypto];
});

const chartOptions = {
  chart: { type: 'donut', background: 'transparent' },
  labels: ['ACCIONES', 'CRIPTO'],
  colors: ['#3b82f6', '#00C805'],
  stroke: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: { size: '65%' }
    }
  },
  legend: { show: false },
  tooltip: {
    theme: 'dark'
  }
};

// Top Gainers / Losers
const topGainers = computed(() => {
  return investments.value
    .filter(inv => inv.marketData && inv.marketData.changePercent > 0)
    .sort((a, b) => b.marketData.changePercent - a.marketData.changePercent)
    .slice(0, 3);
});

const topLosers = computed(() => {
  return investments.value
    .filter(inv => inv.marketData && inv.marketData.changePercent < 0)
    .sort((a, b) => a.marketData.changePercent - b.marketData.changePercent)
    .slice(0, 3);
});

// API Calls
const fetchInvestments = async () => {
  try {
    const { data } = await api.get('/investments');
    investments.value = data.investments || [];
  } catch (e) {
    console.error('Error fetching investments', e);
  }
};

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  if (!newInvestment.ticker || newInvestment.ticker.length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }
  searchTimeout = setTimeout(async () => {
    try {
      const { data } = await api.get(`/investments/search?q=${newInvestment.ticker}`);
      searchResults.value = data.results || [];
      showDropdown.value = searchResults.value.length > 0;
    } catch (e) {
      console.error('Error searching ticker', e);
    }
  }, 400);
};

const selectTicker = (result) => {
  newInvestment.ticker = result.ticker;
  newInvestment.name = result.name;
  searchResults.value = [];
  showDropdown.value = false;
};

const addInvestment = async () => {
  if (!newInvestment.name || !newInvestment.amount || newInvestment.amount <= 0) {
    errorMsg.value = 'Introduce un nombre y un capital válido.';
    return;
  }
  errorMsg.value = '';
  loading.value = true;
  try {
    await api.post('/investments', {
      name: newInvestment.name,
      ticker: newInvestment.ticker ? newInvestment.ticker.toUpperCase() : null,
      amount: newInvestment.amount,
      annual_return: newInvestment.annual_return || 0,
      monthly_contribution: newInvestment.monthly_contribution || 0,
    });
    
    newInvestment.name = '';
    newInvestment.ticker = '';
    newInvestment.amount = null;
    
    await fetchInvestments();
  } catch (e) {
    errorMsg.value = e.response?.data?.error || 'Error al añadir posición.';
  } finally {
    loading.value = false;
  }
};

const removeInvestment = async (id) => {
  loading.value = true;
  try {
    await api.delete(`/investments/${id}`);
    await fetchInvestments();
  } catch (e) {
    errorMsg.value = 'Error al eliminar.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInvestments();
});
</script>

<style scoped>
.dashboard-layout { display: flex; height: 100vh; background-color: var(--bg-base); font-family: 'Inter', sans-serif; color: var(--text-main); }
.main-content { flex: 1; padding: 2rem; overflow-y: auto; background: var(--bg-base); }
.dashboard-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }

.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }

/* Top Section */
.top-section { display: flex; justify-content: space-between; align-items: center; }
.portfolio-info { flex: 1; }
.portfolio-info .title { font-size: 1.8rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #ffffff; letter-spacing: -0.5px; }
.kpi-val { font-size: 3rem; font-weight: 800; font-family: monospace; line-height: 1; margin-bottom: 0.5rem; }
.kpi-var { font-size: 1.2rem; font-family: monospace; font-weight: 600; }

.portfolio-chart { display: flex; align-items: center; gap: 1.5rem; }
.chart-wrapper { width: 150px; height: 150px; }
.chart-legend { display: flex; flex-direction: column; gap: 0.8rem; }
.legend-item { font-size: 0.75rem; color: var(--text-muted); letter-spacing: 1px; }
.legend-item .dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 0.5rem; }
.legend-item strong { display: block; font-size: 1rem; color: #fff; margin-top: 0.2rem; }

/* Middle Grid */
.middle-blocks { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }

.section-title { display: flex; align-items: center; gap: 0.6rem; margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--text-main); font-weight: 700; letter-spacing: 1px; }
.section-title .icon { width: 16px; height: 16px; color: var(--color-primary); }

/* Positions List */
.positions-list { display: flex; flex-direction: column; gap: 1rem; }
.position-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.2rem 1.5rem; }
.card-icon { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; min-width: 50px; }
.card-icon .icon { width: 28px; height: 28px; }
.card-name { flex: 1.5; display: flex; flex-direction: column; gap: 0.3rem; }
.t-name { font-weight: 700; font-size: 1.1rem; color: #fff; }
.t-ticker { background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.75rem; color: var(--text-main); display: inline-block; width: fit-content; }

.card-data { flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
.kpi-lbl { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
.card-val { font-size: 1.1rem; font-weight: 700; font-family: monospace; color: var(--text-main); }

.btn-del { background: transparent; border: none; color: #555; font-size: 1.5rem; cursor: pointer; transition: color 0.2s; }
.btn-del:hover { color: var(--color-danger); }

.market-empty { padding: 3rem; text-align: center; color: var(--text-muted); font-family: monospace; border: 1px dashed var(--border-color); border-radius: 8px; }

/* Right Col: Top Gainers */
.winners-losers { padding: 1.5rem; }
.tabs { display: flex; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
.tab { padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); cursor: pointer; }
.tab.active { color: #fff; border-bottom: 2px solid var(--color-primary); }
.top-list { display: flex; flex-direction: column; gap: 0.8rem; }
.top-item { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.top-item:last-child { border-bottom: none; }

/* Right Col: Add Form */
.add-panel { margin-top: 1.5rem; }
.add-form { display: flex; flex-direction: column; gap: 1rem; }
.field-group { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }
.field-input { background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.8rem; color: #fff; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
.field-input:focus { border-color: var(--color-primary); }

.currency-wrap { position: relative; display: flex; align-items: center; }
.currency-wrap::before { content: "€"; position: absolute; left: 0.8rem; color: var(--text-muted); font-weight: 600; }
.currency-input { width: 100%; padding-left: 1.8rem; }

.btn-primary { background: var(--color-primary); color: #fff; border: none; padding: 0.8rem; border-radius: 6px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; width: 100%; }
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.error-msg { color: var(--color-danger); font-size: 0.85rem; margin-top: 0.5rem; text-align: center; }

/* Autocomplete */
.autocomplete-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-panel); border: 1px solid var(--color-primary); border-radius: 6px; margin-top: 4px; z-index: 100; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
.ac-item { padding: 0.8rem; border-bottom: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: background 0.2s; }
.ac-item:hover { background: rgba(59, 130, 246, 0.1); }
.ac-ticker { font-weight: 700; color: var(--color-primary); font-family: monospace; width: 60px; }
.ac-name { color: var(--text-main); font-size: 0.85rem; }

/* Global colors */
.green-text { color: var(--color-success); }
.red-text { color: var(--color-danger); }
.blue-text { color: var(--color-primary); }

@media (max-width: 1000px) {
  .middle-blocks { grid-template-columns: 1fr; }
  .top-section { flex-direction: column; align-items: flex-start; gap: 2rem; }
  .portfolio-chart { width: 100%; justify-content: space-around; }
}
</style>
