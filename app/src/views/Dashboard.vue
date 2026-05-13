<template>
  <div class="dashboard-layout">
    <Sidebar />
    
    <main class="main-content">
      <Topbar />

      <div class="dashboard-container">
        <!-- ROW 1: Top KPIs -->
        <KpiCards />

        <!-- MAIN ROW -->
        <div class="analysis-grid">
          <!-- Left Column -->
          <div class="col-left">
            <BudgetLevers />
          </div>

          <!-- Right Column -->
          <div class="col-right">
            <MirrorChart />
            <DebtAndInvestments />
          </div>
        </div>

        <!-- BOTTOM ROW -->
        <ProjectionPanel />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useFinanceStore } from '../store/finance';
import Sidebar from '../components/layout/Sidebar.vue';
import Topbar from '../components/layout/Topbar.vue';
import KpiCards from '../components/dashboard/KpiCards.vue';
import BudgetLevers from '../components/dashboard/BudgetLevers.vue';
import MirrorChart from '../components/dashboard/MirrorChart.vue';
import ProjectionPanel from '../components/dashboard/ProjectionPanel.vue';
import DebtAndInvestments from '../components/dashboard/DebtAndInvestments.vue';

const financeStore = useFinanceStore();

onMounted(() => {
  financeStore.initBudget();
});
</script>

<style scoped>
.dashboard-layout { display: flex; height: 100vh; background-color: var(--bg-base); font-family: 'Inter', monospace; color: var(--text-main); }
.main-content { flex: 1; padding: 2rem; overflow-y: auto; background: var(--bg-base); }
.dashboard-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
.analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
.col-left, .col-right { display: flex; flex-direction: column; gap: 2rem; }

@media (max-width: 1000px) { 
  .analysis-grid { grid-template-columns: 1fr; } 
}
</style>
