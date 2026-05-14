const db = require('../config/db');

class UserModel {
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(email, passwordHash) {
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return result.insertId;
  }

  static async updateProfile(id, profileData) {
    const { net_monthly_income, fixed_loads, housing, utilities, total_debt, has_emergency_fund, stable_job, planning_model, debt_strategy } = profileData;
    const [result] = await db.execute(
      'UPDATE users SET net_monthly_income = ?, fixed_loads = ?, housing = ?, utilities = ?, total_debt = ?, has_emergency_fund = ?, stable_job = ?, planning_model = ?, debt_strategy = ?, onboarding_completed = TRUE WHERE id = ?',
      [net_monthly_income, fixed_loads, housing, utilities, total_debt, has_emergency_fund, stable_job, planning_model, debt_strategy || 'avalanche', id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = UserModel;
