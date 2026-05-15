const DebtModel = require('../models/debt.model');
const UserModel = require('../models/user.model');

class DebtController {
  static async getDebts(req, res) {
    try {
      const userId = req.user.id;
      const debts = await DebtModel.getAllByUserId(userId);
      return res.status(200).json({ debts });
    } catch (error) {
      console.error('Error getting debts:', error);
      return res.status(500).json({ error: 'Internal server error while getting debts' });
    }
  }

  static async addDebt(req, res) {
    try {
      const userId = req.user.id;
      const { name, amount, interest_rate, monthly_payment } = req.body;
      
      if (!name || amount === undefined || amount < 0) {
        return res.status(400).json({ error: 'Name and a positive valid amount are required' });
      }

      const rate = parseFloat(interest_rate) || 0;
      const payment = parseFloat(monthly_payment) || 0;
      console.log('DEBUG: Adding debt parameters:', { userId, name, amount, rate, payment });
      const insertId = await DebtModel.create(userId, name, parseFloat(amount), rate, payment);
      const debts = await DebtModel.getAllByUserId(userId);
      const updatedUser = await UserModel.findById(userId);

      return res.status(201).json({ 
        message: 'Debt added successfully',
        debtId: insertId,
        debts,
        total_debt: parseFloat(updatedUser.total_debt) || 0
      });
    } catch (error) {
      console.error('Error adding debt:', error);
      return res.status(500).json({ error: 'Internal server error while adding debt' });
    }
  }

  static async removeDebt(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const affected = await DebtModel.delete(id, userId);
      if (affected === 0) {
         return res.status(404).json({ error: 'Debt not found or unauthorized' });
      }

      const debts = await DebtModel.getAllByUserId(userId);
      const updatedUser = await UserModel.findById(userId);

      return res.status(200).json({ 
        message: 'Debt removed successfully',
        debts,
        total_debt: parseFloat(updatedUser.total_debt) || 0
      });
    } catch (error) {
      console.error('Error removing debt:', error);
      return res.status(500).json({ error: 'Internal server error while removing debt' });
    }
  }

  static async updateDebt(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { name, amount, interest_rate, monthly_payment } = req.body;

      console.log('DEBUG: Updating debt:', { id, userId, name, amount, interest_rate, monthly_payment });

      if (!name || amount === undefined || amount < 0) {
        return res.status(400).json({ error: 'Name and a valid amount are required' });
      }

      const affected = await DebtModel.update(
        id, 
        userId, 
        name, 
        parseFloat(amount), 
        parseFloat(interest_rate) || 0, 
        parseFloat(monthly_payment) || 0
      );

      // We don't return 404 if 0 rows affected, because it could mean no values changed.
      // We only return 404 if we are sure the ID doesn't exist (handled by the DB or a check).
      
      const debts = await DebtModel.getAllByUserId(userId);
      const updatedUser = await UserModel.findById(userId);

      return res.status(200).json({
        message: 'Debt updated successfully',
        debts,
        total_debt: parseFloat(updatedUser.total_debt) || 0
      });
    } catch (error) {
      console.error('CRITICAL ERROR updating debt:', error);
      return res.status(500).json({ error: 'Internal server error while updating debt' });
    }
  }
}

module.exports = DebtController;
