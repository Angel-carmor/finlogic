const db = require('../config/db');

// Mapa de equivalencias: id de palanca (español) → category en transactions (inglés)
const CATEGORY_MAP = {
  housing:       'Housing',
  utilities:     'Utilities',
  alimentacion:  'Food',
  transporte:    'Transport',
  ocio:          'Leisure',
};

// Mapa inverso para reconstruir snapshots desde transactions
const CATEGORY_MAP_INV = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

class BudgetModel {
  /**
   * Guarda o actualiza los límites de presupuesto de un mes concreto.
   * @param {number} userId
   * @param {number} year
   * @param {number} month
   * @param {Array<{id, name, amount, type}>} items - budgetItems del store
   */
  static async saveBudgetSnapshot(userId, year, month, items, summary = {}) {
    // 1. Guardar categorías individuales
    const promises = items.map(item => {
      let category = (CATEGORY_MAP[item.id] || item.name).toLowerCase().trim();
      return db.execute(
        `INSERT INTO monthly_budget_snapshots (user_id, year, month, category, budget_limit, category_type)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE budget_limit = VALUES(budget_limit), updated_at = CURRENT_TIMESTAMP`,
        [userId, year, month, category, item.amount, item.type]
      );
    });

    // 2. Guardar resumen como filas especiales
    if (summary.income) {
      promises.push(db.execute(
        `INSERT INTO monthly_budget_snapshots (user_id, year, month, category, budget_limit, category_type)
         VALUES (?, ?, ?, '__income_ref__', ?, 'necesidad')
         ON DUPLICATE KEY UPDATE budget_limit = VALUES(budget_limit), updated_at = CURRENT_TIMESTAMP`,
        [userId, year, month, summary.income]
      ));
    }
    if (summary.totalDebt) {
      promises.push(db.execute(
        `INSERT INTO monthly_budget_snapshots (user_id, year, month, category, budget_limit, category_type)
         VALUES (?, ?, ?, '__total_debt__', ?, 'necesidad')
         ON DUPLICATE KEY UPDATE budget_limit = VALUES(budget_limit), updated_at = CURRENT_TIMESTAMP`,
        [userId, year, month, summary.totalDebt]
      ));
    }

    await Promise.all(promises);
  }

  /**
   * Recupera el snapshot de presupuesto guardado para un mes.
   */
  static async getBudgetSnapshot(userId, year, month) {
    const [rows] = await db.execute(
      `SELECT category, budget_limit, category_type
       FROM monthly_budget_snapshots
       WHERE user_id = ? AND year = ? AND month = ?`,
      [userId, year, month]
    );

    const categories = [];
    let income = 0;
    let totalDebt = 0;

    rows.forEach(r => {
      const catName = r.category.toLowerCase().trim();
      if (catName === '__income_ref__') income = parseFloat(r.budget_limit);
      else if (catName === '__total_debt__') totalDebt = parseFloat(r.budget_limit);
      else {
        // Normalizamos el nombre de la categoría para el frontend
        categories.push({
          ...r,
          category: catName
        });
      }
    });

    return { categories, income, totalDebt };
  }

  /**
   * Agrega el gasto real desde la tabla transactions por categoría y mes.
   */
  static async getMonthlySpending(userId, year, month) {
    // Buscamos todos los gastos del mes para este usuario
    const [rows] = await db.execute(
      `SELECT category, SUM(amount) AS total_spent
       FROM transactions
       WHERE user_id = ? 
         AND type = 'expense'
         AND YEAR(date) = ? 
         AND MONTH(date) = ?
       GROUP BY category`,
      [userId, year, month]
    );
    return rows;
  }

