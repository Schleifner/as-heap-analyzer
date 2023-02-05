import { calculateMemoryStart } from "./memoryStart";
import { extractInputInfoFromWasm } from "./wasmParser";

type AnalysisResult = Map<string, number>;

export function analysis(memory: WebAssembly.Memory, wasmModule: Uint8Array): AnalysisResult {
  const result: AnalysisResult = new Map();
  const info = extractInputInfoFromWasm(wasmModule);
  const memStartI32 = calculateMemoryStart(info.heapBase) / 4;
  const datas = new Uint32Array(memory.buffer);

  let next = memStartI32;
  while (next < datas.length - 1) {
    const currentOffset = next;
    const mminfo = datas[next];
    if (mminfo == undefined) {
      break;
    }
    next += 1 + mminfo / 4;

    const blockSize = (4 + mminfo) & ~3;
    const blockFree = (mminfo & 1) == 1;
    if (!blockFree) {
      const rtid = datas[currentOffset + 3];
      if (rtid == undefined) {
        break;
      }
      const key = info.classInfo[rtid];
      if (key == undefined) {
        // unmanaged class
        break;
      }
      result.set(key, (result.get(key) ?? 0) + blockSize);
    }
  }

  return result;
}
