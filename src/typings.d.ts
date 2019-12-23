import * as L from 'leaflet';

type LandscapeModeType = 'Landscape';
type PortraitModeType = 'Portrait';
type AutoModeType = 'Auto';
type CustomModeType = 'Custom';

type ModeType = LandscapeModeType | PortraitModeType | AutoModeType | CustomModeType;

declare module 'leaflet' {
  namespace control {
    function browserPrint(options?: BrowserPrintControlOptions): Control.BrowserPrint;

    namespace browserPrint {
      function mode(mode: ModeType, title?: string, pageSize?: string)

      namespace mode {
        function portrait(title?: string, pageSize?: string, action?: any);
        function landscape(title?: string, pageSize?: string, action?: any);
        function auto(title?: string, pageSize?: string, action?: any);
        function custom(title?: string, pageSize?: string, action?: any);
      }
    }
  }

  interface BrowserPrintControlOptions extends L.ControlOptions {
    title?: string;
    documentTitle?: string;
    printLayer?: L.TileLayer;
    printModes?: ModeType[];
    closePopupsOnPrint?: boolean;
    contentSelector?: string;
    pageSelector?: string;
    manualMode?: boolean;
    customPrintStyle?: L.PolylineOptions;
  }

  namespace Control {
    interface BrowserPrint {
      addTo(map: L.Map): HTMLDivElement;
    }

    namespace BrowserPrint {

      namespace Mode {
        type Landscape = LandscapeModeType;
        type Portrait = PortraitModeType;
        type Auto = AutoModeType;
        type Custom = CustomModeType;
      }

      function Mode(mode: ModeType, title?: string, pageSize?: string)

      namespace Size {
        interface SizeDefinition {
          Width: number;
          Height: number;
        }

        const A: SizeDefinition;
        const B: SizeDefinition;
        const C: SizeDefinition;
        const D: SizeDefinition;
        const LETTER: SizeDefinition;
        const HALFLETTER: SizeDefinition;
        const LEGAL: SizeDefinition;
        const JUNIORLEGAL: SizeDefinition;
        const TABLOID: SizeDefinition;
        const LEDGER: SizeDefinition;
      }

      namespace Event {
        const PrintInit: 'browser-print-init';
        const PrePrint: 'browser-pre-print';
        const PrintStart: 'browser-print-start';
        const Print: 'browser-print';
        const PrintEnd: 'browser-print-end';
      }
    }
  }
}
