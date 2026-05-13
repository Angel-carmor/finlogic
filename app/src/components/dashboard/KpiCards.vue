<template>
  <div class="kpi-grid">
    <!-- Card 1: Semaphore -->
    <div class="panel kpi-card">
      <div class="kpi-header">
        <h3>{{ $t('kpi.health_index') }}</h3>
        <div class="info-tooltip-container">
          <svg viewBox="0 0 24 24" class="info-icon"><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
          <div class="info-tooltip" v-html="$t('kpi.health_tooltip')"></div>
        </div>
      </div>
      <div class="donut-wrapper small-donut">
        <svg viewBox="0 0 42 42" class="donut">
          <circle class="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" stroke-width="3"></circle>
          <circle class="donut-segment isf-segment" cx="21" cy="21" r="15.915" 
            fill="transparent" stroke-width="3" stroke-linecap="round"
            :style="{ stroke: financeStore.isfColor, strokeDasharray: `${financeStore.isfScore} ${100 - financeStore.isfScore}` }" 
            stroke-dashoffset="25">
          </circle>
        </svg>
        <div class="donut-center">
          <span class="total-amount isf-value" :style="{ color: financeStore.isfColor }">{{ financeStore.isfScore }}</span>
          <span class="total-label">/100</span>
        </div>
        <div class="isf-status-label" :style="{ color: financeStore.isfColor, textShadow: `0 0 10px ${financeStore.isfColor}80` }">{{ $t('store.status.' + financeStore.isfLabel) }}</div>
      </div>
    </div>

    <!-- Card 2: Ahorro -->
    <div class="panel kpi-card">
      <h3>{{ $t('kpi.savings_capacity') }}</h3>
      <div class="oxygen-content">
        <div class="huge-amount">+{{ financeStore.ahorroAmount }}€</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${financeStore.ahorroPct}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Card 3: Alert -->
    <div class="panel kpi-card alert-panel" :class="financeStore.balanceStatus.borderClass">
      <div class="kpi-header">
        <h3 :class="financeStore.balanceStatus.colorClass">{{ $t('kpi.balance_title') }}</h3>
        <div class="info-tooltip-container">
          <svg viewBox="0 0 24 24" class="info-icon"><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
          <div class="info-tooltip">{{ $t('kpi.balance_tooltip') }}</div>
        </div>
      </div>
      <div class="balance-content">
        <div class="vs-bar-container">
          <div class="vs-bar-fill vs-ahorro" :style="{ width: financeStore.vsAhorroPct + '%' }">
            <span v-if="financeStore.vsAhorroPct > 15" class="bar-label">{{ $t('kpi.savings_label') }}</span>
          </div>
          <div class="vs-bar-fill vs-ocio" :style="{ width: financeStore.vsOcioPct + '%' }">
            <span v-if="financeStore.vsOcioPct > 15" class="bar-label">{{ $t('kpi.leisure_label') }}</span>
          </div>
        </div>
        
        <div class="dynamic-msg" :class="financeStore.balanceStatus.colorClass">
          {{ $t('store.balance.' + financeStore.balanceStatus.text) }}
        </div>
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
.isf-value { font-size: 2.2rem; font-weight: 700; transition: color 0.5s; }
.donut-segment { transition: all 0.5s ease-out; }
.donut-center { position: absolute; top: calc(50% - 15px); left: 50%; transform: translate(-50%, -50%); text-align: center; display: flex; flex-direction: column; }
.total-label { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; }
.isf-status-label { text-align: center; margin-top: 15px; font-weight: 600; letter-spacing: 1px; font-size: 0.85rem; text-transform: uppercase; transition: all 0.5s; }

.oxygen-content { display: flex; flex-direction: column; justify-content: center; height: calc(100% - 2.5rem); gap: 1rem; }
.huge-amount { font-size: 3rem; color: var(--color-success); font-weight: 800; text-align: center; text-shadow: 0 0 15px rgba(0, 200, 5, 0.4); font-family: monospace; }
.progress-bar { height: 6px; background: var(--bg-base); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-success); box-shadow: 0 0 10px var(--color-success); transition: width 0.3s; }

.balance-content { display: flex; flex-direction: column; justify-content: center; height: calc(100% - 2.5rem); gap: 1.5rem; }

.vs-bar-container { display: flex; height: 32px; border-radius: 16px; overflow: hidden; background: var(--bg-base); box-shadow: inset 0 2px 6px rgba(0,0,0,0.4); }
.vs-bar-fill { height: 100%; transition: width 0.5s ease-out; display: flex; align-items: center; justify-content: center; }
.vs-ahorro { background: linear-gradient(90deg, #00C805, #10b981); }
.vs-ocio { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.bar-label { font-size: 0.8rem; font-weight: 800; color: rgba(255,255,255,0.95); letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }

.dynamic-msg { font-size: 0.9rem; line-height: 1.5; font-weight: 500; text-align: center; }
.text-success { color: var(--color-success) !important; }
.text-primary { color: var(--color-primary) !important; }
.text-warning { color: #f59e0b !important; }
.text-danger { color: var(--color-danger) !important; }
.text-muted { color: var(--text-muted) !important; }

.border-success { border-color: rgba(0, 200, 5, 0.4); border-left: 4px solid var(--color-success); }
.border-primary { border-color: rgba(59, 130, 246, 0.4); border-left: 4px solid var(--color-primary); }
.border-warning { border-color: rgba(245, 158, 11, 0.4); border-left: 4px solid #f59e0b; }
.border-danger { border-color: rgba(255, 77, 79, 0.4); border-left: 4px solid var(--color-danger); }
.border-muted { border-color: var(--border-color); border-left: 4px solid var(--text-muted); }

@media (max-width: 1000px) { .kpi-grid { grid-template-columns: 1fr; } }
</style>
