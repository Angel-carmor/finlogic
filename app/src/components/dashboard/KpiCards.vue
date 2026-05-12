<template>
  <div class="kpi-grid">
    <!-- Card 1: Semaphore -->
    <div class="panel kpi-card">
      <div class="kpi-header">
        <h3>ÍNDICE DE SALUD FINANCIERA</h3>
        <div class="info-tooltip-container">
          <svg viewBox="0 0 24 24" class="info-icon"><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
          <div class="info-tooltip">
            Se calcula partiendo de 100 puntos y penaliza:<br>
            • <strong>Gastos fijos:</strong> penaliza si superan el 35%.<br>
            • <strong>Ahorro:</strong> penaliza si es menor al 20%.<br>
            • <strong>Deseos/Ocio:</strong> penaliza si superan el 30%.
          </div>
        </div>
      </div>
      <div class="donut-wrapper small-donut">
        <svg viewBox="0 0 42 42" class="donut">
          <circle class="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" stroke-width="6"></circle>
          <circle class="donut-segment isf-segment" cx="21" cy="21" r="15.915" 
            fill="transparent" stroke="var(--color-success)" stroke-width="6"
            :stroke-dasharray="`${financeStore.isfScore} ${100 - financeStore.isfScore}`" stroke-dashoffset="25">
          </circle>
        </svg>
        <div class="donut-center">
          <span class="total-amount isf-value">{{ financeStore.isfScore }}</span>
          <span class="total-label">/100</span>
        </div>
      </div>
    </div>

    <!-- Card 2: Ahorro -->
    <div class="panel kpi-card">
      <h3>CAPACIDAD DE AHORRO</h3>
      <div class="oxygen-content">
        <div class="huge-amount">+{{ financeStore.ahorroAmount }}€</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${financeStore.ahorroPct}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Card 3: Alert -->
    <div class="panel kpi-card alert-panel" :class="financeStore.equilibriumWarning.type">
      <h3>⚠️ ALERTA DE RIESGO</h3>
      <div class="alert-content">
        <div class="ratio-text">Ratio Ocio/Ahorro: <span class="highlight-yellow">{{ financeStore.riskRatio }}%</span></div>
        <div class="total-text">Revisa tu liquidez.</div>
        <div class="alert-msg">{{ financeStore.equilibriumWarning.msg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../../store/finance';

const financeStore = useFinanceStore();
</script>

<style scoped>
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 2rem; }
.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.panel h3 { margin: 0 0 1.5rem 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }

.kpi-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.kpi-header h3 { margin: 0; }
.info-tooltip-container { position: relative; display: flex; align-items: center; justify-content: center; cursor: help; }
.info-icon { width: 18px; height: 18px; color: var(--text-muted); transition: color 0.2s; }
.info-tooltip-container:hover .info-icon { color: var(--color-primary); }
.info-tooltip { visibility: hidden; width: 260px; background-color: var(--bg-base); color: var(--text-main); text-align: left; border-radius: 8px; padding: 0.8rem; font-size: 0.75rem; position: absolute; z-index: 10; top: 130%; right: -10px; opacity: 0; transition: opacity 0.3s, transform 0.3s; transform: translateY(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.6); border: 1px solid var(--border-color); line-height: 1.6; pointer-events: none; }
.info-tooltip-container:hover .info-tooltip { visibility: visible; opacity: 1; transform: translateY(0); }

.small-donut { width: 150px; margin: 0 auto; position: relative; }
.isf-value { font-size: 2.2rem; color: var(--color-success); font-weight: 700; }
.donut-segment { transition: all 0.5s ease-out; }
.donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: flex; flex-direction: column; }
.total-label { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; }

.oxygen-content { display: flex; flex-direction: column; justify-content: center; height: calc(100% - 2.5rem); gap: 1rem; }
.huge-amount { font-size: 3rem; color: var(--color-success); font-weight: 800; text-align: center; text-shadow: 0 0 15px rgba(0, 200, 5, 0.4); font-family: monospace; }
.progress-bar { height: 6px; background: var(--bg-base); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-success); box-shadow: 0 0 10px var(--color-success); transition: width 0.3s; }

.alert-panel { border: 1px solid #fcd34d; border-left: 4px solid #fcd34d; }
.alert-panel h3 { color: #fcd34d; }
.alert-content { background: var(--border-color); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color); margin-top: 1rem; }
.ratio-text { font-family: monospace; font-size: 1.1rem; margin-bottom: 0.5rem; }
.highlight-yellow { color: #fcd34d; font-weight: 700; }
.total-text { font-family: monospace; color: var(--text-muted); margin-bottom: 1rem; }
.alert-msg { color: var(--text-main); font-size: 0.9rem; }

@media (max-width: 1000px) { .kpi-grid { grid-template-columns: 1fr; } }
</style>
