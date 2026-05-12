const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'TU_SECRET_JWT';

class AuthService {
  static async register(email, password) {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = await UserModel.create(email, passwordHash);
    
    // Generate token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '1d' });
    
    return { user: { id: userId, email, onboarding_completed: false }, token };
  }

  static async login(email, password) {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    
    const payload = { 
      id: user.id, 
      email: user.email, 
      onboarding_completed: !!user.onboarding_completed,
      planning_model: user.planning_model,
      net_monthly_income: parseFloat(user.net_monthly_income) || 0,
      fixed_loads: parseFloat(user.fixed_loads) || 0,
      total_debt: parseFloat(user.total_debt) || 0,
      housing: parseFloat(user.housing) || 0,
      utilities: parseFloat(user.utilities) || 0
    };
    
    return { user: payload, token };
  }
}

module.exports = AuthService;
