const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/budget.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/snapshot', BudgetController.saveSnapshot);
router.post('/reopen', BudgetController.deleteSnapshot);
router.get('/tracking', BudgetController.getTracking);
router.get('/history', BudgetController.getHistory);

module.exports = router;
