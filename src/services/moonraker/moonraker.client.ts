import axios, { AxiosResponse, AxiosStatic } from "axios";
import { ServerInfoDto } from "@/services/moonraker/dto/server/server-info.dto";
import { LoginDto } from "@/services/interfaces/login.dto";
import { ResultDto } from "./dto/rest/result.dto";
import { ServerConfigDto } from "@/services/moonraker/dto/server/server-config.dto";
import { TemperatureStoreDto } from "@/services/moonraker/dto/temperature-store.dto";
import { GcodeStoreDto } from "@/services/moonraker/dto/gcode-store.dto";
import { ActionResultDto } from "@/services/moonraker/dto/rest/action-result.dto";
import { PrinterInfoDto } from "@/services/moonraker/dto/printer-info.dto";
import { KnownPrinterObject, PrinterAvailableObjects } from "@/services/moonraker/dto/objects/printer-objects-list.dto";
import { PrinterQueryEndstopsDto } from "@/services/moonraker/dto/printer-query-endstops.dto";
import { GcodeHelpDto } from "@/services/moonraker/dto/gcode-help.dto";
import { MachineSystemInfoDto } from "@/services/moonraker/dto/machine/machine-system-info.dto";
import { ProcessStatsDto } from "@/services/moonraker/dto/process-stats.dto";
import { SudoInfoDto } from "@/services/moonraker/dto/sudo-info.dto";
import { SudoResponseDto } from "@/services/moonraker/dto/sudo-response.dto";
import { MachinePeripheralsUsbDto } from "@/services/moonraker/dto/machine/machine-peripherals-usb.dto";
import { MachinePeripheralsSerialDto } from "@/services/moonraker/dto/machine/machine-peripherals-serial.dto";
import { MachinePeripheralsVideoDto } from "@/services/moonraker/dto/machine/machine-peripherals-video.dto";
import { MachinePeripheralsCanbusDto } from "@/services/moonraker/dto/machine/machine-peripherals-canbus.dto";
import { ServerFileDto } from "@/services/moonraker/dto/server-files/server-file.dto";
import { ServerFileRootDto } from "@/services/moonraker/dto/server-files/server-file-root.dto";
import { ServerFileMetadataDto } from "@/services/moonraker/dto/server-files/server-file-metadata.dto";
import { ServerFileThumbnailDto } from "@/services/moonraker/dto/server-files/server-file-thumbnail.dto";
import { ServerFileDirectoryInfoDto } from "@/services/moonraker/dto/server-files/server-file-directory-info.dto";
import {
  ServerFileDirectoryActionDto,
  ServerFileDirectoryMovedDto,
} from "@/services/moonraker/dto/server-files/server-file-directory-action.dto";
import { ServerFileZipActionDto } from "@/services/moonraker/dto/server-files/server-file-zip-action.dto";
import FormData from "form-data";
import { createReadStream, ReadStream } from "fs";
import { uploadProgressEvent } from "@/constants/event.constants";
import EventEmitter2 from "eventemitter2";
import { AccessLoginResultDto } from "@/services/moonraker/dto/access/access-login-result.dto";
import { AccessUserResultDto } from "@/services/moonraker/dto/access/access-user-result.dto";
import { AccessUserDto } from "@/services/moonraker/dto/access/access-user.dto";
import { AccessLoginRefreshDto } from "@/services/moonraker/dto/access/access-login-refresh.dto";
import { AccessInfoDto } from "@/services/moonraker/dto/access/access-info.dto";
import { DatabaseNamespaceListDto, Namespaces } from "@/services/moonraker/dto/database/database-namespace-list.dto";
import { DatabaseNamespaceItemDto } from "@/services/moonraker/dto/database/database-namespace-item.dto";
import { JobQueueStatusDto } from "@/services/moonraker/dto/job-queue/job-queue-status.dto";
import { EnqueueJobDto } from "@/services/moonraker/dto/job-queue/enqueue-job.dto";
import { AnnouncementListDto } from "@/services/moonraker/dto/server-announcements/announcement-list.dto";
import { AnnouncementEntryIdDto } from "@/services/moonraker/dto/server-announcements/announcement-entry-id.dto";
import { AnnouncementFeedsDto } from "@/services/moonraker/dto/server-announcements/announcement-feeds.dto";
import { AnnouncementActionDto } from "@/services/moonraker/dto/server-announcements/announcement-action.dto";
import { WebcamDto, WebcamListDto } from "@/services/moonraker/dto/server-webcams/webcam-list.dto";
import { WebcamItemDto } from "@/services/moonraker/dto/server-webcams/webcam-item.dto";
import { WebcamTestDto } from "@/services/moonraker/dto/server-webcams/webcam-test.dto";
import { NotifierListDto } from "@/services/moonraker/dto/notifier-list.dto";
import { MachineUpdateStatusDto } from "@/services/moonraker/dto/machine/machine-update-status.dto";
import { MachineDevicePowerDevicesDto } from "@/services/moonraker/dto/machine/machine-device-power-devices.dto";
import { MachineDevicePowerDeviceStateDto } from "@/services/moonraker/dto/machine/machine-device-power-device-state.dto";
import { MachineWledStripsDto } from "@/services/moonraker/dto/machine/machine-wled-strips.dto";
import { JsonRpcResponseDto } from "@/services/moonraker/dto/rpc/json-rpc-response.dto";
import { JsonRpcRequestDto } from "@/services/moonraker/dto/rpc/json-rpc-request.dto";
import { SensorListDto } from "@/services/moonraker/dto/server-sensors/sensor-list.dto";
import { SensorsMeasurementsDto } from "@/services/moonraker/dto/server-sensors/sensor-measurements.dto";
import { SensorDto } from "@/services/moonraker/dto/server-sensors/sensor-info.dto";
import { SpoolmanStatusDto } from "@/services/moonraker/dto/spoolman/spoolman-status.dto";
import { SpoolmanActiveSpoolDto } from "@/services/moonraker/dto/spoolman/spoolman-active-spool.dto";
import { SpoolmanProxyRequestDto } from "@/services/moonraker/dto/spoolman/spoolman-proxy-request.dto";
import { SpoolmanResponseDto } from "@/services/moonraker/dto/spoolman/spoolman-response.dto";
import { ApiVersionDto } from "@/services/moonraker/dto/octoprint-compat/api-version.dto";
import { ServerVersionDto } from "@/services/moonraker/dto/octoprint-compat/server-version.dto";
import { ApiLoginDto } from "@/services/moonraker/dto/octoprint-compat/api-login.dto";
import { ApiSettingsDto } from "@/services/moonraker/dto/octoprint-compat/api-settings.dto";
import { ApiJobDto } from "@/services/moonraker/dto/octoprint-compat/api-job.dto";
import { ApiPrinterDto } from "@/services/moonraker/dto/octoprint-compat/api-printer.dto";
import { ApiProfilesDto } from "@/services/moonraker/dto/octoprint-compat/api-profiles.dto";
import { HistoryListDto } from "@/services/moonraker/dto/server-history/history-list.dto";
import { HistoryTotalsDto } from "@/services/moonraker/dto/server-history/history-totals.dto";
import { HistoryLastTotalsDto } from "@/services/moonraker/dto/server-history/history-last-totals.dto";
import { HistoryJobDto } from "@/services/moonraker/dto/server-history/history-job.dto";
import { PrinterObjectsQueryDto } from "@/services/moonraker/dto/objects/printer-objects-query.dto";

