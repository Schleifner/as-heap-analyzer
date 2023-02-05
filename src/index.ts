import { splitMemoryBlock } from "./analysis";
import { calculateMemoryStart } from "./memoryStart";
import { extractInputInfoFromWasm } from "./wasmParser";

type AnalysisResult = Map<string, number>;

export function analysis(memory: Uint8Array, wasmModule: Uint8Array): AnalysisResult {
  const info = extractInputInfoFromWasm(wasmModule);
  const memStartI32 = calculateMemoryStart(info.heapBase) / 4;
  const data = new Uint32Array(memory.buffer);

  const blockInfos = splitMemoryBlock(data, memStartI32);

  const result: AnalysisResult = new Map();

  for (const [, v] of blockInfos) {
    if (v.isManagedMemoryBlock() && v.isAllocated()) {
      const key = info.classInfo[v.runtimeId];
      if (key == undefined) {
        continue;
      }
      result.set(key, (result.get(key) ?? 0) + v.size);
    }
  }

  return result;
}
