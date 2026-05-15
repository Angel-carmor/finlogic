const express = require('express');
const router = express.Router();
const InvestmentController = require('../controllers/investment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', InvestmentController.getInvestments);
router.get('/search', InvestmentController.searchTicker);
router.get('/news', InvestmentController.getNews);
router.post('/', InvestmentController.addInvestment);
router.delete('/:id', InvestmentController.removeInvestment);

module.exports = router;
