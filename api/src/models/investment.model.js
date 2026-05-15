const db = require('../config/db');

class InvestmentModel {
  static async getAllByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM user_investments WHERE user_id = ? ORDER BY created_at ASC', [userId]);
    return rows;
  }

  static async create(userId, name, ticker, amount, annualReturn = 0, monthlyContribution = 0) {
    const [result] = await db.execute(
      'INSERT INTO user_investments (user_id, name, ticker, amount, annual_return, monthly_contribution) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, ticker, amount, annualReturn, monthlyContribution]
    );
    return result.insertId;
  }

  static async updateAmount(id, amount) {
    const [result] = await db.execute(
      'UPDATE user_investments SET amount = ? WHERE id = ?',
      [amount, id]
    );
    return result.affectedRows;
  }

  static async delete(id, userId) {
    const [result] = await db.execute('DELETE FROM user_investments WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows;
  }
}

module.exports = InvestmentModel;
