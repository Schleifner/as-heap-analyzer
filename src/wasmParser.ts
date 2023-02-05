import { BinaryReader, BinaryReaderState, ISectionInformation, SectionCode, bytesToString } from "wasmparser";

interface AnalysisInput {
  heapBase: number;
  classInfo: Record<number, string>;
}

export function extractInputInfoFromWasm(wasmModule: Uint8Array): AnalysisInput {
  const parser = new BinaryReader();
  parser.setData(wasmModule.buffer, 0, wasmModule.length);

  for (;;) {
    if (!parser.read()) {
      throw Error(`invalid wasm in ${parser.position}`);
    }
    switch (parser.state) {
      case BinaryReaderState.ERROR: {
        throw Error(`invalid wasm in ${parser.position}`);
      }
      case BinaryReaderState.END_WASM: {
        if (parser.hasMoreBytes()) {
          throw Error(`invalid wasm in ${parser.position}`);
        } else {
          throw Error(`not transformed wasm`);
        }
      }
      case BinaryReaderState.BEGIN_SECTION: {
        const sectionInfo = parser.result as ISectionInformation;
        if (sectionInfo.id === SectionCode.Custom && bytesToString(sectionInfo.name) == "heapAnalyzerInfo") {
          parser.fetchSectionRawData();
        } else {
          parser.skipSection();
        }
        break;
      }
      case BinaryReaderState.SECTION_RAW_DATA: {
        return JSON.parse(bytesToString(parser.result as Uint8Array)) as AnalysisInput;
      }
    }
  }
}
