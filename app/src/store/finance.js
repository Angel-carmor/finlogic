import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useFinanceStore = defineStore('finance', {
  state: () => {
    return {
      budgetItems: [],
      debts: [],
      currentModelId: 'equilibrio',
    };
  },
  getters: {
    netIncome() {
      const authStore = useAuthStore();
      return parseFloat(authStore.user?.net_monthly_income) || 2000;
    },
    userHousing() {
      const authStore = useAuthStore();
      return parseFloat(authStore.user?.housing) || 600;
    },
    userUtilities() {
      const authStore = useAuthStore();
      return parseFloat(authStore.user?.utilities) || 150;
    },
    sumExpenses(state) {
      return state.budgetItems.reduce((acc, item) => acc + item.amount, 0);
    },
    ahorroAmount(state) {
      return Math.max(0, this.netIncome - this.sumExpenses);
    },
    ahorroPct(state) {
      if (this.netIncome === 0) return 0;
      return Math.round((this.ahorroAmount / this.netIncome) * 100);
    },
    totalDebtComputed(state) {
      return Math.round(state.debts.reduce((sum, d) => sum + parseFloat(d.amount), 0));
    },
    segments(state) {
      let needs = 0;
      let desires = 0;

      state.budgetItems.forEach(item => {
        if (item.type === 'necesidad') needs += item.amount;
        else if (item.type === 'deseo') desires += item.amount;
      });

      const net = this.netIncome || 1;
      const needsPct = Math.round((needs / net) * 100);
      const desiresPct = Math.round((desires / net) * 100);
      const savingsPct = this.ahorroPct;

      let offset = 25; 
      return [
        { name: 'Necesidades', percent: needsPct, color: '#3b82f6', offset: offset },
        { name: 'Deseos', percent: desiresPct, color: '#fcd34d', offset: offset - needsPct },
        { name: 'Ahorro', percent: savingsPct, color: '#00C805', offset: offset - needsPct - desiresPct }
      ].filter(s => s.percent >= 0);
    },
    isfScore(state) {
      const fixedExpenses = state.budgetItems
        .filter(i => i.id === 'housing' || i.id === 'utilities')
        .reduce((acc, i) => acc + i.amount, 0);
      
      const net = this.netIncome || 1;
      const fixedEffortPct = (fixedExpenses / net) * 100;
      const savings = this.ahorroPct;
      
      const desires = state.budgetItems
        .filter(i => i.type === 'deseo')
        .reduce((acc, i) => acc + i.amount, 0);
      const desiresPct = (desires / net) * 100;

      let score = 100; // Base score perfecto

      // 1. Pilar de Capacidad de Supervivencia: Tasa de Esfuerzo (Housing Ratio)
      if (fixedEffortPct > 50) {
        score -= 35; // Estrés severo
      } else if (fixedEffortPct > 35) {
        score -= 15; // Riesgo moderado
      }

      // 2. Pilar de Liquidez: Tasa de Ahorro (Regla 50/30/20)
      if (savings === 0) {
        score -= 40;  // Quiebra inminente técnica ante imprevistos
      } else if (savings < 10) {
        score -= 20;  // Ahorro insuficiente para inflación / fondos
      } else if (savings < 20) {
        score -= 5;   // Mejorable (Sub-20)
      }

      // 3. Pilar Estructural: Gasto Discrecional (Ocio y extras hormonales)
      if (desiresPct > 40) {
        score -= 15; // Sobre-exposición grave a gasto de deseos
      } else if (desiresPct > 30) {
        score -= 5;  // Sobrepasando el umbral de la regla del 30%
      }

      return Math.max(0, Math.min(100, Math.round(score)));
    },
    riskRatio(state) {
      const desires = state.budgetItems.filter(i => i.type === 'deseo').reduce((acc, i) => acc + i.amount, 0);
      return this.ahorroAmount > 0 ? Math.round((desires / this.ahorroAmount) * 100) : 999;
    },
    equilibriumWarning(state) {
      if (this.ahorroPct < 10) return { type: 'alert', msg: 'Ahorro insuficiente.' };
      if (this.riskRatio > 150) return { type: 'alert', msg: 'Deseos superan el ahorro con creces.' };
      return { type: 'alert', msg: 'Plan equilibrado.' }; 
    }
  },
  actions: {
    initBudget() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      if (!userId) return;

      const saved = localStorage.getItem('finlogic_custom_budget_' + userId);
      if (saved) {
        this.budgetItems = JSON.parse(saved);
      } else {
        this.resetToDefault();
      }
      this.currentModelId = authStore.user?.planning_model || 'equilibrio';
    },
    saveToLocal() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      if (userId) {
        localStorage.setItem('finlogic_custom_budget_' + userId, JSON.stringify(this.budgetItems));
      }
    },
    resetToDefault() {
      this.budgetItems = [
        { id: 'housing', name: 'Vivienda', locked: true, amount: this.userHousing, color: '#3a3a5c', type: 'necesidad' },
        { id: 'utilities', name: 'Suministros', locked: true, amount: this.userUtilities, color: '#9E9E9E', type: 'necesidad' },
        { id: 'alimentacion', name: 'Alimentación', locked: false, amount: 350, color: '#00C805', type: 'necesidad' },
        { id: 'transporte', name: 'Transporte', locked: false, amount: 150, color: '#00C805', type: 'necesidad' },
        { id: 'ocio', name: 'Ocio', locked: false, amount: 200, color: '#fcd34d', type: 'deseo' }
      ];
      this.currentModelId = 'equilibrio';
      this.saveToLocal();
    },
    handleSliderInput(item, newVal) {
      const sumOtherExpenses = this.sumExpenses - item.amount;
      const maxPossible = this.netIncome - sumOtherExpenses;
      
      if (newVal > maxPossible) {
        newVal = maxPossible;
      }
      
      item.amount = newVal;

      if (this.currentModelId !== 'personalizado') {
        this.currentModelId = 'personalizado';
      }
      this.saveToLocal();
    },
    addNewSlider() {
      this.budgetItems.push({
        id: 'custom_' + Date.now(),
        name: 'Gasto Extra',
        locked: false,
        amount: 0,
        color: '#00C805',
        type: 'deseo',
        isCustom: true
      });
      this.saveToLocal();
    },
    removeSlider(id) {
      this.budgetItems = this.budgetItems.filter(i => i.id !== id);
      this.saveToLocal();
    },
    setModel(id) {
      this.currentModelId = id;
      if(id === 'personalizado') return;
      
      const unlocked = this.budgetItems.filter(i => !i.locked);
      let totalRemaining = this.netIncome - (this.userHousing + this.userUtilities);
      
      if (id === 'acelerador' || id === 'salvavidas') {
        unlocked.forEach(i => {
          if (i.type === 'deseo') i.amount = Math.round(totalRemaining * 0.05);
          else if (i.type === 'necesidad') i.amount = Math.max(100, Math.round(totalRemaining * 0.2)); 
        });
      } else if (id === 'equilibrio') {
        unlocked.forEach(i => {
          if (i.type === 'deseo') i.amount = Math.round(totalRemaining * 0.2);
          else if (i.type === 'necesidad') i.amount = Math.round(totalRemaining * 0.3); 
        });
      }
      this.saveToLocal();
    },
    setDebts(debts) {
      this.debts = debts;
    }
  }
});
