import { PrinterFilesStore } from "@/state/printer-files.store";
import { OctoPrintApiService } from "@/services/octoprint/octoprint-api.service";
import { PrinterSocketStore } from "@/state/printer-socket.store";
import { PrinterCache } from "@/state/printer.cache";
import { PrinterEventsCache } from "@/state/printer-events.cache";
import { IPrinterService } from "@/services/interfaces/printer.service.interface";
import { IdType } from "@/shared.constants";
import { CreateOrUpdatePrinterFileDto } from "./interfaces/printer-file.dto";
import { ConnectionState } from "@/services/octoprint/dto/connection.dto";

enum ReprintState {
  PrinterNotAvailable = 0,
  NoLastPrint = 1,
  LastPrintReady = 2,
}

interface ReprintFileDto {
  file?: CreateOrUpdatePrinterFileDto;
  reprintState: ReprintState;
  connectionState: ConnectionState | null;
  printerId: IdType;
}

interface BatchSingletonModel {
  success?: boolean;
  failure?: boolean;
  printerId: string;
  time: number;
  error?: string;
}

type BatchModel = Array<BatchSingletonModel>;

export class BatchCallService {
  octoPrintApiService: OctoPrintApiService;
  printerSocketStore: PrinterSocketStore;
  printerCache: PrinterCache;
  printerEventsCache: PrinterEventsCache;
  printerFilesStore: PrinterFilesStore;
  printerService: IPrinterService;

  constructor({
    octoPrintApiService,
    printerCache,
    printerEventsCache,
    printerSocketStore,
    printerFilesStore,
    printerService,
  }: {
    octoPrintApiService: OctoPrintApiService;
    printerCache: PrinterCache;
    printerEventsCache: PrinterEventsCache;
    printerSocketStore: PrinterSocketStore;
    printerFilesStore: PrinterFilesStore;
    printerService: IPrinterService;
  }) {
    this.octoPrintApiService = octoPrintApiService;
    this.printerCache = printerCache;
    this.printerEventsCache = printerEventsCache;
    this.printerSocketStore = printerSocketStore;
    this.printerFilesStore = printerFilesStore;
    this.printerService = printerService;
  }

  async batchTogglePrintersEnabled(
    printerIds: string[],
    enabled: boolean
  ): Promise<
    {
      failure?: boolean;
      error?: any;
      success?: boolean;
      printerId: string;
      time: number;
    }[]
  > {
    const promises = [];
    for (const printerId of printerIds) {
      let promise: Promise<any>;
      const printerDto = await this.printerCache.getValue(printerId);
      if (!printerDto) continue;

      const time = Date.now();
      if (enabled) {
        // If disabled, but not in maintenance, enable the printer
        if (!printerDto.enabled && !printerDto.disabledReason?.length) {
          promise = this.printerService
            .updateEnabled(printerId, true)
            .then(() => {
              return { success: true, printerId, time: Date.now() - time };
            })
            .catch((e) => {
              return { failure: true, error: e.message, printerId, time: Date.now() - time };
            });
        }
      } else {
        // If enabled, disable the printer
        if (printerDto.enabled) {
          promise = this.printerService
            .updateEnabled(printerId, false)
            .then(() => {
              return { success: true, printerId, time: Date.now() - time };
            })
            .catch((e) => {
              return { failure: true, error: e.message, printerId, time: Date.now() - time };
            });
        }
      }
      promises.push(promise);
    }

    return await Promise.all(promises);
  }

  batchConnectSocket(printerIds: string[]): void {
    for (const printerId of printerIds) {
      this.printerSocketStore.reconnectOctoPrint(printerId);
    }
  }

  async batchConnectUsb(printerIds: string[]): Promise<Awaited<BatchModel>[]> {
    const promises = [];
    for (const printerId of printerIds) {
      const printerLogin = await this.printerCache.getLoginDtoAsync(printerId);
      const time = Date.now();

      const command = this.octoPrintApiService.connectCommand;
      const promise = this.octoPrintApiService
        .sendConnectionCommand(printerLogin, command)
        .then(() => {
          return { success: true, printerId, time: Date.now() - time };
        })
        .catch((e) => {
          return { failure: true, error: e.message, printerId, time: Date.now() - time };
        });

      promises.push(promise);
    }
    return await Promise.all(promises);
  }

  async getBatchPrinterReprintFile(printerIds: IdType[]): Promise<ReprintFileDto[]> {
    const promises = [];
    for (const printerId of printerIds) {
      const promise = new Promise<ReprintFileDto>(async (resolve, _) => {
        try {
          const login = await this.printerCache.getLoginDtoAsync(printerId);
          const files = (await this.octoPrintApiService.getLocalFiles(login, true)).filter((f) => f?.prints?.last?.date);

          const connected = await this.octoPrintApiService.getConnection(login);
          const connectionState = connected.current?.state;

          // OctoPrint sorts by last print time by default
          // files.sort((f1, f2) => {
          //   return f1?.prints?.last?.date > f2?.prints?.last?.date ? 1 : -1;
          // });

          if (files?.length == 0) {
            return resolve({ connectionState, printerId, reprintState: ReprintState.NoLastPrint });
          }

          return resolve({
            connectionState,
            file: files[0],
            printerId,
            reprintState: ReprintState.LastPrintReady,
          });
        } catch (e) {
          return resolve({
            connectionState: null,
            printerId,
            reprintState: ReprintState.PrinterNotAvailable,
          });
        }
      });
      promises.push(promise);
    }

    return await Promise.all(promises);
  }

  async batchReprintCalls(printerIdFileList: { printerId: string; file: string }[]): Promise<Awaited<BatchModel>[]> {
    const promises = [];
    for (const printerIdFile of printerIdFileList) {
      const printerId = printerIdFile;
      const printerLogin = await this.printerCache.getLoginDtoAsync(printerId);

      // TODO test this
      let reprintPath = await this.printerEventsCache.getPrinterSocketEvents(printerId)?.current?.job?.file?.path;
      if (!reprintPath?.length) {
        const files = await this.printerFilesStore.getFiles(printerId)?.files;
        if (files?.length) {
          files.sort((f1, f2) => {
            // Sort by date, newest first
            return f1.date < f2.date ? 1 : -1;
          });

          reprintPath = files[0].path;
        }

        if (!files?.length) {
          promises.push(Promise.resolve({ failure: true, error: "No file to reprint", printerId }));
          continue;
        }
      }

      const time = Date.now();
      const promise = this.octoPrintApiService
        .selectPrintFile(printerLogin, reprintPath, true)
        .then(() => {
          return { success: true, printerId, time: Date.now() - time };
        })
        .catch((e) => {
          return { failure: true, error: e.message, printerId, time: Date.now() - time };
        });

      promises.push(promise);
    }
    return await Promise.all(promises);
  }
}
