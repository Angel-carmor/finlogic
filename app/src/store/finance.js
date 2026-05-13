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
        { name: 'Necesidades', amount: needs, percent: needsPct, color: '#3b82f6', offset: offset },
        { name: 'Deseos', amount: desires, percent: desiresPct, color: '#fcd34d', offset: offset - needsPct },
        { name: 'Ahorro', amount: this.ahorroAmount, percent: savingsPct, color: '#00C805', offset: offset - needsPct - desiresPct }
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
    isfLabel(state) {
      const score = this.isfScore;
      if (score >= 80) return 'excellent';
      if (score >= 60) return 'good';
      if (score >= 40) return 'warning';
      return 'critical';
    },
    isfColor(state) {
      const score = this.isfScore;
      if (score >= 80) return '#00C805';
      if (score >= 60) return '#3b82f6';
      if (score >= 40) return '#fcd34d';
      return '#ff4d4f';
    },
    riskRatio(state) {
      return this.ahorroAmount > 0 ? Math.round((this.deseosAmount / this.ahorroAmount) * 100) : 999;
    },
    deseosAmount(state) {
      return state.budgetItems.filter(i => i.type === 'deseo').reduce((acc, i) => acc + i.amount, 0);
    },
    vsAhorroPct(state) {
      const total = this.ahorroAmount + this.deseosAmount;
      if (total === 0) return 50;
      return (this.ahorroAmount / total) * 100;
    },
    vsOcioPct(state) {
      const total = this.ahorroAmount + this.deseosAmount;
      if (total === 0) return 50;
      return (this.deseosAmount / total) * 100;
    },
    balanceStatus(state) {
      const ratio = this.riskRatio;
      if (this.ahorroAmount === 0 && this.deseosAmount === 0) {
        return { text: 'none', colorClass: 'text-muted', borderClass: 'border-muted' };
      }
      if (this.ahorroAmount === 0 && this.deseosAmount > 0) {
        return { text: 'critical', colorClass: 'text-danger', borderClass: 'border-danger' };
      }
      if (ratio <= 50) return { text: 'excellent', colorClass: 'text-success', borderClass: 'border-success' };
      if (ratio <= 100) return { text: 'controlled', params: { ratio }, colorClass: 'text-primary', borderClass: 'border-primary' };
      if (ratio <= 150) return { text: 'warning', params: { overflow: ratio - 100 }, colorClass: 'text-warning', borderClass: 'border-warning' };
      return { text: 'danger', params: { multiplier: (ratio/100).toFixed(1) }, colorClass: 'text-danger', borderClass: 'border-danger' };
    },
    equilibriumWarning(state) {
      if (this.ahorroPct < 10) return { type: 'alert', msg: 'Ahorro insuficiente.' };
      if (this.riskRatio > 150) return { type: 'alert', msg: 'Deseos superan el ahorro con creces.' };
      return { type: 'alert', msg: 'Plan equilibrado.' }; 
    },
    targetModelMacros(state) {
      const net = this.netIncome;
      const fixedExpenses = this.userHousing + this.userUtilities;
      const fixedPct = (fixedExpenses / net) * 100;
      
      let targetNeedsPct = 0;
      let targetDesiresPct = 0;
      
      if (this.currentModelId === 'equilibrio') {
        targetNeedsPct = 50; 
        targetDesiresPct = 30;
      } else if (this.currentModelId === 'acelerador') {
        targetNeedsPct = 40; 
        targetDesiresPct = 10;
      } else if (this.currentModelId === 'salvavidas' || this.currentModelId === 'rescate') {
        targetNeedsPct = 35; 
        targetDesiresPct = 0; 
      } else {
        return null;
      }

      let availableForVarNeedsPct = Math.max(0, targetNeedsPct - fixedPct);
      if (availableForVarNeedsPct < 10) {
        availableForVarNeedsPct = 10;
      }

      let actualNeedsTotalPct = fixedPct + availableForVarNeedsPct;
      let remainingPct = Math.max(0, 100 - actualNeedsTotalPct);

      let availableForDesiresPct = 0;
      if (this.currentModelId === 'equilibrio') {
         let maxDesires = Math.max(0, remainingPct - 20); 
         availableForDesiresPct = Math.min(targetDesiresPct, maxDesires);
      } else if (this.currentModelId === 'acelerador') {
         let maxDesires = Math.max(0, remainingPct - 50);
         availableForDesiresPct = Math.min(targetDesiresPct, maxDesires);
      } else if (this.currentModelId === 'salvavidas' || this.currentModelId === 'rescate') {
         availableForDesiresPct = 0;
      }

      const totalNeedsBudget = fixedExpenses + Math.round((availableForVarNeedsPct / 100) * net);
      const desiresBudget = Math.round((availableForDesiresPct / 100) * net);
      const savingsBudget = Math.max(0, net - totalNeedsBudget - desiresBudget);

      return {
        needs: totalNeedsBudget,
        desires: desiresBudget,
        savings: savingsBudget
      };
    },
    modelDeviations(state) {
      const target = this.targetModelMacros;
      if (!target) return null;

      let actualNeeds = state.budgetItems.filter(i => i.type === 'necesidad').reduce((acc, i) => acc + i.amount, 0);
      let actualDesires = this.deseosAmount;
      let actualSavings = this.ahorroAmount;

      return {
        needs: { actual: actualNeeds, target: target.needs, diff: actualNeeds - target.needs },
        desires: { actual: actualDesires, target: target.desires, diff: actualDesires - target.desires },
        savings: { actual: actualSavings, target: target.savings, diff: actualSavings - target.savings }
      };
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
      this.saveToLocal();
    },
    addNewSlider(type) {
      const isNeed = type === 'necesidad';
      this.budgetItems.push({
        id: 'custom_' + Date.now(),
        name: isNeed ? 'new_need' : 'new_desire',
        locked: false,
        amount: 0,
        color: isNeed ? '#3b82f6' : '#fcd34d',
        type: isNeed ? 'necesidad' : 'deseo',
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
      this.saveToLocal();
    },
    setDebts(debts) {
      this.debts = debts;
    }
  }
});
