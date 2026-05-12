const InvestmentModel = require('../models/investment.model');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

class InvestmentController {
  static async getInvestments(req, res) {
    try {
      const userId = req.user.id;
      let investments = await InvestmentModel.getAllByUserId(userId);

      // Enhance with real-time market data
      investments = await Promise.all(investments.map(async (inv) => {
        let marketData = null;
        if (inv.ticker) {
          try {
            const quote = await yahooFinance.quote(inv.ticker);
            marketData = {
              price: quote.regularMarketPrice,
              change: quote.regularMarketChange,
              changePercent: quote.regularMarketChangePercent
            };
          } catch (err) {
            console.error(`Error fetching ticker ${inv.ticker}:`, err.message);
          }
        }
        return { ...inv, marketData };
      }));

      return res.status(200).json({ investments });
    } catch (error) {
      console.error('Error getting investments:', error);
      return res.status(500).json({ error: 'Internal server error while getting investments' });
    }
  }

  static async searchTicker(req, res) {
    try {
      const { q } = req.query;
      if (!q || q.length < 2) return res.json({ results: [] });
      
      const searchResult = await yahooFinance.search(q);
      const results = searchResult.quotes
        .filter(q => q.isYahooFinance)
        .slice(0, 5)
        .map(q => ({
          ticker: q.symbol,
          name: q.shortname || q.longname,
          exch: q.exchDisp
        }));

      return res.status(200).json({ results });
    } catch (error) {
      console.error('Error searching ticker:', error);
      return res.status(500).json({ error: 'Error searching ticker' });
    }
  }

  static async addInvestment(req, res) {
    try {
      const userId = req.user.id;
      const { name, ticker, amount, annual_return, monthly_contribution } = req.body;
      
      if (!name || amount === undefined || amount < 0) {
        return res.status(400).json({ error: 'Name and a valid amount are required' });
      }

      const rate = parseFloat(annual_return) || 0;
      const contribution = parseFloat(monthly_contribution) || 0;
      const insertId = await InvestmentModel.create(userId, name, ticker || null, parseFloat(amount), rate, contribution);
      // Not fetching market data here to keep it fast, client will re-fetch list if needed.
      const investments = await InvestmentModel.getAllByUserId(userId);

      return res.status(201).json({ 
        message: 'Investment added successfully',
        investmentId: insertId,
        investments
      });
    } catch (error) {
      console.error('Error adding investment:', error);
      return res.status(500).json({ error: 'Internal server error while adding investment' });
    }
  }

  static async removeInvestment(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const affected = await InvestmentModel.delete(id, userId);
      if (affected === 0) {
         return res.status(404).json({ error: 'Investment not found or unauthorized' });
      }

      const investments = await InvestmentModel.getAllByUserId(userId);

      return res.status(200).json({ 
        message: 'Investment removed successfully',
        investments
      });
    } catch (error) {
      console.error('Error removing investment:', error);
      return res.status(500).json({ error: 'Internal server error while removing investment' });
    }
  }
}

module.exports = InvestmentController;
