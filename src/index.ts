import * as wasmParser from "wasmparser/dist/esm/WasmParser";

const AL_BITS = 4;
const AL_SIZE = 1 << AL_BITS;
const AL_MASK = AL_SIZE - 1;

const SL_BITS = 4;
const SL_SIZE = 1 << SL_BITS;

const SB_BITS = SL_BITS + AL_BITS;
const SB_SIZE = 1 << SB_BITS;

const FL_BITS = 31 - SB_BITS;

const SL_START = 4;
const SL_END = SL_START + (FL_BITS << 2);
const HL_START = (SL_END + AL_MASK) & ~AL_MASK;
const HL_END = HL_START + FL_BITS * SL_SIZE * 4;
const ROOT_SIZE = HL_END + 4;

const BLOCK_OVERHEAD = 4;

type AnalysisInput = {
  heapBase: number;
  classInfo: {
    [k: number]: string;
  };
};

type AnalysisResult = Map<string | number, number>;

function extractInputInfoFromWasm(wasmModule: Uint8Array): AnalysisInput {
  let parser = new wasmParser.BinaryReader();
  parser.setData(wasmModule.buffer, 0, wasmModule.length);

  while (true) {
    if (!parser.read()) {
      throw Error(`invalid wasm in ${parser.position}`);
    }
    switch (parser.state) {
      case wasmParser.BinaryReaderState.ERROR: {
        throw Error(`invalid wasm in ${parser.position}`);
      }
      case wasmParser.BinaryReaderState.END_WASM: {
        if (parser.hasMoreBytes()) {
          throw Error(`invalid wasm in ${parser.position}`);
        } else {
          throw Error(`not transformed wasm`);
        }
      }
      case wasmParser.BinaryReaderState.BEGIN_SECTION: {
        const sectionInfo = <wasmParser.ISectionInformation>parser.result;
        if (
          sectionInfo.id === wasmParser.SectionCode.Custom &&
          wasmParser.bytesToString(sectionInfo.name) == "heapAnalyzerInfo"
        ) {
          parser.fetchSectionRawData();
        } else {
          parser.skipSection();
        }
        break;
      }
      case wasmParser.BinaryReaderState.SECTION_RAW_DATA: {
        return JSON.parse(wasmParser.bytesToString(parser.result as Uint8Array));
      }
    }
  }
}

export function analysis(memory: WebAssembly.Memory, wasmModule: Uint8Array): AnalysisResult {
  let result: AnalysisResult = new Map();
  const info = extractInputInfoFromWasm(wasmModule);
  const heapBase = info.heapBase; // from wasm
  const rootOffset = (heapBase + AL_MASK) & ~AL_MASK;
  const memStart = ((rootOffset + ROOT_SIZE + BLOCK_OVERHEAD + AL_MASK) & ~AL_MASK) - BLOCK_OVERHEAD;
  const memStartI32 = memStart / 4;
  const datas = new Uint32Array(memory.buffer);

  let next = memStartI32;
  while (next < datas.length - 1) {
    const currentOffset = next;
    const mminfo = datas[next]!;
    if (mminfo == undefined) {
      break;
    }
    next += 1 + mminfo / 4;

    const blockSize = (4 + mminfo) & ~3;
    const blockFree = (mminfo & 1) == 1;
    if (!blockFree) {
      const rtid = datas[currentOffset + 3];
      if (rtid == undefined || info.classInfo[rtid] == undefined) {
        // unmanaged class
        break;
      }
      const key = info.classInfo[rtid]!;
      if (!result.has(key)) {
        result.set(key, 0);
      }
      result.set(key, result.get(key)! + blockSize);
    }
  }

  return result;
}
