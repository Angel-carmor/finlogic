<template>
  <div class="dashboard-layout">
    <Sidebar />
    
    <main class="main-content">
      <Topbar title="Resumen Financiero" />

      <section class="kpi-grid">
        <div class="kpi-card"><h3>Balance</h3><p>$24,562.00</p></div>
        <div class="kpi-card"><h3>Ingresos</h3><p>$8,240.50</p></div>
        <div class="kpi-card"><h3>Gastos</h3><p>$3,120.00</p></div>
      </section>

      <section class="placeholder-area">
        <p>Aquí irá el listado de transacciones o gráficos próximamente...</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/layout/Sidebar.vue';
import Topbar from '../components/layout/Topbar.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  background-color: #0f172a;
  font-family: sans-serif;
}
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
.kpi-grid {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.kpi-card {
  flex: 1;
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
}
.kpi-card h3 { margin: 0 0 0.5rem; font-size: 1rem; color: #94a3b8; }
.kpi-card p { margin: 0; font-size: 1.8rem; font-weight: bold; }
.placeholder-area {
  background: #1e293b;
  padding: 3rem;
  border-radius: 12px;
  color: #64748b;
  text-align: center;
  border: 1px dashed #334155;
}
</style>
