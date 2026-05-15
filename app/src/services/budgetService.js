import api from './api';

export default {
  /**
   * Persiste el snapshot del presupuesto actual para el mes indicado.
   * @param {number} year
   * @param {number} month
   * @param {Array} items - budgetItems del finance store
   */
  saveSnapshot(year, month, items, income, totalDebt) {
    return api.post('/budget/snapshot', { year, month, items, income, totalDebt });
  },

  /**
   * Elimina un snapshot para reabrir el mes.
   */
  deleteSnapshot(year, month) {
    return api.post('/budget/reopen', { year, month });
  },

  /**
   * Obtiene los datos de tracking combinados para un mes.
   * @param {number} year
   * @param {number} month
   */
  getTracking(year, month) {
    return api.get('/budget/tracking', { params: { year, month } });
  },

  /**
   * Obtiene el historial anual de meses con snapshots.
   */
  getHistory(year) {
    return api.get('/budget/history', { params: { year } });
  },
};
