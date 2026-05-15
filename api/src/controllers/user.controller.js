const UserModel = require('../models/user.model');

class UserController {
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, net_monthly_income, extra_income, housing, utilities, has_emergency_fund, stable_job, planning_model, total_debt, debt_strategy } = req.body;
      
      const currentUser = await UserModel.findById(userId);
      const profileData = {
        name: name || currentUser.name,
        net_monthly_income: Math.max(0, parseFloat(net_monthly_income) || 0),
        extra_income: Math.max(0, parseFloat(extra_income) || 0),
        housing: Math.max(0, parseFloat(housing) || 0),
        utilities: Math.max(0, parseFloat(utilities) || 0),
        total_debt: Math.max(0, parseFloat(total_debt) || 0),
        fixed_loads: Math.max(0, (parseFloat(housing) || 0) + (parseFloat(utilities) || 0)),
        has_emergency_fund: Boolean(has_emergency_fund),
        stable_job: Boolean(stable_job),
        planning_model: planning_model || null,
        debt_strategy: debt_strategy || 'avalanche'
      };

      await UserModel.updateProfile(userId, profileData);
      
      const updatedUser = await UserModel.findById(userId);
      
      return res.status(200).json({ 
        user: { 
          id: updatedUser.id, 
          email: updatedUser.email, 
          name: updatedUser.name,
          onboarding_completed: !!updatedUser.onboarding_completed,
          planning_model: updatedUser.planning_model,
          debt_strategy: updatedUser.debt_strategy || 'avalanche',
          net_monthly_income: parseFloat(updatedUser.net_monthly_income) || 0,
          extra_income: parseFloat(updatedUser.extra_income) || 0,
          housing: parseFloat(updatedUser.housing) || 0,
          utilities: parseFloat(updatedUser.utilities) || 0,
          fixed_loads: parseFloat(updatedUser.fixed_loads) || 0,
          total_debt: parseFloat(updatedUser.total_debt) || 0
        } 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Internal server error while updating profile' });
    }
  }
}

module.exports = UserController;
