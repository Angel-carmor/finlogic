const yahooFinance = require('yahoo-finance2').default; // try just the default export
async function f() {
    try {
        console.log(await yahooFinance.quote('AAPL'));
    } catch(e) {
        console.error(e);
    }
}
f();
