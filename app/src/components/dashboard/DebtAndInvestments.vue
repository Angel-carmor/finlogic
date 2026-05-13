<template>
  <div class="debt-investments-container">
    <div class="panel list-panel">
      <h3 class="section-title">
        <span class="dot red-dot"></span> {{ $t('debts_investments.debts') }}
      </h3>
      <div v-if="loadingDebts" class="loading-msg">{{ $t('debts_investments.loading_debts') }}</div>
      <div v-else-if="debts.length === 0" class="empty-msg">{{ $t('debts_investments.no_debts') }}</div>
      <ul v-else class="simple-list">
        <li v-for="debt in debts" :key="debt.id" class="list-item">
          <div class="item-info">
            <span class="item-name">{{ debt.name }}</span>
            <span class="item-rate" v-if="debt.interest_rate">{{ debt.interest_rate }}% {{ $t('debts_investments.interest') }}</span>
          </div>
          <div class="item-value red-text">
            €{{ parseFloat(debt.amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
        </li>
      </ul>
    </div>

    <div class="panel list-panel">
      <h3 class="section-title">
        <span class="dot green-dot"></span> {{ $t('debts_investments.investments') }}
      </h3>
      <div v-if="loadingInvestments" class="loading-msg">{{ $t('debts_investments.loading_investments') }}</div>
      <div v-else-if="investments.length === 0" class="empty-msg">{{ $t('debts_investments.no_investments') }}</div>
      <ul v-else class="simple-list">
        <li v-for="inv in investments" :key="inv.id" class="list-item">
          <div class="item-info">
            <span class="item-name">{{ inv.name }}</span>
            <span class="item-rate">{{ $t('debts_investments.invested') }}: €{{ parseFloat(inv.amount).toLocaleString('es-ES') }}</span>
          </div>
          <div class="item-value" :class="getGainClass(inv)">
            {{ getGainFormatted(inv) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const debts = ref([]);
const investments = ref([]);
const loadingDebts = ref(true);
const loadingInvestments = ref(true);

const fetchDebts = async () => {
  try {
    const { data } = await api.get('/debts');
    debts.value = data.debts || [];
  } catch (e) {
    console.error('Error fetching debts', e);
  } finally {
    loadingDebts.value = false;
  }
};

const fetchInvestments = async () => {
  try {
    const { data } = await api.get('/investments');
    investments.value = data.investments || [];
  } catch (e) {
    console.error('Error fetching investments', e);
  } finally {
    loadingInvestments.value = false;
  }
};

const getGainFormatted = (inv) => {
  if (!inv.marketData) {
    return `€${parseFloat(inv.amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  const base = parseFloat(inv.amount);
  const current = base * (1 + inv.marketData.changePercent / 100);
  const changeStr = inv.marketData.changePercent >= 0 ? '+' : '';
  return `€${current.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${changeStr}${inv.marketData.changePercent.toFixed(2)}%)`;
};

const getGainClass = (inv) => {
  if (!inv.marketData) return '';
  return inv.marketData.changePercent >= 0 ? 'green-text' : 'red-text';
};

onMounted(() => {
  fetchDebts();
  fetchInvestments();
});
</script>

<style scoped>
.debt-investments-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.panel {
  background: var(--bg-panel);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 700;
  letter-spacing: 1px;
}
.dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.red-dot { background-color: var(--color-danger); }
.green-dot { background-color: var(--color-success); }

.simple-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.list-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.item-name {
  font-weight: 600;
  color: #fff;
}
.item-rate {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.item-value {
  font-weight: 700;
  font-family: monospace;
  font-size: 1.1rem;
}
.red-text { color: var(--color-danger); }
.green-text { color: var(--color-success); }
.empty-msg, .loading-msg {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem 0;
}
</style>
