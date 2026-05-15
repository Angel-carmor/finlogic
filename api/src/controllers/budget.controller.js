const BudgetModel = require('../models/budget.model');

class BudgetController {
  /**
   * POST /api/budget/snapshot
   * Body: { year, month, items: [{id, name, amount, type}] }
   * Persiste el presupuesto planificado del usuario para el mes indicado.
   */
  static async saveSnapshot(req, res) {
    try {
      const userId = req.user.id;
      const { items, income, totalDebt } = req.body;
      const year  = parseInt(req.body.year, 10);
      const month = parseInt(req.body.month, 10);

      if (!year || !month || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'year, month and items[] are required' });
      }

      await BudgetModel.saveBudgetSnapshot(userId, year, month, items, { income, totalDebt });
      return res.status(200).json({ message: 'Budget snapshot saved successfully' });
    } catch (error) {
      console.error('Error saving budget snapshot:', error);
      return res.status(500).json({ error: 'Internal server error saving snapshot' });
    }
  }

  /**
   * GET /api/budget/tracking?year=2026&month=5
   * Devuelve el objeto de tracking combinado: límites + gasto real + mes anterior.
   */
  static async getTracking(req, res) {
    try {
      const userId = req.user.id;
      const year  = parseInt(req.query.year,  10) || new Date().getFullYear();
      const month = parseInt(req.query.month, 10) || (new Date().getMonth() + 1);

      if (month < 1 || month > 12) {
        return res.status(400).json({ error: 'Month must be between 1 and 12' });
      }

      const data = await BudgetModel.getTrackingData(userId, year, month);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error getting tracking data:', error);
      return res.status(500).json({ error: 'Internal server error getting tracking data' });
    }
  }

  /**
   * GET /api/budget/history?year=2026
   * Devuelve el resumen anual de meses cerrados para el calendario.
   */
  static async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const year = parseInt(req.query.year, 10) || new Date().getFullYear();

      const history = await BudgetModel.getYearHistory(userId, year);
      const globalTotalSavings = await BudgetModel.getTotalSavings(userId);
      return res.status(200).json({ history, globalTotalSavings });
    } catch (error) {
      console.error('Error getting budget history:', error);
      return res.status(500).json({ error: 'Internal server error getting history' });
    }
  }

  /**
   * DELETE /api/budget/snapshot
   * Body: { year, month }
   */
  static async deleteSnapshot(req, res) {
    try {
      const userId = req.user.id;
      const year = parseInt(req.body.year, 10) || new Date().getFullYear();
      const month = parseInt(req.body.month, 10) || (new Date().getMonth() + 1);

      await BudgetModel.deleteSnapshot(userId, year, month);
      return res.status(200).json({ message: 'Snapshot deleted successfully' });
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      return res.status(500).json({ error: 'Internal server error deleting snapshot' });
    }
  }
}

module.exports = BudgetController;
