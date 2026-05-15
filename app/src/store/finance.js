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
    totalMonthlyDebtPayments(state) {
      return state.debts.reduce((sum, d) => sum + (parseFloat(d.monthly_payment) || 0), 0);
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
      const authStore = useAuthStore();
      const user = authStore.user;
      const net = this.netIncome || 1;

      // 1. Vector: Esfuerzo de Vivienda (Peso: 35%)
      const fixedExpenses = state.budgetItems
        .filter(i => i.id === 'housing' || i.id === 'utilities')
        .reduce((acc, i) => acc + i.amount, 0);
      const fixedPct = (fixedExpenses / net) * 100;
      let housingScore = 0;
      if (fixedPct <= 30) housingScore = 35;
      else if (fixedPct < 50) housingScore = 35 * (1 - (fixedPct - 30) / 20);
      
      // 2. Vector: Músculo de Ahorro (Peso: 40%)
      const savingsPct = this.ahorroPct;
      let savingsScore = Math.min(40, (savingsPct / 20) * 40);

      // 3. Vector: Control de Ocio (Peso: 15%)
      const desires = this.deseosAmount;
      const desiresPct = (desires / net) * 100;
      let controlScore = 0;
      if (desiresPct <= 20) controlScore = 15;
      else if (desiresPct < 40) controlScore = 15 * (1 - (desiresPct - 20) / 20);

      // 4. Vector: Seguridad (Peso: 10%)
      let safetyScore = 0;
      if (user?.has_emergency_fund) safetyScore += 6;
      if (user?.stable_job) safetyScore += 4;

      const total = housingScore + savingsScore + controlScore + safetyScore;
      return Math.max(0, Math.min(100, Math.round(total)));
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
        targetNeedsPct = 35; 
        targetDesiresPct = 10;
      } else if (this.currentModelId === 'salvavidas') {
        targetNeedsPct = 65; 
        targetDesiresPct = 5; 
      } else if (this.currentModelId === 'contingencia') {
        targetNeedsPct = 85; 
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
      } else if (this.currentModelId === 'salvavidas') {
         let maxDesires = Math.max(0, remainingPct - 15);
         availableForDesiresPct = Math.min(targetDesiresPct, maxDesires);
      } else if (this.currentModelId === 'contingencia') {
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
      let model = authStore.user?.planning_model || 'equilibrio';
      if (model === 'rescate' || model === 'escudo') model = 'contingencia';
      this.currentModelId = model;
    },
    handleSliderInput(item, newVal) {
      const sanitizedVal = Math.max(0, parseInt(newVal) || 0);
      const sumOtherExpenses = this.sumExpenses - item.amount;
      const maxPossible = this.netIncome - sumOtherExpenses;
      
      let finalVal = sanitizedVal;
      if (finalVal > maxPossible) {
        finalVal = maxPossible;
      }
      
      item.amount = finalVal;
    },
    saveToLocal() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      
      // Perform cleanup: filter out any unlocked item with amount 0 or less
      this.budgetItems = this.budgetItems.filter(item => {
        if (item.locked) return true;
        return item.amount > 0;
      });

      if (userId) {
        localStorage.setItem('finlogic_custom_budget_' + userId, JSON.stringify(this.budgetItems));
        console.log('Presupuesto limpiado y guardado para usuario:', userId);
      } else {
        // Fallback for guest or temporary session
        localStorage.setItem('finlogic_custom_budget_guest', JSON.stringify(this.budgetItems));
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
    addNewSlider(type) {
      const isNeed = type === 'necesidad';
      this.budgetItems.push({
        id: 'custom_' + Date.now(),
        name: isNeed ? 'new_need' : 'new_desire',
        locked: false,
        amount: 1, 
        color: isNeed ? '#3b82f6' : '#fcd34d',
        type: isNeed ? 'necesidad' : 'deseo',
        isCustom: true
      });
      // No saveToLocal here to let user edit it first
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
    },
    async fetchDebts() {
      const { data } = await import('../services/api').then(m => m.default.get('/debts'));
      this.debts = data.debts || [];
    }
  }
});
