const db = require('../config/db');

class DebtModel {
  static async getAllByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM user_debts WHERE user_id = ? ORDER BY created_at ASC', [userId]);
    return rows;
  }

  static async create(userId, name, amount, interestRate = 0, monthlyPayment = 0) {
    const [result] = await db.execute(
      'INSERT INTO user_debts (user_id, name, amount, interest_rate, monthly_payment) VALUES (?, ?, ?, ?, ?)',
      [userId, name, amount, interestRate, monthlyPayment]
    );

    // Update global total_debt automatically as well (to keep backward compatibility)
    await db.execute(
       'UPDATE users SET total_debt = (SELECT COALESCE(SUM(amount), 0) FROM user_debts WHERE user_id = ?) WHERE id = ?',
       [userId, userId]
    );

    return result.insertId;
  }

  static async delete(id, userId) {
    const [result] = await db.execute('DELETE FROM user_debts WHERE id = ? AND user_id = ?', [id, userId]);

    // Update global total_debt automatically
    await db.execute(
       'UPDATE users SET total_debt = (SELECT COALESCE(SUM(amount), 0) FROM user_debts WHERE user_id = ?) WHERE id = ?',
       [userId, userId]
    );

    return result.affectedRows;
  }

  static async update(id, userId, name, amount, interestRate, monthlyPayment) {
    const [result] = await db.execute(
      'UPDATE user_debts SET name = ?, amount = ?, interest_rate = ?, monthly_payment = ? WHERE id = ? AND user_id = ?',
      [name, amount, interestRate, monthlyPayment, id, userId]
    );

    // Update global total_debt automatically
    await db.execute(
       'UPDATE users SET total_debt = (SELECT COALESCE(SUM(amount), 0) FROM user_debts WHERE user_id = ?) WHERE id = ?',
       [userId, userId]
    );

    return result.affectedRows;
  }
}

module.exports = DebtModel;
