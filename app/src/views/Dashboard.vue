<template>
  <div class="dashboard-layout">
    <main class="main-content">
      <TourGuide page="dashboard" storageName="tour_seen_dashboard" />
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
import Topbar from '../components/layout/Topbar.vue';
import KpiCards from '../components/dashboard/KpiCards.vue';
import BudgetLevers from '../components/dashboard/BudgetLevers.vue';
import MirrorChart from '../components/dashboard/MirrorChart.vue';
import ProjectionPanel from '../components/dashboard/ProjectionPanel.vue';
import DebtAndInvestments from '../components/dashboard/DebtAndInvestments.vue';
import TourGuide from '../components/TourGuide.vue';

const financeStore = useFinanceStore();

onMounted(() => {
  financeStore.initBudget();
});
</script>

<style scoped>
.dashboard-layout { min-height: 100vh; font-family: 'Inter', monospace; color: var(--text-main); }
.main-content { padding-top: 140px; padding-bottom: 4rem; width: 100%; }
.dashboard-container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; display: flex; flex-direction: column; gap: 2.5rem; }
.analysis-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; align-items: start; }
.col-left, .col-right { display: flex; flex-direction: column; gap: 2.5rem; }

@media (max-width: 1000px) { 
  .analysis-grid { grid-template-columns: 1fr; } 
}
</style>
