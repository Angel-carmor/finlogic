const InvestmentModel = require('./src/models/investment.model');
const db = require('./src/config/db'); // assuming db is initialized here or somewhere

async function test() {
  try {
    const invs = await InvestmentModel.getAllByUserId(1); // assuming user 1
    console.log(invs);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
test();
