const axios = require("axios");
const DITokens = require("./container.tokens");
const PrinterService = require("./services/printer.service");
const PrinterGroupService = require("./services/printer-group.service");
const PrintersStore = require("./state/printers.store");
const SettingsStore = require("./state/settings.store");
const ServerSettingsService = require("./services/server-settings.service");
const ClientSettingsService = require("./services/client-settings.service");
const ServerUpdateService = require("./services/server-update.service");
const InfluxDbSetupService = require("./services/influx/influx-db-setup.service");
const ScriptService = require("./services/script.service");
const TaskManagerService = require("./services/task-manager.service");
const SystemInfoStore = require("./state/system-info.store");
const SystemCommandsService = require("./services/system-commands.service");
const SystemInfoBundleService = require("./services/system-info-bundle.service");
const GithubApiService = require("./services/github-api.service");
const HistoryService = require("./services/history.service");
const FileCache = require("./state/data/file.cache");
const HistoryStore = require("./state/history.store");
const JobsCache = require("./state/data/jobs.cache");
const UserTokenService = require("./services/authentication/user-token.service");
const ServerSentEventsHandler = require("./handlers/sse.handler");
const OctoPrintLogsCache = require("./state/data/octoprint-logs.cache");
const PrinterWebsocketTask = require("./tasks/printer-websocket.task");
const PrinterSseTask = require("./tasks/printer-sse.task");
const PrinterSystemTask = require("./tasks/printer-system.task");
const OctoPrintApiService = require("./services/octoprint/octoprint-api.service");
const FilamentCache = require("./state/data/filament.cache");
const PrinterState = require("./state/printer.state");
const PrinterStateFactory = require("./state/printer-state.factory");
const FilesStore = require("./state/files.store");
const FilamentStore = require("./state/filament.store");
const InfluxDbHistoryService = require("./services/influx/influx-db-history.service");
const InfluxDbFilamentService = require("./services/influx/influx-db-filament.service");
const InfluxDbPrinterStateService = require("./services/influx/influx-db-printer-state.service");
const { configureEventEmitter } = require("./handlers/event-emitter");
const { AppConstants } = require("./server.constants");
const PrinterFilesService = require("./services/printer-files.service");
const SoftwareUpdateTask = require("./tasks/software-update.task");
const AutoDiscoveryService = require("./services/auto-discovery.service");
const TerminalLogsCache = require("./state/data/terminal-logs.cache");
const DashboardStatisticsCache = require("./state/data/dashboard-statistics.cache");
const AlertService = require("./services/alert.service");
const { asFunction, asClass, asValue, createContainer, InjectionMode } = require("awilix");
const LoggerFactory = require("./handlers/logger-factory");
const PrinterTestTask = require("./tasks/printer-test.task");
const PrinterGroupsCache = require("./state/data/printer-groups.cache");
const MulterService = require("./services/multer.service");
const FileUploadTrackerCache = require("./state/data/file-upload-tracker.cache");
const ServerHost = require("./server.host");
const BootTask = require("./tasks/boot.task");
const PrinterProfilesCache = require("./state/data/printer-profiles.cache");
const UserService = require("./services/authentication/user.service");
const RoleService = require("./services/authentication/role.service");
const { ToadScheduler } = require("toad-scheduler");
const { ServerTasks } = require("./tasks");
const PermissionService = require("./services/authentication/permission.service");
const PrinterFileCleanTask = require("./tasks/printer-file-clean.task");
const { ROLES } = require("./constants/authorization.constants");
const CustomGCodeService = require("./services/custom-gcode.service");
const PrinterWebsocketPingTask = require("./tasks/printer-websocket-ping.task");

