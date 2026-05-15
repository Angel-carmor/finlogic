import { defineStore } from 'pinia';
import budgetService from '../services/budgetService';
import { useFinanceStore } from './finance';

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    data: null,       // objeto completo del mes seleccionado
    history: [],      // array de meses cerrados para el calendario
    globalTotalSavings: 0, // Ahorro total histórico de todos los tiempos
    loading: false,
    error: null,
    selectedYear:  new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
  }),

  getters: {
    categories: (state) => state.data?.categories ?? [],
    totalBudget: (state) => state.data?.totalBudget ?? 0,
    totalSpent:  (state) => state.data?.totalSpent  ?? 0,
    remaining:   (state) => state.data?.remaining   ?? 0,

    /** Historial mapeado por mes para fácil acceso en el calendario */
    historyMap: (state) => {
      const map = {};
      state.history.forEach(h => { map[h.month] = h; });
      return map;
    },

    /** Porcentaje global de gasto */
    globalPct: (state) => {
      if (!state.data?.totalBudget) return 0;
      return Math.min(100, Math.round((state.data.totalSpent / state.data.totalBudget) * 100));
    },
    // ... rest of enrichedCategories and monthLabel ...
    /** Cada categoría enriquecida con semáforo y % */
    enrichedCategories: (state) => {
      return (state.data?.categories ?? []).map(cat => {
        const pct = cat.budget_limit > 0
          ? Math.min(100, Math.round((cat.spent / cat.budget_limit) * 100))
          : 0;
        let status = 'ok';
        if (pct >= 100) status = 'danger';
        else if (pct >= 80) status = 'warning';

        const prevDelta = cat.prev_spent > 0
          ? Math.round(((cat.spent - cat.prev_spent) / cat.prev_spent) * 100)
          : null;

        return { ...cat, pct, status, prevDelta };
      });
    },

    /** Nombre del mes seleccionado */
    monthLabel: (state) => {
      return new Date(state.selectedYear, state.selectedMonth - 1, 1)
        .toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    },

    /** Comparativa vs mes anterior para el nuevo grid */
    comparisonData: (state) => {
      if (!state.data || !state.data.categories) return [];
      
      return state.data.categories.map(cat => {
        const current = cat.budget_limit;
        const previous = cat.prev_limit || 0;
        
        const variation = previous > 0 
          ? ((current - previous) / previous) * 100 
          : 0;

        return {
          category: cat.category,
          type: cat.category_type || cat.type || 'otros',
          current,
          previous,
          variation
        };
      }).filter(c => c.previous > 0);
    },

    /** Ahorro total histórico de todos los tiempos */
    totalAccumulatedSavings: (state) => {
      return state.globalTotalSavings;
    }
  },

  actions: {
    /**
     * Cierra el mes actual guardando el snapshot de forma explícita.
     */
    async closeMonth(year, month) {
      const financeStore = useFinanceStore();
      this.loading = true;
      try {
        if (financeStore.budgetItems.length === 0) {
          financeStore.initBudget();
        }
        
        if (financeStore.budgetItems.length === 0) {
          throw new Error('No hay datos de presupuesto definidos en el Dashboard.');
        }

        const allItems = [...financeStore.budgetItems];
        
        // Asegurar que Vivienda y Suministros estén si no están en budgetItems
        if (!allItems.find(i => i.id === 'housing')) {
          allItems.push({ id: 'housing', name: 'Vivienda', amount: financeStore.userHousing, type: 'necesidad' });
        }
        if (!allItems.find(i => i.id === 'utilities')) {
          allItems.push({ id: 'utilities', name: 'Suministros', amount: financeStore.userUtilities, type: 'necesidad' });
        }

        await budgetService.saveSnapshot(
          year, 
          month, 
          allItems,
          financeStore.netIncome,
          financeStore.totalDebtComputed
        );
        
        // Pequeña espera para asegurar que la DB ha persistido y el índice está listo
        await new Promise(r => setTimeout(r, 300));
        
        // Refrescar datos del mes y el historial del año
        await Promise.all([
          this.fetchTracking(year, month),
          this.fetchHistory(year)
        ]);
      } catch (err) {
        this.error = 'Error al cerrar el mes: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    async reopenMonth(year, month) {
      this.loading = true;
      try {
        await budgetService.deleteSnapshot(year, month);
        await Promise.all([
          this.fetchTracking(year, month),
          this.fetchHistory(year)
        ]);
      } catch (err) {
        this.error = 'Error al reabrir el mes: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchHistory(year) {
      try {
        const res = await budgetService.getHistory(year);
        // La nueva API devuelve { history, globalTotalSavings }
        if (res.data && res.data.history) {
          this.history = res.data.history;
          this.globalTotalSavings = parseFloat(res.data.globalTotalSavings || 0);
        } else {
          this.history = res.data || [];
          this.globalTotalSavings = 0;
        }
      } catch (err) {
        console.error('[tracking] fetchHistory error:', err.message);
      }
    },

    async fetchTracking(year, month) {
      this.loading = true;
      this.error   = null;
      this.data    = null; // Forzamos limpieza para refresco total
      try {
        const res   = await budgetService.getTracking(year, month);
        this.data   = res.data;
      } catch (err) {
        this.error = err.message;
        this.data  = null;
      } finally {
        this.loading = false;
      }
    },

    setMonth(year, month) {
      this.selectedYear  = year;
      this.selectedMonth = month;
      this.fetchTracking(year, month);
    },

    setYear(year) {
      this.selectedYear = year;
      this.fetchHistory(year);
      this.fetchTracking(year, this.selectedMonth);
    }
  },
});
