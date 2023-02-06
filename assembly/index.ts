export const memoryDetail = new Map<i32, i32>();

export function getUsedMemorySize(): i32 {
  memoryDetail.clear();
  const rootOffset = (u32(__heap_base) + 15) & ~15;
  const memStart = ((rootOffset + 1572 + 4 + 15) & ~15) - 4;
  let result = memStart;
  let next = memStart;
  while (next < u32(memory.size()) * 64 * 1024 - 4) {
    const currentOffset = next;
    const memoryInfo = load<u32>(currentOffset);
    next += 4 + memoryInfo;
    const blockSize = (4 + memoryInfo) & ~3;
    if (blockSize <= 12) {
      return -1;
    }
    if ((memoryInfo & 1) == 0) {
      result += blockSize;
    }
    const objectSize = load<u32>(currentOffset, 4 * 4);
    if (objectSize + 4 * 4 > memoryInfo) {
      continue;
    }
    if (load<u32>(currentOffset, 4) == 0 && load<u32>(currentOffset, 2 * 4) == 0) {
      continue;
    }
    const runtimeId = load<u32>(currentOffset, 3 * 4);
    if (memoryDetail.has(runtimeId)) {
      memoryDetail.set(runtimeId, memoryDetail.get(runtimeId) + blockSize);
    } else {
      memoryDetail.set(runtimeId, blockSize);
    }
  }
  return result;
}

export function dumpUsedMemoryDetail(): string {
  const totalUsage = getUsedMemorySize();
  let result = `totalUsage: ${totalUsage}\n`;
  const k = memoryDetail.keys();
  const v = memoryDetail.values();
  for (let i: i32 = 0; i < k.length; i++) {
    result += `class id ${k[i]} uses ${v[i]} bytes memory\n`;
  }
  return result;
}