function configureContainer() {
  // Create the container and set the injectionMode to PROXY (which is also the default).
  const container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  container.register({
    // -- asValue --
    serverVersion: asValue(
      process.env[AppConstants.VERSION_KEY] || AppConstants.defaultServerPageTitle
    ),
    serverPageTitle: asValue(process.env[AppConstants.SERVER_SITE_TITLE_KEY]),
    [DITokens.serverTasks]: asValue(ServerTasks),
    [DITokens.defaultRole]: asValue(ROLES.ADMIN),

    // -- asFunction --
    [DITokens.printerStateFactory]: asFunction(PrinterStateFactory).transient(), // Factory function, transient on purpose!

    // -- asClass --
    [DITokens.serverHost]: asClass(ServerHost).singleton(),
    [DITokens.settingsStore]: asClass(SettingsStore).singleton(),
    [DITokens.serverSettingsService]: asClass(ServerSettingsService),
    [DITokens.clientSettingsService]: asClass(ClientSettingsService),
    [DITokens.userTokenService]: asClass(UserTokenService).singleton(),
    [DITokens.userService]: asClass(UserService),
    [DITokens.roleService]: asClass(RoleService).singleton(), // caches roles
    [DITokens.permissionService]: asClass(PermissionService).singleton(),

    [DITokens.loggerFactory]: asFunction(LoggerFactory).transient(),
    [DITokens.taskManagerService]: asClass(TaskManagerService).singleton(),
    [DITokens.toadScheduler]: asClass(ToadScheduler).singleton(),
    [DITokens.eventEmitter2]: asFunction(configureEventEmitter).singleton(),
    [DITokens.serverUpdateService]: asClass(ServerUpdateService).singleton(),
    [DITokens.systemInfoStore]: asClass(SystemInfoStore).singleton(),
    [DITokens.githubApiService]: asClass(GithubApiService),
    [DITokens.autoDiscoveryService]: asClass(AutoDiscoveryService),
    [DITokens.systemCommandsService]: asClass(SystemCommandsService),
    [DITokens.systemInfoBundleService]: asClass(SystemInfoBundleService),
    [DITokens.httpClient]: asValue(
      axios.create({
        maxBodyLength: 1000 * 1000 * 1000, // 1GB
        maxContentLength: 1000 * 1000 * 1000 // 1GB
      })
    ),
    [DITokens.multerService]: asClass(MulterService).singleton(),
    [DITokens.printerService]: asClass(PrinterService),
    [DITokens.printerFilesService]: asClass(PrinterFilesService),
    [DITokens.printerGroupService]: asClass(PrinterGroupService),
    [DITokens.octoPrintApiService]: asClass(OctoPrintApiService).singleton(),
    [DITokens.historyService]: asClass(HistoryService),
    [DITokens.dashboardStatisticsCache]: asClass(DashboardStatisticsCache),

    [DITokens.filamentCache]: asClass(FilamentCache).singleton(),
    [DITokens.printerProfilesCache]: asClass(PrinterProfilesCache).singleton(),
    [DITokens.printerState]: asClass(PrinterState).transient(), // Transient on purpose!
    [DITokens.printerGroupsCache]: asClass(PrinterGroupsCache).singleton(),
    [DITokens.historyStore]: asClass(HistoryStore).singleton(),
    [DITokens.jobsCache]: asClass(JobsCache).singleton(),
    [DITokens.terminalLogsCache]: asClass(TerminalLogsCache).singleton(),
    [DITokens.octoPrintLogsCache]: asClass(OctoPrintLogsCache).singleton(),
    [DITokens.fileCache]: asClass(FileCache).singleton(),
    [DITokens.fileUploadTrackerCache]: asClass(FileUploadTrackerCache).singleton(),
    [DITokens.filamentStore]: asClass(FilamentStore), // No need for singleton as its now based on filamentCache
    [DITokens.filesStore]: asClass(FilesStore).singleton(),
    [DITokens.printersStore]: asClass(PrintersStore).singleton(),

    // Extensibility and export
    [DITokens.alertService]: asClass(AlertService),
    [DITokens.scriptService]: asClass(ScriptService),
    [DITokens.customGCodeService]: asClass(CustomGCodeService),
    [DITokens.influxDbSetupService]: asClass(InfluxDbSetupService).singleton(),
    [DITokens.influxDbFilamentService]: asClass(InfluxDbFilamentService),
    [DITokens.influxDbHistoryService]: asClass(InfluxDbHistoryService),
    [DITokens.influxDbPrinterStateService]: asClass(InfluxDbPrinterStateService),

    [DITokens.bootTask]: asClass(BootTask),
    [DITokens.softwareUpdateTask]: asClass(SoftwareUpdateTask),
    // Provided SSE handlers (couplers) shared with controllers
    [DITokens.printerSseHandler]: asClass(ServerSentEventsHandler).singleton(),
    // Task bound to send on SSE Handler
    [DITokens.printerSseTask]: asClass(PrinterSseTask).singleton(),
    // This task is a quick task (~100ms per printer)
    [DITokens.printerWebsocketTask]: asClass(PrinterWebsocketTask).singleton(),
    // This task is a recurring heartbeat task
    [DITokens.printerWebsocketPingTask]: asClass(PrinterWebsocketPingTask).singleton(),
    // Task dependent on WS to fire - disabled at boot
    [DITokens.printerSystemTask]: asClass(PrinterSystemTask).singleton(),
    // Task dependent on test printer in store - disabled at boot
    [DITokens.printerTestTask]: asClass(PrinterTestTask).singleton(),
    // Task to regularly clean printer files based on certain configuration settings
    [DITokens.printerFileCleanTask]: asClass(PrinterFileCleanTask).singleton()
  });

  return container;
}

module.exports = {
  configureContainer
};