export class MoonrakerClient {
  private httpClient: AxiosStatic;
  private eventEmitter2: EventEmitter2;

  constructor({ httpClient, eventEmitter2 }: { httpClient: AxiosStatic; eventEmitter2: EventEmitter2 }) {
    this.httpClient = httpClient;
    this.eventEmitter2 = eventEmitter2;
  }

  async getServerInfo(login: LoginDto) {
    return this.httpClient.get<ResultDto<ServerInfoDto>>(`${login.printerURL}/server/info`);
  }

  async getServerConfig(login: LoginDto) {
    return this.httpClient.get<ResultDto<ServerConfigDto>>(`${login.printerURL}/server/config`);
  }

  async getTemperatureStore(login: LoginDto, includeMonitors: boolean = false) {
    return this.httpClient.get<ResultDto<TemperatureStoreDto>>(
      `${login.printerURL}/server/temperature_store?include_monitors=${!!includeMonitors}`
    );
  }

  async getGcodeStore(login: LoginDto, count: number = 100) {
    return this.httpClient.get<ResultDto<GcodeStoreDto>>(`${login.printerURL}/server/gcode_store?count=${count}`);
  }

  async postRolloverLogs(login: LoginDto, application: "moonraker" | "klipper" | "" = "") {
    return this.httpClient.post<ResultDto<GcodeStoreDto>>(`${login.printerURL}/server/logs/rollover`, { application });
  }

