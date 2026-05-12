<template>
  <div class="panel mirror-panel">
    <h3 class="with-icon">
      <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
      Espejo del Futuro
    </h3>
    
    <div class="mirror-content">
      <div class="donut-wrapper large-donut">
        <svg viewBox="0 0 42 42" class="donut">
          <circle class="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" stroke-width="6"></circle>
          <circle v-for="segment in financeStore.segments" :key="segment.name"
            class="donut-segment" cx="21" cy="21" r="15.915" 
            fill="transparent" :stroke="segment.color" stroke-width="6"
            :stroke-dasharray="`${segment.percent} ${100 - segment.percent}`"
            :stroke-dashoffset="segment.offset">
          </circle>
        </svg>
        <div class="donut-center">
          <span class="total-label">AHORRO</span>
          <span class="total-amount isf-value" style="color: var(--color-success)">{{ financeStore.ahorroPct }}%</span>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item" v-for="seg in financeStore.segments" :key="seg.name">
          <div class="legend-item-header">
            <span class="dot" :style="{ backgroundColor: seg.color }"></span>
            <div class="legend-text">
              <div class="name">{{ seg.name }}</div>
            </div>
          </div>
          <div class="pct" :style="{ color: seg.color }">{{ seg.percent }}%</div>
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
.panel { background: var(--bg-panel); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.with-icon { display: flex; align-items: center; gap: 0.5rem; margin: 0 0 1.5rem 0; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.with-icon .icon { width: 16px; height: 16px; color: var(--color-primary); }

.mirror-content { display: flex; flex-direction: column; align-items: center; gap: 2rem; padding: 1rem 0; height: calc(100% - 2rem); justify-content: center; }
.large-donut { width: 280px; position: relative; flex-shrink: 0; }
.donut-segment { transition: all 0.5s ease-out; }
.donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; display: flex; flex-direction: column; }
.total-label { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; }
.isf-value { font-size: 2.2rem; color: var(--color-success); font-weight: 700; }

.legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem; width: 100%; margin-top: 1rem; }
.legend-item { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
.legend-item-header { display: flex; align-items: center; gap: 0.5rem; }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.legend-text { font-size: 0.95rem; color: var(--text-main); }
.pct { font-weight: 800; font-family: monospace; font-size: 1.6rem; text-align: center; }
</style>