  /**
   * Devuelve el objeto combinado de tracking para un mes:
   * snapshot de límites + gasto real + gasto del mes anterior.
   */
  static async getTrackingData(userId, year, month) {
    const prevYear  = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;

    const [snapResult, prevSnapResult] = await Promise.all([
      BudgetModel.getBudgetSnapshot(userId, year, month),
      BudgetModel.getBudgetSnapshot(userId, prevYear, prevMonth)
    ]);

    const { categories: snapshot, income, totalDebt } = snapResult;
    const { categories: prevSnapshot, income: prevIncome, totalDebt: prevTotalDebt } = prevSnapResult;

    // 1. Mapa de presupuesto del mes anterior
    let prevTotalBudget = 0;
    const prevMap = {};
    prevSnapshot.forEach(s => {
      const val = parseFloat(s.budget_limit || 0);
      prevMap[s.category.toLowerCase().trim()] = val;
      prevTotalBudget += val;
    });

    // 2. Mapear categorías del snapshot actual con su equivalente anterior
    const categories = snapshot.map(s => {
      const catName = s.category.toLowerCase().trim();
      return {
        category:     catName,
        type:         s.category_type,
        budget_limit: parseFloat(s.budget_limit || 0),
        prev_limit:   prevMap[catName] || 0
      };
    });

    // 3. Calcular totales
    const totalBudget = categories.reduce((sum, c) => sum + c.budget_limit, 0);
    
    // Ahorro Planificado = Ingresos - Total de Sliders
    const savings = income > 0 ? (income - totalBudget) : 0;
    const prevSavings = prevIncome > 0 ? (prevIncome - prevTotalBudget) : 0;

    return { 
      year, 
      month, 
      categories, 
      totalBudget, 
      income, 
      totalDebt, 
      savings,
      prev_total_budget: prevTotalBudget,
      prev_income: prevIncome,
      prev_total_debt: prevTotalDebt,
      prev_savings: prevSavings
    };
  }

  /**
   * Devuelve un resumen por mes para un año dado (para el calendario heatmap).
   * @param {number} userId
   * @param {number} year
   * @returns {Array<{month, totalBudget, totalSpent, pct, status}>}
   */
  static async getYearHistory(userId, year) {
    const [rows] = await db.execute(
      `SELECT month, category, budget_limit, category_type
       FROM monthly_budget_snapshots
       WHERE user_id = ? AND year = ?`,
      [userId, year]
    );

    const historyMap = {};
    rows.forEach(r => {
      const m = r.month;
      if (!historyMap[m]) {
        historyMap[m] = { month: m, income: 0, needs: 0, wants: 0, savings: 0 };
      }

      const catName = r.category.toLowerCase().trim();
      const val = parseFloat(r.budget_limit || 0);

      if (catName === '__income_ref__') {
        historyMap[m].income = val;
      } else if (catName === '__total_debt__') {
        // Ignorar
      } else {
        if (r.category_type === 'necesidad') historyMap[m].needs += val;
        else if (r.category_type === 'deseo') historyMap[m].wants += val;
      }
    });

    const results = Object.values(historyMap).map(m => {
      m.savings = m.income - (m.needs + m.wants);
      const sP = m.income > 0 ? (m.savings / m.income) * 100 : 0;
      m.status = sP >= 20 ? 'ok' : (sP >= 10 ? 'warning' : 'danger');
      return m;
    });

    return results.sort((a, b) => a.month - b.month);
  }

  /**
   * Elimina un snapshot de presupuesto para "reabrir" el mes.
   */
  static async deleteSnapshot(userId, year, month) {
    await db.execute(
      `DELETE FROM monthly_budget_snapshots
       WHERE user_id = ? AND year = ? AND month = ?`,
      [userId, year, month]
    );
  }

  /**
   * Calcula el ahorro total acumulado de todos los tiempos para el usuario.
   */
  static async getTotalSavings(userId) {
    const [rows] = await db.execute(
      `SELECT year, month, category, budget_limit, category_type
       FROM monthly_budget_snapshots
       WHERE user_id = ?`,
      [userId]
    );

    const monthMap = {};
    rows.forEach(r => {
      const key = `${r.year}-${r.month}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
      
      const val = parseFloat(r.budget_limit || 0);
      const cat = r.category.toLowerCase().trim();

      if (cat === '__income_ref__') {
        monthMap[key].income = val;
      } else if (cat !== '__total_debt__') {
        monthMap[key].expenses += val;
      }
    });

    return Object.values(monthMap).reduce((sum, m) => {
      // Solo sumamos si el mes tiene ingresos registrados, 
      // de lo contrario es un mes incompleto o erróneo.
      if (m.income > 0) {
        return sum + (m.income - m.expenses);
      }
      return sum;
    }, 0);
  }
}

module.exports = BudgetModel;
