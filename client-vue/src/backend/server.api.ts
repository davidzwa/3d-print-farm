export class ServerApi {
  static base = "api";
  static amIAliveRoute = ServerApi.base + "/amialive";
  static printerRoute = ServerApi.base + "/printer";
  static printerTestConnectionRoute = ServerApi.printerRoute + "/test-connection";
  static printerGroupsRoute = ServerApi.base + "/printer-groups";
  static printerFilesRoute = ServerApi.base + "/printer-files";
  static printerNetworkRoute = ServerApi.base + "/printer-network";
  static scanSsdp = ServerApi.printerNetworkRoute + "/scan-ssdp";
  static settingsRoute = ServerApi.base + "/settings";
  static serverSettingsRoute = ServerApi.settingsRoute + "/server";
  static serverLogsRoute = `${ServerApi.serverSettingsRoute}/logs`;
  static generateLogsDumpRoute = `${ServerApi.serverLogsRoute}/generate-log-dump`;
  static serverRestartRoute = `${ServerApi.serverSettingsRoute}/restart`;
  static clientSettingsRoute = ServerApi.settingsRoute + "/client";
  static customGCodeSettingsRoutes = ServerApi.settingsRoute + "/custom-gcode";
  static clientRoute = ServerApi.base + "/client";
  static clientFilterRoute = ServerApi.clientRoute + "/filter";
  static clientSortingRoute = ServerApi.clientRoute + "/sorting";
  static historyRoute = ServerApi.base + "/history";
  static historyStatsRoute = ServerApi.historyRoute + "/stats";
  static filamentRoute = ServerApi.base + "/filament";
  static filamentDropdownListRoute = ServerApi.filamentRoute + "/dropDownList";
  static filamentProfilesRoute = ServerApi.filamentRoute + "/profiles";
  static filamentSpoolsRoute = ServerApi.filamentRoute + "/spools";
  static filamentSelectRoute = ServerApi.filamentRoute + "/select";
  static filamentManagerRoute = ServerApi.filamentRoute + "/filament-manager";
  static filamentManagerReSyncRoute = ServerApi.filamentManagerRoute + "/resync";
  static filamentManagerSyncRoute = ServerApi.filamentManagerRoute + "/sync";
  static filamentManagerDisableRoute = ServerApi.filamentManagerRoute + "/disable";
  static alertRoute = ServerApi.base + "/alert";
  static testAlertScriptRoute = ServerApi.alertRoute + "/test-alert-script";
  static roomDataRoute = ServerApi.base + "/room-data";

  static printerEnabledRoute = (id: string) => ServerApi.printerRoute + `/${id}/enabled`;
}
