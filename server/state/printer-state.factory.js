const DITokens = require("../container.tokens");

function PrinterStateFactory(cradle) {
  return {
    async create(printerDocument, isTest = false) {
      const printerState = cradle[DITokens.printerState];

      // Async just in case setup does async stuff in future
      await printerState.setup(printerDocument, isTest);

      return printerState;
    }
  };
}

module.exports = PrinterStateFactory;