  async postRestartServer(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/server/restart`);
  }

  async postJsonRpc<I, O>(login: LoginDto, method: string, params?: I, id?: number) {
    return this.httpClient.post<JsonRpcResponseDto<O>, AxiosResponse<JsonRpcResponseDto<O>>, JsonRpcRequestDto<I>>(
      `${login.printerURL}/server/jsonrpc`,
      {
        jsonrpc: "2.0",
        id: id ? id : 0,
        method,
        params,
      }
    );
  }

  async getPrinterInfo(login: LoginDto) {
    return this.httpClient.post<ResultDto<PrinterInfoDto>>(`${login.printerURL}/printer/info`);
  }

  async postQuickStop(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/emergency_stop`);
  }

  async postHostRestart(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/restart`);
  }

  async postFirmwareRestart(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/firmware_restart`);
  }

  async getPrinterObjectsList(login: LoginDto) {
    return this.httpClient.get<ResultDto<PrinterAvailableObjects>>(`${login.printerURL}/printer/objects/list`);
  }

  async getPrinterObjectsQuery<R = PrinterObjectsQueryDto>(
    login: LoginDto,
    query: Partial<Record<KnownPrinterObject, string[]>>
  ) {
    const queryString = this.convertToQueryString(query);
    return this.httpClient.get<ResultDto<R>>(`${login.printerURL}/printer/objects/query?${queryString}`);
  }

  postSubscribePrinterObjects<R = PrinterObjectsQueryDto>(
    login: LoginDto,
    connectionId: number,
    query: Partial<Record<KnownPrinterObject, string[]>>
  ) {
    const queryString = this.convertToQueryString(query);
    return this.httpClient.post<ResultDto<R>>(
      `${login.printerURL}/printer/objects/subscribe?connection_id=${connectionId}&${queryString}`
    );
  }

  private convertToQueryString(query: Partial<Record<KnownPrinterObject, string[]>>): string {
    return Object.entries(query)
      .reduce((acc, [key, value]) => {
        if (value.length > 0) {
          acc.push(`${key}=${value.join(",")}`);
        } else {
          acc.push(key);
        }
        return acc;
      }, [])
      .join("&");
  }

  async getPrinterQueryEndstops(login: LoginDto) {
    return this.httpClient.get<ResultDto<PrinterQueryEndstopsDto>>(`${login.printerURL}/printer/query-endstops`);
  }

  async postGcodeScript(login: LoginDto, script: string = "G28") {
    return this.httpClient.get<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/gcode/script?script=${script}`);
  }

  async getGcodeHelp(login: LoginDto) {
    return this.httpClient.get<ResultDto<GcodeHelpDto>>(`${login.printerURL}/printer/gcode/help`);
  }

  async postPrintStart(login: LoginDto, filename: string) {
    // will throw 400 if SD busy
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/print/start?filename=${filename}`);
  }

  async postPrintPause(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/print/pause`);
  }

  async postPrintResume(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/print/resume`);
  }

  async postPrintCancel(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/printer/print/cancel`);
  }

  async getMachineSystemInfo(login: LoginDto) {
    return this.httpClient.get<ResultDto<MachineSystemInfoDto>>(`${login.printerURL}/machine/system_info`);
  }

  async postMachineShutdown(login: LoginDto) {
    // Will result in error.
    return this.httpClient.post<null>(`${login.printerURL}/machine/shutdown`);
  }

  async postMachineReboot(login: LoginDto) {
    // Will result in error.
    return this.httpClient.post<null>(`${login.printerURL}/machine/reboot`);
  }

  async postMachineRestartService(
    login: LoginDto,
    service: "crowsnest" | "MoonCord" | "moonraker" | "moonraker-telegram-bot" | "klipper" | "KlipperScreen" | "sonar" | "webcamd"
  ) {
    // Can result in 500 if klipper fails to start
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/services/restart?service=${service}`);
  }

  async postMachineStartService(login: LoginDto, service: "webcamd" | "klipper") {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/services/restart?service=${service}`);
  }

  async postMachineProcessStats(login: LoginDto) {
    // Will result in error.
    return this.httpClient.post<ResultDto<ProcessStatsDto>>(`${login.printerURL}/machine/proc_stats`);
  }

  async getMachineSudoInfo(login: LoginDto, checkAccess: boolean = false) {
    return this.httpClient.get<ResultDto<SudoInfoDto>>(`${login.printerURL}/machine/sudo/info?check_access=${checkAccess}`);
  }

  async postMachineSetSudoPassword(login: LoginDto, password: string) {
    // Does not persist across reboots
    return this.httpClient.post<ResultDto<SudoResponseDto>>(`${login.printerURL}/machine/sudo/password`, {
      password,
    });
  }

  async getMachineListPeripheralsUsb(login: LoginDto) {
    return this.httpClient.get<ResultDto<MachinePeripheralsUsbDto>>(`${login.printerURL}/machine/peripherals/usb`);
  }

  async getMachineListPeripheralsSerial(login: LoginDto) {
    return this.httpClient.get<ResultDto<MachinePeripheralsSerialDto>>(`${login.printerURL}/machine/peripherals/serial`);
  }

  async getMachineListPeripheralsVideo(login: LoginDto) {
    return this.httpClient.get<ResultDto<MachinePeripheralsVideoDto>>(`${login.printerURL}/machine/peripherals/video`);
  }

  async getMachineListPeripheralsCanbus(login: LoginDto, canInterface: "can0" | "can1" | string = "can0") {
    return this.httpClient.get<ResultDto<MachinePeripheralsCanbusDto>>(
      `${login.printerURL}/machine/peripherals/canbus?interface=${canInterface}`
    );
  }

  async getServerFilesList(login: LoginDto, rootFolder = "") {
    const paramString = rootFolder?.length ? `?root=${rootFolder}` : "";
    return this.httpClient.get<ResultDto<ServerFileDto[]>>(`${login.printerURL}/server/files/list${paramString}`);
  }

  async getServerFilesRoots(login: LoginDto) {
    return this.httpClient.get<ResultDto<ServerFileRootDto[]>>(`${login.printerURL}/server/files/roots`);
  }

  async getServerFileMetadata(login: LoginDto, filename: string) {
    return this.httpClient.get<ResultDto<ServerFileMetadataDto>>(
      `${login.printerURL}/server/files/metadata?filename=${filename}`
    );
  }

  async getServerFileMetadataScan(login: LoginDto, filename: string) {
    return this.httpClient.get<ResultDto<ServerFileMetadataDto>>(
      `${login.printerURL}/server/files/metascan?filename=${filename}`
    );
  }

  async getServerFilesThumbnails(login: LoginDto, filename: string) {
    return this.httpClient.get<ResultDto<ServerFileThumbnailDto[]>>(
      `${login.printerURL}/server/files/thumbnails?filename=${filename}`
    );
  }

  async getServerFilesDirectoryInfo(login: LoginDto, path: string, extended: boolean) {
    return this.httpClient.get<ResultDto<ServerFileDirectoryInfoDto>>(
      `${login.printerURL}/server/files/directory?path=${path}&extended=${extended}`
    );
  }

  async postServerFilesDirectory(login: LoginDto, path: string) {
    return this.httpClient.post<ResultDto<ServerFileDirectoryActionDto>>(`${login.printerURL}/server/files/directory`, { path });
  }

  async deleteServerFilesDirectory(login: LoginDto, path: string, force: boolean) {
    return this.httpClient.delete<ResultDto<ServerFileDirectoryActionDto>>(
      `${login.printerURL}/server/files/directory?path=${path}&force=${!!force}`
    );
  }

  async postServerFilesMove(login: LoginDto, source: string, dest: string) {
    return this.httpClient.post<ResultDto<ServerFileDirectoryMovedDto>>(`${login.printerURL}/server/files/directory`, {
      source,
      dest,
    });
  }

  async postServerFilesCopy(login: LoginDto, source: string, dest: string) {
    return this.httpClient.post<ResultDto<ServerFileDirectoryActionDto>>(`${login.printerURL}/server/files/copy`, {
      source,
      dest,
    });
  }

  async postServerFilesZip(login: LoginDto, items: string[], dest: string, store_only: boolean) {
    return this.httpClient.post<ResultDto<ServerFileZipActionDto>>(`${login.printerURL}/server/files/zip`, {
      items,
      store_only,
      dest,
    });
  }

  async getServerFilesDownload(login: LoginDto, root: string, filename: string) {
    return await this.httpClient.get<NodeJS.ReadableStream>(`${login.printerURL}/server/files/${root}/${filename}`, {
      responseType: "stream",
    });
  }

  async postServerFileUpload(
    login: LoginDto,
    multerFileOrBuffer: Buffer | Express.Multer.File,
    progressToken?: string,
    root?: string,
    path?: string,
    checksum?: string
  ) {
    const formData = new FormData();
    if (root?.length) {
      formData.append("root", root);
    }
    if (path?.length) {
      formData.append("path", path);
    }
    if (checksum?.length) {
      formData.append("checksum", checksum);
    }

    let source: ArrayBufferLike | ReadStream = (multerFileOrBuffer as Buffer).buffer;
    const isPhysicalFile = !source;
    if (isPhysicalFile) {
      source = createReadStream((multerFileOrBuffer as Express.Multer.File).path);
    }
    formData.append("file", source, { filename: (multerFileOrBuffer as Express.Multer.File).originalname });

    // Calculate the header that axios uses to determine progress
    const result: number = await new Promise<number>((resolve, reject) => {
      return formData.getLength((err, length) => {
        if (err) resolve(null);
        resolve(length);
      });
    });

    const headers = {
      ...formData.getHeaders(),
      "Content-Length": result,
    };

    return await axios.request({
      method: "POST",
      url: `${login.printerURL}/server/files/upload`,
      data: formData,
      headers,
      onUploadProgress: (p) => {
        if (progressToken) {
          this.eventEmitter2.emit(`${uploadProgressEvent(progressToken)}`, progressToken, p);
        }
      },
    });
  }

  async deleteServerFile(login: LoginDto, root: string, path: string) {
    const url = `${login.printerURL}/server/files/${root}/${path}`;
    return this.httpClient.delete<ResultDto<ServerFileDirectoryActionDto>>(url);
  }

  async getServerFileKlippyLogDownload(login: LoginDto) {
    return this.httpClient.get<string>(`${login.printerURL}/server/files/klippy.log`);
  }

  async getServerFileMoonrakerLogDownload(login: LoginDto) {
    return this.httpClient.get<string>(`${login.printerURL}/server/files/moonraker.log`);
  }

  async postAccessLoginUser(login: LoginDto, username: string, password: string, source: "ldap" | "moonraker" = "moonraker") {
    return this.httpClient.post<ResultDto<AccessLoginResultDto>>("/access/login", {
      username,
      password,
      source,
    });
  }

  async postAccessLogoutUser(login: LoginDto) {
    // requires a bearer mechanism
    return this.httpClient.post<ResultDto<AccessUserResultDto>>(`${login.printerURL}/access/logout`);
  }

  async getAccessUser(login: LoginDto) {
    // requires a bearer mechanism
    return this.httpClient.get<ResultDto<AccessUserDto>>(`${login.printerURL}/access/user`);
  }

  async postAccessCreateUser(login: LoginDto, username: string, password: string) {
    return this.httpClient.post<ResultDto<AccessLoginResultDto>>(`${login.printerURL}/access/login`, {
      username,
      password,
    });
  }

  async deleteAccessUser(login: LoginDto, username: string) {
    return this.httpClient.delete<ResultDto<AccessUserResultDto>>(`${login.printerURL}/access/user`, {
      data: {
        username,
      },
    });
  }

  async listAccessUsers(login: LoginDto) {
    // requires a bearer mechanism
    return this.httpClient.get<ResultDto<AccessUserDto[]>>(`${login.printerURL}/access/user/list`);
  }

  async postAccessResetPassword(login: LoginDto, refresh_token: string) {
    return this.httpClient.post<ResultDto<AccessLoginRefreshDto>>(`${login.printerURL}/access/refresh_jwt`, {
      refresh_token,
    });
  }

  async getAccessOneshotToken(login: LoginDto) {
    return this.httpClient.get<ResultDto<string>>(`${login.printerURL}/access/oneshot_token`);
  }

  async getAccessInfo(login: LoginDto) {
    return this.httpClient.get<ResultDto<AccessInfoDto>>(`${login.printerURL}/access/info`);
  }

  async getAccessApiKey(login: LoginDto) {
    return this.httpClient.get<ResultDto<string>>(`${login.printerURL}/access/api_key`);
  }

  async postAccessApiKeyCreate(login: LoginDto) {
    return this.httpClient.post<ResultDto<string>>(`${login.printerURL}/access/api_key`);
  }

  async getDatabaseNamespaceList(login: LoginDto) {
    return this.httpClient.get<ResultDto<DatabaseNamespaceListDto>>(`${login.printerURL}/database/list`);
  }

  async getDatabaseNamespaceItem(login: LoginDto, namespace: Namespaces, key: string) {
    return this.httpClient.get<ResultDto<DatabaseNamespaceItemDto>>(
      `${login.printerURL}/database/item?namespace=${namespace}&key=${key}`
    );
  }

  async postDatabaseNamespaceItem(
    login: LoginDto,
    namespace: Namespaces,
    key: string,
    value: any,
    typeHint?: "int" | "str" | "bool" | "json"
  ) {
    const typeHintParam = typeHint?.length ? `:${typeHint}` : "";
    return this.httpClient.post<ResultDto<DatabaseNamespaceItemDto>>(
      `${login.printerURL}/database/item?namespace=${namespace}&key=${key}&value${typeHintParam}=${value}`
    );
  }

  async deleteDatabaseNamespaceItem(login: LoginDto, namespace: Namespaces, key: string) {
    return this.httpClient.delete<ResultDto<DatabaseNamespaceItemDto>>(
      `${login.printerURL}/database/item?namespace=${namespace}&key=${key}`
    );
  }

  async getJobQueueStatus(login: LoginDto) {
    return this.httpClient.get<ResultDto<JobQueueStatusDto>>(`${login.printerURL}/job_queue/status`);
  }

  async postJobQueueJob(login: LoginDto, filenames: string[], reset: boolean) {
    // Alternatively param based with comma separated filenames: "POST /server/job_queue/job?filenames=job1.gcode,job2.gcode,subdir/job3.gcode"
    return this.httpClient.post<ResultDto<JobQueueStatusDto>, AxiosResponse<ResultDto<JobQueueStatusDto>>, EnqueueJobDto>(
      `${login.printerURL}/job_queue/job`,
      {
        filenames,
        reset,
      }
    );
  }

  async deleteJobQueueJob(login: LoginDto, jobIds: string[], all?: boolean) {
    const base = `${login.printerURL}/job_queue/job`;
    const url = !!all ? `${base}?all=true` : `${base}?job_ids=${jobIds.join(",")}`;
    return this.httpClient.delete<ResultDto<DatabaseNamespaceItemDto>>(url);
  }

  async postJobQueuePause(login: LoginDto) {
    return this.httpClient.post<ResultDto<JobQueueStatusDto>>(`${login.printerURL}/job_queue/pause`);
  }

  async postJobQueueStart(login: LoginDto) {
    return this.httpClient.post<ResultDto<JobQueueStatusDto>>(`${login.printerURL}/job_queue/start`);
  }

  async postJobQueueJump(login: LoginDto, jobId: string) {
    return this.httpClient.post<ResultDto<JobQueueStatusDto>>(`${login.printerURL}/job_queue/jump?job_id=${jobId}`);
  }

  async getAnnouncementsList(login: LoginDto, includeDismissed: boolean) {
    return this.httpClient.get<ResultDto<AnnouncementListDto>>(
      `${login.printerURL}/server/announcements/list?include_dismissed=${includeDismissed}`
    );
  }

  async postAnnouncementsUpdate(login: LoginDto) {
    return this.httpClient.post<ResultDto<AnnouncementListDto>>(`${login.printerURL}/server/announcements/update`);
  }

  /**
   *
   * @param login
   * @param entryId The entry identifier (name). This field may contain forward slashes, so it should be url escaped when placed in the query string of an http request. This parameter is required.
   * @param wakeTime The time, in seconds, in which the entry's dismissed state will revert to false. This parameter is optional, if omitted the entry will be dismissed indefinitely.
   */
  async postAnnouncementsDismiss(login: LoginDto, entryId: string, wakeTime: number) {
    return this.httpClient.post<ResultDto<AnnouncementEntryIdDto>>(
      `${login.printerURL}/server/announcements/dismiss?entry_id=${encodeURIComponent(entryId)}&wake_time=${wakeTime}`
    );
  }

  async getAnnouncementsFeeds(login: LoginDto) {
    return this.httpClient.get<ResultDto<AnnouncementFeedsDto>>(`${login.printerURL}/server/announcements/feeds`);
  }

  async postAnnouncementsFeedAdd(login: LoginDto, name: string) {
    return this.httpClient.get<ResultDto<AnnouncementActionDto>>(`${login.printerURL}/server/announcements/feeds?name=${name}`);
  }

  async deleteAnnouncementsFeedRemove(login: LoginDto, name: string) {
    return this.httpClient.delete<ResultDto<AnnouncementActionDto>>(
      `${login.printerURL}/server/announcements/feeds?name=${name}`
    );
  }

  async getWebcamList(login: LoginDto) {
    return this.httpClient.get<ResultDto<WebcamListDto>>(`${login.printerURL}/server/webcams/list`);
  }

  async getWebcamItem(login: LoginDto, uid?: string, name?: string) {
    const base = `${login.printerURL}/server/webcams/get_item`;
    const url = !!uid?.length ? `${base}?uid=${uid}` : `${base}?name=${name}`;
    return this.httpClient.get<ResultDto<WebcamItemDto>>(url);
  }

  async postWebcamItemUpdate(login: LoginDto, webcam: Omit<WebcamDto, "source">) {
    return this.httpClient.post<ResultDto<WebcamItemDto>>(`${login.printerURL}/server/webcams/post_item`, webcam);
  }

  async deleteWebcamItem(login: LoginDto, uid?: string, name?: string) {
    const base = `${login.printerURL}/server/webcams/delete_item`;
    const url = !!uid?.length ? `${base}?uid=${uid}` : `${base}?name=${name}`;
    return this.httpClient.get<ResultDto<WebcamItemDto>>(url);
  }

  async postWebcamTest(login: LoginDto, uid?: string, name?: string) {
    const base = `${login.printerURL}/server/webcams/test`;
    const url = !!uid?.length ? `${base}?uid=${uid}` : `${base}?name=${name}`;
    return this.httpClient.get<ResultDto<WebcamTestDto>>(url);
  }

  async getNotifierList(login: LoginDto) {
    return this.httpClient.get<ResultDto<NotifierListDto>>(`${login.printerURL}/server/notifiers/list`);
  }

  async postMachineUpdateStatus(login: LoginDto) {
    // Refresh parameter is deprecated over refresh endpoint
    return this.httpClient.post<ResultDto<MachineUpdateStatusDto>>(`${login.printerURL}/machine/update/status`);
  }

  async postMachineUpdateRefresh(login: LoginDto, name?: string | "moonraker" | "klipper") {
    const base = `${login.printerURL}/machine/update/refresh`;
    const url = !!name ? `${base}` : `${base}?name=${name}`;
    return this.httpClient.post<ResultDto<MachineUpdateStatusDto>>(url);
  }

  async postMachineUpdateFull(login: LoginDto) {
    // Order
    // system if enabled
    // All configured clients
    // Klipper
    // Moonraker
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/update/full`);
  }

  async postMachineUpdateMoonraker(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/update/moonraker`);
  }

  async postMachineUpdateKlipper(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/update/klipper`);
  }

  async postMachineUpdateClient(login: LoginDto, name: string) {
    // [update_manager client client_name] sections (in config)
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/update/client?name=${name}`);
  }

  async postMachineUpdateSystem(login: LoginDto) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/update/system`);
  }

  async postMachineUpdateRecover(login: LoginDto, name?: string | "moonraker" | "klipper", hard: boolean = false) {
    return this.httpClient.post<ResultDto<ActionResultDto>>(
      `${login.printerURL}/machine/update/recover?name=${name}&hard=${hard}`
    );
  }

  async postMachineUpdateRollback(login: LoginDto, name?: string | "moonraker" | "klipper") {
    return this.httpClient.post<ResultDto<ActionResultDto>>(`${login.printerURL}/machine/update/rollback?name=${name}`);
  }

  async getMachineDevicePowerDevices(login: LoginDto) {
    return this.httpClient.get<ResultDto<MachineDevicePowerDevicesDto>>(`${login.printerURL}/machine/device_power/devices`);
  }

  async getMachineDevicePowerDeviceState(login: LoginDto, device: string) {
    return this.httpClient.get<ResultDto<MachineDevicePowerDeviceStateDto>>(
      `${login.printerURL}/machine/device_power/device?device=${device}`
    );
  }

  async postMachineDevicePowerDeviceState(login: LoginDto, device: string, action: "on" | "off" | "toggle") {
    return this.httpClient.post<ResultDto<MachineDevicePowerDeviceStateDto>>(
      `${login.printerURL}/machine/device_power/device?device=${device}&action=${action}`
    );
  }

  async getMachineDevicePowerBatchDeviceState(login: LoginDto, devices: string[]) {
    return this.httpClient.get<ResultDto<MachineDevicePowerDeviceStateDto>>(
      `${login.printerURL}/machine/device_power/status?${devices.join("&")}`
    );
  }

  async postMachineDevicePowerBatchPowerOn(login: LoginDto, device: string) {
    return this.httpClient.post<ResultDto<MachineDevicePowerDeviceStateDto>>(
      `${login.printerURL}/machine/device_power/on?device=${device}`
    );
  }

  async postMachineDevicePowerBatchPowerOff(login: LoginDto, device: string) {
    return this.httpClient.post<ResultDto<MachineDevicePowerDeviceStateDto>>(
      `${login.printerURL}/machine/device_power/off?device=${device}`
    );
  }

  async getMachineWledStrips(login: LoginDto) {
    return this.httpClient.get<ResultDto<MachineWledStripsDto>>(`${login.printerURL}/machine/wled/strips`);
  }

  async getMachineWledStatuses(login: LoginDto, strips: string[]) {
    return this.httpClient.get<ResultDto<MachineWledStripsDto>>(`${login.printerURL}/machine/wled/status?${strips.join("&")}`);
  }

  async postMachineWledPowerOn(login: LoginDto, strips: string[]) {
    return this.httpClient.post<ResultDto<MachineWledStripsDto>>(`${login.printerURL}/machine/wled/on?${strips.join("&")}`);
  }

  async postMachineWledPowerOff(login: LoginDto, strips: string[]) {
    return this.httpClient.post<ResultDto<MachineWledStripsDto>>(`${login.printerURL}/machine/wled/off?${strips.join("&")}`);
  }

  async postMachineWledPowerStripAction(login: LoginDto, strips: string[]) {
    return this.httpClient.post<ResultDto<MachineWledStripsDto>>(`${login.printerURL}/machine/wled/toggle?${strips.join("&")}`);
  }

  async getMachineWledStripAction(
    login: LoginDto,
    strip: string,
    action: "control" | "on" | "off",
    controlParams: Record<string, number>
  ) {
    const queryParams = Object.entries(controlParams)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    return this.httpClient.get<ResultDto<MachineWledStripsDto>>(
      `${login.printerURL}/machine/wled/strip?strip=${strip}&action=${action}&${queryParams}`
    );
  }

  async getServerSensorsList(login: LoginDto) {
    return this.httpClient.get<ResultDto<SensorListDto>>(`${login.printerURL}/server/sensors/list`);
  }

  async getServerSensorItem(login: LoginDto, sensor: string) {
    return this.httpClient.get<ResultDto<SensorDto>>(`${login.printerURL}/server/sensors/info?sensor=${sensor}`);
  }

  async getServerSensorMeasurements(login: LoginDto, sensor: string) {
    return this.httpClient.get<ResultDto<SensorsMeasurementsDto>>(
      `${login.printerURL}/server/sensors/measurements?sensor=${sensor}`
    );
  }

  async getServerSensorMeasurementsBatch(login: LoginDto) {
    return this.httpClient.get<ResultDto<SensorsMeasurementsDto>>(`${login.printerURL}/server/sensors/measurements`);
  }

  async getServerSpoolmanStatus(login: LoginDto) {
    return this.httpClient.get<ResultDto<SpoolmanStatusDto>>(`${login.printerURL}/server/spoolman/status`);
  }

  async postServerSpoolmanActiveSpool(login: LoginDto, spoolId: number) {
    return this.httpClient.post<ResultDto<SpoolmanActiveSpoolDto>>(`${login.printerURL}/server/spoolman/spool_id`, {
      spool_id: spoolId,
    });
  }

  async getServerSpoolmanActiveSpool(login: LoginDto) {
    return this.httpClient.get<ResultDto<SpoolmanActiveSpoolDto>>(`${login.printerURL}/server/spoolman/spool_id`);
  }

  async postServerSpoolmanProxyRequest<I, O>(login: LoginDto, body?: SpoolmanProxyRequestDto<I>) {
    // Spoolman v1 will not wrap responses! Errors are proxied directly.
    return this.httpClient.post<SpoolmanResponseDto<O>, AxiosResponse<SpoolmanResponseDto<O>>, SpoolmanProxyRequestDto<I>>(
      `${login.printerURL}/server/spoolman/proxy`,
      body
    );
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getApiVersion(login: LoginDto) {
    return this.httpClient.get<ApiVersionDto>(`${login.printerURL}/api/version`);
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getServerVersion(login: LoginDto) {
    return this.httpClient.get<ServerVersionDto>(`${login.printerURL}/api/server`);
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getApiLogin(login: LoginDto) {
    return this.httpClient.get<ApiLoginDto>(`${login.printerURL}/api/login`);
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getApiSettings(login: LoginDto) {
    return this.httpClient.get<ApiSettingsDto>(`${login.printerURL}/api/settings`);
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   * @param commands
   */
  // async postFilesLocalUpload(login: LoginDto) {
  //   // This is just an alias
  //   return this.postServerFileUpload(login);
  // }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getApiJob(login: LoginDto) {
    return this.httpClient.get<ApiJobDto>(`${login.printerURL}/api/job`);
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getApiPrinter(login: LoginDto) {
    return this.httpClient.get<ApiPrinterDto>(`${login.printerURL}/api/printer`);
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   * @param commands
   */
  async postApiPrinterCommand(login: LoginDto, commands: string[]) {
    return this.httpClient.post<{}>(`${login.printerURL}/api/command`, {
      commands,
    });
  }

  /**
   * @deprecated API might not be available in the future
   * @param login
   */
  async getApiProfiles(login: LoginDto) {
    return this.httpClient.get<ApiProfilesDto>(`${login.printerURL}/api/printerprofiles`);
  }

  async getServerHistoryList(
    login: LoginDto,
    limit: number,
    start: number,
    since?: number,
    before?: number,
    order: "asc" | "desc" = "desc"
  ) {
    let params = `limit=${limit}&start=${start}&order=${order}`;
    if (!!before || before === 0) {
      params += "&before=" + before;
    }
    if (!!since || since === 0) {
      params += "&since=" + since;
    }
    return this.httpClient.get<ResultDto<HistoryListDto>>(`${login.printerURL}/server/history/list?${params}`);
  }

  async getServerHistoryTotals(login: LoginDto) {
    return this.httpClient.get<ResultDto<HistoryTotalsDto>>(`${login.printerURL}/server/history/totals`);
  }

  async postServerHistoryResetTotals(login: LoginDto) {
    return this.httpClient.post<ResultDto<HistoryLastTotalsDto>>(`${login.printerURL}/server/history/reset_totals`);
  }

  async getServerHistoryJob(login: LoginDto, uid: string) {
    return this.httpClient.get<ResultDto<HistoryJobDto>>(`${login.printerURL}/server/history/job?uid=${uid}`);
  }

  async deleteServerHistoryJob(login: LoginDto, uid?: string) {
    const base = `${login.printerURL}/server/history/job`;
    const url = !!uid?.length ? `${base}?uid=${uid}` : `${base}?all=true`;
    return this.httpClient.get<ResultDto<string[]>>(url);
  }
}
