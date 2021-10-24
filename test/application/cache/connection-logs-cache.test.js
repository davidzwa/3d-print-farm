const { configureContainer } = require("../../../server/container");
const DITokens = require("../../../server/container.tokens");
const dbHandler = require("../../db-handler");

let container;
let terminalLogsCache;
let printersStore;

beforeAll(async () => {
  await dbHandler.connect();
  container = configureContainer();
  terminalLogsCache = container.resolve(DITokens.terminalLogsCache);
  printersStore = container.resolve(DITokens.printersStore);
  await printersStore.loadPrintersStore();
});
afterEach(async () => {
  await dbHandler.clearDatabase();
});
afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe(DITokens.terminalLogsCache, () => {
  it("should resolve", async () => {
    expect(terminalLogsCache).toBeDefined();
  });

  it("should run generateConnectionLogs just fine", async () => {
    const printerState = await printersStore.addPrinter({
      printerURL: "http://url.com",
      webSocketURL: "ws://url.com",
      apiKey: "3dhub3dhub3dhub3dhub3dhub3dhubbb",
      tempTriggers: { heatingVariation: null }
    });
    await terminalLogsCache.getPrinterTerminalLogs(printerState.id);
  });
});
