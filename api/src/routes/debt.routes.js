const express = require('express');
const router = express.Router();
const DebtController = require('../controllers/debt.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', DebtController.getDebts);
router.post('/', DebtController.addDebt);
router.put('/:id', DebtController.updateDebt);
router.delete('/:id', DebtController.removeDebt);

module.exports = router;
